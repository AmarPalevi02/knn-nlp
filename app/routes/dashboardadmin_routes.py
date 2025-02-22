from flask import Blueprint, jsonify, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.controllers.datasiswa_controller import DataSiswaController

from flask_jwt_extended import verify_jwt_in_request
dashboard_admin_bp = Blueprint("dashboard_admin", __name__)

@dashboard_admin_bp.route('/siswa', methods=['GET'])
@jwt_required()
def get_all_siswa():
    return DataSiswaController.get_all_siswa()

@dashboard_admin_bp.route('/siswa/<int:siswa_id>', methods=['DELETE'])
@jwt_required()
def delete_siswa(siswa_id):
    return DataSiswaController.delete_siswa(siswa_id)

@dashboard_admin_bp.route('/siswa/<int:siswa_id>', methods=['PUT'])
@jwt_required()
def update_siswa(siswa_id):
    return DataSiswaController.update_siswa(siswa_id)


@dashboard_admin_bp.route('/siswa/<int:siswa_id>', methods=['GET'])
@jwt_required()
def get_siswa_by_id(siswa_id):
    return DataSiswaController.get_siswa_by_id(siswa_id)