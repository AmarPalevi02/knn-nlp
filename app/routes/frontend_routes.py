from flask import Blueprint, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_jwt_extended import verify_jwt_in_request

frontend_bp = Blueprint("frontend", __name__)

@frontend_bp.route("/login")
def login():
    return render_template("login.html") 

@frontend_bp.route("/register")
def register():
    return render_template("register.html")

@frontend_bp.route("/dashboard")
def dashboard():
    return render_template("dashboardSiswa.html")

@frontend_bp.route("/admin/dashboard")
def dashboard_admin():
    return render_template("components/TableSiswaAllAdmin.html")

@frontend_bp.route("/admin/dashboard/edit")
def dashboard_admin_edit():
    return render_template("components/dashboardAdminEdit.html")