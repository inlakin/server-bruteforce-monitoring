#! /usr/bin/env python
#
# -*- coding: utf-8 -*-

from app import app, lm
from flask import send_file, request, redirect, render_template, url_for, flash, json
from flask_login import login_user, logout_user, login_required, current_user
from pymongo import MongoClient
from .user import User
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from bson import ObjectId

import pymongo
import paramiko

import geoip2.database


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)

        return json.JSONEncoder.default(self, o)


@app.route('/')
def index():
    return send_file('templates/index.html')


@app.route('/auth/login', methods=['POST'])
def login():  

    data = json.loads(request.data.decode())

    email = data['email']
    password = data['password']

    user = app.config['USERS_COLLECTION'].find_one({"_id": email})
    if user and User.validate_login(user['password'], password):
        user_obj = User(user['_id'])
        login_user(user_obj)
        # print JSONEncoder().encode(user_obj)
        print "logged in for ", user['_id']
        ret = {
            'result': True,
            'email': user['_id']
        }
    else:
        print "failed logging in"
        ret = {
            'result': False
        }

    return json.dumps(ret)


@app.route('/auth/register', methods=['POST'])
def register():

    data = json.loads(request.data.decode())
    collection = MongoClient()['server-monitoring']['users']
    email = data['email']
    password = data['password']

    pass_hash = generate_password_hash(password, method='pbkdf2:sha256')

    # Insert the user in the DB
    try:
        collection.insert({"_id": email, "password": pass_hash})
        print "User created."
        ret = {
            'result': True
        }
    except pymongo.errors.DuplicateKeyError, e:
        print str(e)
        ret = {
            'result': False
        }
    # except Exception, e:
    #     print "str(e)";

    return json.dumps(ret)


@app.route('/auth/logout', methods=['POST', 'GET'])
def logout():
    try:
        logout_user()
        print "logged out"
        ret = {
            'message': "Logout successfully"
        }
    except Exception, e:
        print "failed logging out"
        print str(e)
        ret = {
            'message': 'failed logging out'
        }
    return json.dumps(ret)


@app.route('/auth/status', methods=['GET'])
def status():
    response = {'status':''}

    if current_user.is_authenticated:
        response['status'] = True
    else:
        response['status'] = False

    return json.dumps(response)


@lm.user_loader
def load_user(email):
    u = app.config['USERS_COLLECTION'].find_one({"_id": email})
    if not u:
        return None
    return User(u['_id'])


@app.route('/addserver', methods=['POST'])
@login_required
def add_server():
    
    data       = json.loads(request.data.decode())
    collection = MongoClient()['server-monitoring']['clients']
    
    name     = data['name']
    username = data['username']
    hostname = data['hostname']
    port     = data['port']
    email    = data['email']
    password = data['password']

    pass_hash = generate_password_hash(password, method='pbkdf2:sha256')
    try:
        collection.insert({
            "hostname": hostname,
            "name": name,
            "username" : username,
            "port" : port,
            "email": email,
            "up": False,
            "password": pass_hash
            })   
        print "[*] Client added : " + hostname + " for " + email
        ret = {'result': True}
    except pymongo.errors.DuplicateKeyError, e:
        print str(e)
        ret = {'result': False}

    return json.dumps(ret)


@app.route('/getservers', methods=['POST'])
@login_required
def getservers():

    data = json.loads(request.data.decode())

    email = data['email']

    print "[*] Fetching servers for ", email
    clients_list = []

    clients = app.config['CLIENTS_COLLECTION'].find({'email': email})

    if clients is not None:
        print clients
        ret = [{'result': True}]
        for c in clients:
            ret.append(c)
    else:
        print "[DEBUG] No servers found"
        ret = [{'result': False}]

    return JSONEncoder().encode(ret)

def add_to_server_connected(hostname, email, paramiko_ssh_client_obj):

    global servers_connected
    global nb_servers_connected

    print "Adding " + hostname + " to servers connected list"
    servers_connected.append({'hostname':hostname,'email':email,'ssh_obj':paramiko_ssh_client_obj})

def remove_from_server_connected(hostname, email):

    global servers_connected
    global nb_servers_connected

    print "Removing " + hostname + " from servers connected list"

    servers_connected.pop("hostname")

@app.route('/connect', methods=['POST'])
@login_required
def connect():

    global servers_connected
    # need to fetch the password in DB
    
    data = json.loads(request.data.decode())

    try:

        hostname = data['hostname']
        email    = data['email']
        password = data['password']
    
        try:

            print "[DEBUG] Attempting to connect to " + hostname + " " + email + " " + password
            ssh_client = app.config['CLIENTS_COLLECTION'].find({'hostname':hostname, 'email':email})
            if ssh_client is not None:
                
                db_obj = ssh_client[0]
                
                # ATTEMPT CONNECTION HERE
                ssh = paramiko.SSHClient()

                ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                hostname = db_obj['hostname']
                username = db_obj['username']
                password_hash = db_obj['password']

                print "[*] Connecting to " + hostname + " ..." 
                
                if check_password_hash(password_hash,password):
                    try:
                        ssh.connect(hostname, int(db_obj['port']), username=username, password=password)


                        ret = {
                            'result': True,
                        }

                        app.config['CLIENTS_COLLECTION'].update({'hostname':hostname, 'email':email}, {
                            'username':db_obj['username'],
                            'name':db_obj['name'],
                            'hostname':db_obj['hostname'],
                            'up':True,
                            'email':db_obj['email'],
                            '_id':db_obj['_id'],
                            'port':db_obj['port']      
                            })

                        ssh_client = app.config['CLIENTS_COLLECTION'].find({'hostname':hostname, 'email':email})
                    
                        if ssh_client is not None:
                            print "[DEBUG] " + ssh_client[0]['hostname'] + " up ? " + str(ssh_client[0]['up'])
                            
                            if ssh_client[0]['up'] == True:
                                ret = {'result':True}
                                print "Connected to " + hostname
                            else:
                                print "Something went wrong while updating client status in DB"                    
                                ret = {'result': False}
                        else:
                            print "Not found"
                            ret = {'result':False}

                    except paramiko.SSHException:
                        print "[-] Connection failed"
                        ret = {'result': False, 'message':'Connection failed.'}
                else:
                    ret = {'result':False, 'message':"Wrong password."}
                    print "[Debug] Password doesn't match"
            else:
                print "Host not found in DB"
                ret = {'result': False, 'message':'Host not found'}
        except Exception, e:
            print str(e)
            ret = {'result': False, 'message':'Connection failed.'}

    except Exception, e:
        print str(e)
        print "[DEBUG] Failed parsing arguments"
        ret = {'result':False, 'message': 'Blank password'}



    

    return json.dumps(ret)


@app.route('/betadisconnect', methods=['POST'])
@login_required
def betadisconnect():
    data = json.loads(request.data.decode())

    hostname = data['hostname']
    email    = data['email']

    try:
        ssh_client = app.config['CLIENTS_COLLECTION'].find({'hostname':hostname, 'email':email})
        
        if ssh_client is not None:
            db_obj = ssh_client[0]
            
            if db_obj['up'] == False:
                ret = {'result':False}
                print "Not connected to this server"
            else:
                try:
                    app.config['CLIENTS_COLLECTION'].update({'hostname':hostname, 'email':email}, {
                        'username':db_obj['username'],
                        'name':db_obj['name'],
                        'hostname':db_obj['hostname'],
                        'up':False,
                        'email':db_obj['email'],
                        '_id':db_obj['_id'],
                        'port':db_obj['port']      
                        })
                    ssh_client = app.config['CLIENTS_COLLECTION'].find({'hostname':hostname, 'email':email})
                    
                    if ssh_client is not None:
                        ret = {'result':True}
                        print "Host " + hostname + " disconnected"

                    else:
                        ret = {'result':False}
                        print "Failed to disconnect"

                except Exception, e:
                    print str(e)
                    ret = {'result': False}
            
        else:
            print "Not found in DB"

    except Exception, e:
        print str(e)
        ret = {'result':False}

    return json.dumps(ret)


@app.route('/deleteServer', methods=['POST'])
@login_required
def deleteServer():
    data = json.loads(request.data.decode())

    hostname = data['hostname']
    email    = data['email']

    print "[*] Removing " + hostname + " from DB ..."

    try:
        app.config['CLIENTS_COLLECTION'].remove({'hostname':hostname, 'email':email})
        print "... done"
        ret = {'result' : True}
    except Exception, e:
        print str(e)
        ret = {'result': False}
        print "... failed !"


    return json.dumps(ret)


@app.route('/verify', methods=['POST'])
@login_required
def verifyServer():
    data = json.loads(request.data.decode())

    hostname = data['hostname']
    email    = data['email']

    print "[*] Verifying " + email + " @ " + hostname
    try:
        res = app.config['CLIENTS_COLLECTION'].find({
            'hostname':hostname,
            'email':email
            })
        server = []

        if res is not None:
            server = res[0]
            ret = {'result':True}
        else:
            ret = {'result':False}
    except Exception, e:
        print str(e)
        ret = {'result':False}

    return json.dumps(ret)


@app.route('/isConnected', methods=['POST'])
@login_required
def isConnected():
    data = json.loads(request.data.decode())

    hostname = data['hostname']
    email    = data['email']

    print "[*] " + email + " @ " + hostname + " is up ?"
    try:
        res = app.config['CLIENTS_COLLECTION'].find({
            'hostname':hostname,
            'email':email
            })
        server = []

        if res is not None:
            server = res[0]
            if server['up'] == True:
                print "Server is up and running"
                ret = {'result':True}
            else:
                print "Server is down"
                ret = {'result':False}
        else:
            print "Server not found"
            ret = {'result':False}
    except Exception, e:
        print str(e)
        ret = {'result':False}

    return json.dumps(ret)



@app.route('/exec_cmd', methods=['POST'])
@login_required
def exec_cmd():
    global bruteforce_ip_list
    # data = json.loads(request.data.decode())

    # email    = data['email']
    # hostname = data['hostname']
    # cmd      = data['cmd']


    # print "CMD : ", cmd, " for ", email, " at ", hostname
    reader = geoip2.database.Reader('app/res/GeoLite2-City.mmdb')

    file = open('./app/res/ip_auth_uniq.txt', "r")
    
    bruteforce_ip_list = []
    nb_ip              = 0

    for ip in file:
        r = {}
        nb_ip += 1
        if ip[0] == "0":
            try:
                response = reader.city(ip[1:].strip('\n'))
                r['ip']          = ip[1:].strip('\n')
                r['country']     = response.country.name
                r['city']        = response.city.name
                r['postal_code'] = response.postal.code
                r['latitude']    = response.location.latitude
                r['longitude']   = response.location.longitude
                # bruteforce_ip_list.append(r)
            except Exception, e:
              print str(e)
            # r['ip'] = ip[1:].strip('\n')
        else:
            try:
                response = reader.city(ip.strip('\n'))
                r['ip']          = ip.strip('\n')
                r['country']     = response.country.name
                r['city']        = response.city.name
                r['postal_code'] = response.postal.code
                r['latitude']    = response.location.latitude
                r['longitude']   = response.location.longitude
            except Exception, e:
              print str(e)
            # r['ip'] = ip.strip('\n')

        bruteforce_ip_list.append(r)

    print "Found " + str(nb_ip) + " ip(s)"
    print type(bruteforce_ip_list)
   


    ret = [{'result': True}]
    ret.append(bruteforce_ip_list)

    file.close()
    return json.dumps(ret)

# @app.route('/process-bruteforce-attempts', methods=['POST'])
# @login_required
# def process():

#     data = json.loads(request.data.decode())

#     req = data['request']
#     bl = bruteforce_ip_list

#     if len(bl) is not None:
#         print "[DEBUG] Fetched BL"
#     if 'country' in req:

        # Process attempts by countries filtering
        # 

# @app.route("/exec", methods=['POST'])
# def exec(request):
#     # Check if user is connected (ssh)
#     # Check if user is looged in
#     # Execute command
#     # Output the results
    
#     # stdin,stdout,stderr = ssh.exec_command("zgrep 'Failed password for' /var/log/auth.log* | grep -Po '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq")
