from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.services.bakat_siswa_service import BakatSiswaService
from app.models.user_model import User
from app.models.data_siswa_model import DataSiswa

class BakatSiswaController:
    # @staticmethod
    # def create_bakat():
    #     user_id = get_jwt_identity()
    #     data = request.json

    #     if not all(k in data for k in ("siswa_id", "jurusan", "deskripsi_bakat")):
    #         return jsonify({"status": "error", "message": "Data tidak lengkap"}), 400

    #     siswa = DataSiswa.query.filter_by(id=data["siswa_id"], user_id=user_id).first()
    #     if not siswa:
    #         return jsonify({"status": "error", "message": "Data siswa tidak ditemukan atau tidak bisa diakses"}), 403

    #     jurusan =BakatSiswaService.create_bakat(
    #         siswa_id=data["siswa_id"],
    #         jurusan=data["jurusan"],
    #         deskripsi_bakat=data["deskripsi_bakat"]
    #     )

    #     return jsonify({
    #         "status": "success",
    #         "message": "Jurusan berhasil ditambahkan",
    #         "data": {"jurusan_id": jurusan.id}
    #     }), 201



    @staticmethod
    def create_bakat():
        user_id = get_jwt_identity()
        data = request.json

        if not all(k in data for k in ("siswa_id", "jurusan", "deskripsi_bakat")):
            return jsonify({"status": "error", "message": "Data tidak lengkap"}), 400

        siswa = DataSiswa.query.filter_by(id=data["siswa_id"], user_id=user_id).first()
        if not siswa:
            return jsonify({"status": "error", "message": "Data siswa tidak ditemukan atau tidak bisa diakses"}), 403

        bakat_siswa = BakatSiswaService.create_bakat(
            siswa_id=data["siswa_id"],
            jurusan=data["jurusan"],
            deskripsi_bakat=data["deskripsi_bakat"]
        )

        return jsonify({
            "status": "success",
            "message": "Data bakat berhasil ditambahkan",
            "data": {
                "bakat_id": bakat_siswa.id,
                "rekomendasi_jurusan": bakat_siswa.rekomendasi
            }
        }), 201













    @staticmethod
    def get_my_jurusan():
        user_id = get_jwt_identity()
        siswa_list = DataSiswa.query.filter_by(user_id=user_id).all()

        jurusan_data = []
        for siswa in siswa_list:
            jurusan_list = BakatSiswaService.get_jurusan_by_siswa(siswa.id)
            for jurusan in jurusan_list:
                jurusan_data.append({
                    "id": jurusan.id,
                    "siswa_id": jurusan.siswa_id,
                    "jurusan": jurusan.jurusan,
                    "deskripsi_bakat": jurusan.deskripsi_bakat,
                    "rekomendasi": jurusan.rekomendasi
                })

        return jsonify({
            "status": "success",
            "message": "Data jurusan berhasil diambil",
            "data": jurusan_data
        })

    @staticmethod
    def get_all_jurusan():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        jurusan_list = BakatSiswaService.get_all_jurusan()
        data = [{
            "id": j.id,
            "siswa_id": j.siswa_id,
            "jurusan": j.jurusan,
            "deskripsi_bakat": j.deskripsi_bakat,
            "rekomendasi": j.rekomendasi
        } for j in jurusan_list]

        return jsonify({
            "status": "success",
            "message": "Data semua jurusan berhasil diambil",
            "data": data
        })