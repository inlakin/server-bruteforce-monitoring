from pymongo import MongoClient

WTF_CSRF_ENABLED = True
SECRET_KEY = 'Todo:Generatethiskeyfromhashingotherstuff!*W@#:)'
DB_NAME = 'server-monitoring'

DATABASE = MongoClient()[DB_NAME]
USERS_COLLECTION = DATABASE.users

DEBUG = True
