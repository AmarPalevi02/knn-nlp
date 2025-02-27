from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.services.siswa_service import SiswaService
from app.models.user_model import User

class DataSiswaController:
   @staticmethod
   def add_siswa():
    user_id = get_jwt_identity()  
    data = request.json

    if not all(k in data for k in ("nama", "nisn", "jenis_kelamin", "alamat_sekolah")):
        return jsonify({"status": "error", "message": "Data tidak lengkap"}), 400

    siswa = SiswaService.create_siswa(
        user_id=user_id,
        nama=data["nama"],
        nisn=data["nisn"],
        jenis_kelamin=data["jenis_kelamin"],
        alamat_sekolah=data["alamat_sekolah"]
    )

    if isinstance(siswa, dict) and "error" in siswa:
        return jsonify({"status": "error", "message": siswa["error"]}), 409

    return jsonify({
        "status": "success",
        "message": "Data siswa berhasil ditambahkan",
        "data": {"siswa_id": siswa.id}
    }), 201


    @staticmethod
    def get_my_siswa():
        user_id = get_jwt_identity()
        siswa_list = SiswaService.get_siswa_by_user(user_id)

        data = [{
            "id": s.id,
            "nama": s.nama,
            "nisn": s.nisn,
            "jenis_kelamin": s.jenis_kelamin,
            "alamat_sekolah": s.alamat_sekolah
        } for s in siswa_list]

        return jsonify({
            "status": "success",
            "message": "Data siswa berhasil diambil",
            "data": data
        })

# get siswa by id all
   @staticmethod
   def get_my_siswa():
        user_id = get_jwt_identity()
        siswa_list = SiswaService.get_siswa_by_user(user_id)

        data = [{
            "id": s.id,
            "nama": s.nama,
            "nisn": s.nisn,
        } for s in siswa_list]

        return jsonify({
            "status": "success",
            "message": "Data siswa berhasil diambil",
            "data": data
        }), 200


   @staticmethod
   def get_all_siswa():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        siswa_list = SiswaService.get_all_siswa()

        data = [{
            "id": s.id,
            "nama": s.nama,
            "nisn": s.nisn,
            "jenis_kelamin": s.jenis_kelamin,
            "alamat_sekolah": s.alamat_sekolah,
            "user_id": s.user_id,
            "jurusan": jurusan if jurusan else "Belum ditentukan"
        } for s, jurusan in siswa_list]

        return jsonify({
            "status": "success",
            "message": "Data semua siswa berhasil diambil",
            "data": data
        })

   @staticmethod
   def delete_siswa(siswa_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        result = SiswaService.delete_siswa(siswa_id)

        if "error" in result:
            return jsonify({"status": "error", "message": result["error"]}), 404

        return jsonify({"status": "success", "message": result["message"]}), 200




   @staticmethod
   def get_siswa_by_id(siswa_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        siswa = SiswaService.get_siswa_by_id(siswa_id)
        
        if not siswa:
            return jsonify({"status": "error", "message": "Data siswa tidak ditemukan"}), 404

        data = {
            "id": siswa.id,
            "nama": siswa.nama,
            "nisn": siswa.nisn,
            "jenis_kelamin": siswa.jenis_kelamin,
            "alamat_sekolah": siswa.alamat_sekolah,
            "user_id": siswa.user_id
        }

        return jsonify({"status": "success", "message": "Data siswa berhasil diambil", "data": data}), 200



   @staticmethod
   def update_siswa(siswa_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        data = request.json

        if not any(k in data for k in ("nama", "nisn", "jenis_kelamin", "alamat_sekolah")):
            return jsonify({"status": "error", "message": "Tidak ada data yang diperbarui"}), 400

        result = SiswaService.update_siswa(
            siswa_id=siswa_id,
            nama=data.get("nama"),
            nisn=data.get("nisn"),
            jenis_kelamin=data.get("jenis_kelamin"),
            alamat_sekolah=data.get("alamat_sekolah")
        )

        if "error" in result:
            return jsonify({"status": "error", "message": result["error"]}), 409

        return jsonify({"status": "success", "message": result["message"]}), 200

