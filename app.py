#from application import my_app
from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.datastore import datastore
from application.models import db,User, Role, Song
from application.config import DevelopmentConfig
from application.api_resources import api
from application.worker import celery_init_app
from celery.schedules import crontab
from application.tasks import send_mail, send_login_reminder
 
def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    with app.app_context():
        #importing application views
        import application.views
        #importing initial database
        import application.initial_data

    return app

my_app = create_app()
celery_app = celery_init_app(my_app)

@celery_app.on_after_configure.connect
def monthly_report(sender, **kwargs):
    sender.add_periodic_task(30.0,#crontab(hour=11, minute=51), 
                             send_mail.s("Monthly Report from Musify"))
    
@celery_app.on_after_configure.connect
def login_reminder(sender, **kwargs):
    sender.add_periodic_task(20.0,#crontab(hour=19, minute= 30), 
                             send_login_reminder.s("Login reminder from Musify"))    



#if __name__ == "__main__":
#   my_app.run(debug = True)
