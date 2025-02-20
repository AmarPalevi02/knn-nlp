from flask import Blueprint, jsonify, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from flask_jwt_extended import verify_jwt_in_request
dashboard_admin_bp = Blueprint("dashboard_admin", __name__)


@dashboard_admin_bp.route("/admin/dashboard", methods=["GET"])
@jwt_required()
def dashboard_admin():
    current_user_id = get_jwt_identity() 
    claims = get_jwt() 
    try:
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        print("Token valid, User:", current_user)
        return jsonify({
            "message": "Dashboard Admin",
            "user": current_user
        })
       
    except Exception as e:
        print("JWT Error:", str(e))  
        return jsonify({"error": str(e)}), 401
