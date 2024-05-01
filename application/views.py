from flask import current_app as app 
from flask import render_template,jsonify,request, session
from werkzeug.security import generate_password_hash,check_password_hash
from application.models import db
from application.datastore import datastore
from datetime import datetime




@app.route("/")
def home():
    return render_template("home.html")


#user registration
@app.post('/user-register')
def user_register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    register_as_creator = data.get('registerAsCreator', False)

    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if the email is already in use
    if datastore.find_user(email=email):
        return jsonify({"message": "Email already registered"}), 409

    # Hash the password
    hashed_password = generate_password_hash(password)

    #Determining roles based on checkbox
    roles = ['gen_user']
    if register_as_creator:
        roles.append('creator')

    # Create the user
    user = datastore.create_user(email=email, password=hashed_password, username=username, roles = roles)

    db.session.commit()
    new_user=datastore.find_user(email=email)

    #return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"token":new_user.get_auth_token(), "email":new_user.email, "role":new_user.roles[0].name}), 201




#User-login
@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')


    
    if not email or not password:
        return jsonify({"message":"All fields are required"}), 400

    #check if user exists
    user_exists = datastore.find_user(email=email)
    if not user_exists:
        return jsonify({"message": "User Not Found"}), 404

    #check password
    if check_password_hash(user_exists.password, password):

        user_exists.last_login = datetime.now()
        db.session.commit()
        # Store user info in session
        session['user_id'] = user_exists.id
        session['user_email'] = user_exists.email
        session['user_username'] = user_exists.username
        #session['user_role'] = user_exists.roles[0].name
        # Check if the user has 'creator' role, if not, consider 'gen_user'
        if 'admin' in [role.name for role in user_exists.roles]:
            session['user_role'] = 'admin'
        elif 'creator' in [role.name for role in user_exists.roles]:
            session['user_role'] = 'creator'
        else:
            session['user_role'] = 'gen_user'
        print("session data stored successfully")

        return jsonify({"token": user_exists.get_auth_token(), "email": user_exists.email, "username": user_exists.username, "role":session['user_role']})

    else:
        return jsonify({"message":"Wrong Password"}), 400     
    

#user-logout
@app.post('/user-logout')
def user_logout():
    session.pop('user_id', None)
    session.pop('user_email', None)
    session.pop('user_username', None)
    session.pop('user_role', None)

    print("Session Popped successfully")
    return jsonify({"message": "Logged out successfully"})

    


