from flask import Flask, send_file, json, request
import geoip2.database
import paramiko


def init():
    global ssh
    global reader 
    global response
    global profiles

    reader = geoip2.database.Reader('res/GeoLite2-City.mmdb')
    response = []
    profiles = []