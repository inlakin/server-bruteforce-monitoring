#! /usr/bin/env python

# -*- coding: utf-8 -*- 
# 
# from flask_restful import Resource, Api, reqparse
# from pymongo import MongoClient
from flask import Flask 
from flask import render_template, json
import geoip2.database


reader = geoip2.database.Reader('GeoLite2-City.mmdb')
file = open('ip_auth_uniq.txt', "r")

response = []
profiles = []

nb_ip    = 0

for ip in file:
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

file.close()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def showMap():
    return render_template("map.html")
    
@app.route('/getprofiles', methods=['GET'])
def getIP():
    try:
        return json.dumps(profiles)
    except Exception, e:
        return str(e)

if __name__=='__main__':
    app.run(debug=True)

