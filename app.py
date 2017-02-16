#! /usr/bin/env python

# -*- coding: utf-8 -*- 
# 
# from flask_restful import Resource, Api, reqparse
# from pymongo import MongoClient
from flask import Flask, send_file, json, request
import geoip2.database
import paramiko


reader = geoip2.database.Reader('res/GeoLite2-City.mmdb')

response = []
profiles = []

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/ssh', methods=['POST'])
def ssh():

    data     = json.loads(request.data.decode())
    
    username = data['user']
    password = data['password']
    hostname = data['hostname']
    port     = data['port']
    nb_ip = 0
    print username + "@" + hostname + ":" + str(port)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
            ssh.connect(hostname, username=username, password=password, port=port)
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


if __name__=='__main__':
    app.run(debug=True)

