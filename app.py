#! /usr/bin/env python

# -*- coding: utf-8 -*- 
# 
# from flask_restful import Resource, Api, reqparse
from pymongo import MongoClient
from werkzeug.security import check_password_hash

from flask.ext.login import LoginManager

lm = LoginManager()
lm.login_view = 'login'

client = MongoClient('localhost', 27017)

app = Flask(__name__, static_url_path='/static')


if __name__=='__main__':
    app.run(debug=True)

