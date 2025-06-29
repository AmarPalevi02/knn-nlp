from flask import Blueprint, render_template, jsonify, request
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
    return render_template("components/homeSiswa.html")

@frontend_bp.route("/dashboard/siswa")
def dashboard_siswa_formUpload():
    return render_template("components/formSiswa.html")

@frontend_bp.route("/dashboard/jurusan")
def dashboard_siswa_jurusan():
    return render_template("components/jurusanSiswa.html")

# @frontend_bp.route("/dashboard/hasil")
# def dashboard_siswa_hasil():
#     return render_template("components/hasil.html")

@frontend_bp.route("/dashboard/hasil")
def dashboard_siswa_hasil():
    siswa_id = request.args.get("siswa_id")
    return render_template("components/hasil.html", siswa_id=siswa_id)


# @frontend_bp.route("/dashboard/hasilByid")
# def dashboard_siswa_hasil_id():
#     return render_template("components/hasilById.html")



# Route admin
@frontend_bp.route("/admin/dashboard")
def dashboard_admin():
    return render_template("components/TableSiswaAllAdmin.html")

@frontend_bp.route("/admin/dashboard/edit")
def dashboard_admin_edit():
    return render_template("components/dashboardAdminEdit.html")