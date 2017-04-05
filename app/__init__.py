from flask import Flask
from flask_login import LoginManager
import settings

app = Flask(__name__)
app.config.from_object('config')
lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

settings.init()

from app import views
