from flask import request, jsonify
from app.services.auth_service import login, register
from werkzeug.exceptions import BadRequest, Unauthorized

def login_controller():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email dan password harus diisi"}), 400

    try:
        result = login(email, password)
        return jsonify(result), 200  
    except Exception as e:
        return jsonify({"message": "email atau password tidak terdaftar"}), 401


def register_controller():
    data = request.json
    new_user = register(data["email"],data["password"], data["username"],)
    
    if new_user:
        return jsonify({"message": "Registrasi berhasil"}), 201
    
    return jsonify({"message": "Email sudah digunakan"}), 400
