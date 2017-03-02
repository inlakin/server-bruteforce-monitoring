#! /usr/bin/env python
#
# -*- coding:utf-8 -*-

from app import app, lm
from flask import send_file, request, redirect, render_template, url_for, flash, json
from flask_login import login_user, logout_user, login_required, current_user
from pymongo import MongoClient
import pymongo
from .user import User
from werkzeug.security import generate_password_hash

ssh = []

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
        print "logged in"
        ret = {
            'result': True
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


@app.route('/auth/logout')
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
    
    try:
        collection.insert({
            "_id": hostname,
            "name": name,
            "username" : username,
            "port" : port
            })   
        print "[*] Client added : ", hostname
        ret = {'result': True}
    except pymongo.errors.DuplicateKeyError, e:
        print str(e)
        ret = {'result': False}

    return json.dumps(ret)


@app.route('/getservers', methods=['GET'])
@login_required
def getservers():

    clients_list = []

    clients = app.config['CLIENTS_COLLECTION'].find()

    if clients is not None:
        print "So far so good"
        ret = [{'result': True}]
        for c in clients:
            ret.append(c)
    else:
        ret = [{'result': False}]

    return json.dumps(ret)


@app.route('/connect', methods=['POST'])
@login_required
def connect():
    data = json.loads(request.data.decode())

    hostname = data['hostname']
    password = data['password']
    
    client = app.config['CLIENTS_COLLECTION'].find_one({"_id": id})
    
    if client and Client.validate_login(client['password'], password):
        client_obj = Client(client['_id'])
        print client_obj

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(hostname, email=user, password=password, port=port)
    
            print "[*] Connected to ", client_obj['_id']
            ret = {
                'result': True,
                'id': client_obj['_id']
            }

        except paramiko.SSHException:
            print "[-] Connection failed"
            quit()
            ret = {'result': False}
    
    else:
        print "Failed"
        ret = {'result': False}

    return json.dumps(ret)


# @app.route('/disconnect/:id', methods=['POST'])
# @login_required
# def disconnect()


# @app.route("/exec", methods=['POST'])
# def exec(request):
#     # Check if user is connected (ssh)
#     # Check if user is looged in
#     # Execute command
#     # Output the results
    
#     # stdin,stdout,stderr = ssh.exec_command("zgrep 'Failed password for' /var/log/auth.log* | grep -Po '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq")
