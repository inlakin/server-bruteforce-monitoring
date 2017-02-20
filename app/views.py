from app import app, lm
from flask import send_file, request, redirect, render_template, url_for, flash, json
from flask_login import login_user, logout_user, login_required, current_user
from pymongo import MongoClient
import pymongo
from .user import User
from werkzeug.security import generate_password_hash


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


@app.route('/ssh', methods=['POST'])
@login_required
def ssh(request):

    data     = json.loads(request.data.decode())
    
    email = data['user']
    password = data['password']
    hostname = data['hostname']
    port     = data['port']
    nb_ip = 0
    print email + "@" + hostname + ":" + str(port)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
            ssh.connect(hostname, email=email, password=password, port=port)
    except paramiko.SSHException:
            print "Connection Failed"
            quit()
     
    stdin,stdout,stderr = ssh.exec_command("zgrep 'Failed password for' /var/log/auth.log* | grep -Po '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq")
     
    for ip in stdout.readlines():
            # print line.strip()
            r     = {}
            nb_ip += 1

            if ip[0] == "0":
                print "Debut d'ip"
                print ip
                print ip[1:]
                try:
                    response         = reader.city(ip[1:].strip('\n'))

                    r['ip']          = ip[1:].strip('\n')
                    r['country']     = response.country.name
                    r['city']        = response.city.name
                    r['postal_code'] = response.postal.code
                    r['latitude']    = response.location.latitude
                    r['longitude']   = response.location.longitude

                    profiles.append(r) 

                except Exception, e:
                    print str(e)
            else:
                try:
                    response         = reader.city(ip.strip('\n'))

                    r['ip']          = ip.strip('\n')
                    r['country']     = response.country.name
                    r['city']        = response.city.name
                    r['postal_code'] = response.postal.code
                    r['latitude']    = response.location.latitude
                    r['longitude']   = response.location.longitude

                    profiles.append(r)

                except Exception, e:
                    print str(e)
    ssh.close()

    return json.dumps(profiles)



@app.route('/connect', methods=['POST'])
@login_required
def connect():

    # data     = json.loads(request.data.decode())
    
    # email = data['user']
    # password = data['password']
    # hostname = data['hostname']
    # port     = data['port']

    # print "[*] Connecting to : " +  email + "@" + hostname + ":" + str(port)

    # ssh = paramiko.SSHClient()
    # ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # try:
    #         ssh.connect(hostname, email=email, password=password, port=port)
    #         res = {
    #             message: "Connected to " + hostname + ":" + port + " as " + email
    #         }
    #         print "Connection successful to " + hostname + ":" + port + " as " + email
    # except paramiko.SSHException:
    #         res = {
    #             message: "Failed to connect to " + hostname + ":" + port + " as " + email
    #         }
    #         print "Connection Failed"
    #         quit()

    # return json.dumps(res)
    ret = {}
    ret = {'ret':'fail'}
    return json.dumps(ret);

# @app.route("/exec", methods=['POST'])
# def exec(request):
#     # Check if user is connected (ssh)
#     # Check if user is looged in
#     # Execute command
#     # Output the results
    
#     # stdin,stdout,stderr = ssh.exec_command("zgrep 'Failed password for' /var/log/auth.log* | grep -Po '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq")
