import os

current_dir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = 'static/song_files' 

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Config(object):
    DEBUG = False
    TESTING = False



class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SECRET_KEY = "ThisIsSecretKey"
    SECURITY_PASSWORD_SALT = "ThisIsSalt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEMPLATE_FOLDER = 'templates'
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SESSION_PERMANENT = False
    SESSION_TYPE = 'filesystem'
    UPLOAD_FOLDER = UPLOAD_FOLDER