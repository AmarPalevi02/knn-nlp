from app.controllers.auth_controller import login_controller, register_controller
from flask import Blueprint, render_template

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/login", methods=["POST"])(login_controller)
auth_bp.route("/register", methods=["POST"])(register_controller)
