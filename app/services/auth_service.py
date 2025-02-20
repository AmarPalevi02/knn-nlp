from app.models.user_model import User
from app import db
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.models.user_model import User
from flask import jsonify

def login(email, password):
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise Unauthorized("Email atau password salah")

    token = create_access_token(
             identity=str(user.id), 
             additional_claims={  
                "username": user.username,
                "email": user.email,
                "role": user.role
            },
            expires_delta=timedelta(hours=1)  
        )
    
    message = "Admin berhasil login" if user.role == "admin" else "Siswa berhasil login"
    print("Generated Token:", token) 

    return {
        "message": message,
        "access_token": token,
        "username": user.username,
        "email": user.email,  
        "role": user.role
    }


def register(email, password, username):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return None

    new_user = User(email=email, username=username, role="siswa")
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return new_user
