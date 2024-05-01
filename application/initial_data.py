from flask import current_app as app
from application.datastore import datastore
from application.models import db
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="creator", description="User is a Creator")
    datastore.find_or_create_role(name="gen_user", description="User is a general user")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):

        datastore.create_user(username = "Admin", email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])

    if not datastore.find_user(email="creator@email.com"):

        datastore.create_user(username = "Creator", email="creator@email.com", password=generate_password_hash("creator"), roles=["creator"])

    if not datastore.find_user(email="gen_user@email.com"):

        datastore.create_user( username = "User", email="gen_user@email.com", password=generate_password_hash("gen_user"), roles=["gen_user"])

    db.session.commit()

