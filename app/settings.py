from flask import Flask, send_file, json, request
import geoip2.database
import paramiko

reader = ""
bruteforce_ip_list = []

def init():
    global ssh
    global reader 
    global nb_servers_connected
    global response
    global profiles
    global bruteforce_ip_list

    reader = geoip2.database.Reader('app/res/GeoLite2-City.mmdb')
    servers_connected = []
    nb_servers_connected = 0
    response = []
    profiles = []
    bruteforce_ip_list = []