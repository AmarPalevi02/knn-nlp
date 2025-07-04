from flask import request, jsonify
from app.services.bakat_siswa_service import BakatSiswaService
from flask_jwt_extended import get_jwt_identity
from app.models.user_model import User
import json

class BakatSiswaController:
    @staticmethod
    def create_bakat():
        try:
            data = request.get_json()
            siswa_id = data.get("siswa_id")
            deskripsi_bakat = data.get("deskripsi_bakat")

            if not siswa_id or not deskripsi_bakat:
                return jsonify({"message": "Harap lengkapi form!"}), 400

            bakat = BakatSiswaService.create_bakat(siswa_id, deskripsi_bakat)

            return jsonify({
                "message": "Berhasil menyimpan hasil rekomendasi",
                "status": "success",
                "siswa": siswa_id,
                "jurusan_utama": bakat.jurusan,
                "rekomendasi": json.loads(bakat.rekomendasi)
            }), 201

        except ValueError as ve:
            return jsonify({
                "message": str(ve),
                "status": "error"
            }), 400

        except Exception as e:
            return jsonify({
                "message": "Terjadi kesalahan pada server.",
                "error": str(e),
                "status": "error"
            }), 500



    @staticmethod
    def get_prediksi(siswa_id):
        hasil = BakatSiswaService.get_prediksi(siswa_id)
        if not hasil:
            return jsonify({"message": "Hasil tidak ditemukan"}), 404

        return jsonify({
            "status": "success",
            "siswa_id": hasil.siswa_id,
            "nama_siswa": hasil.siswa.nama,
            "nisn": hasil.siswa.nisn,
            "jenis_kelamin": hasil.siswa.jenis_kelamin,
            "deskripsi_bakat": hasil.deskripsi_bakat,
            "jurusan_utama": hasil.jurusan,
            "rekomendasi": json.loads(hasil.rekomendasi)
        }), 200

        
    @staticmethod
    def get_my_bakat_history():
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            # Allow only users with 'siswa' role
            if user.role != "siswa":
                return jsonify({"status": "error", "message": "Unauthorized, siswa role required"}), 403

            history = BakatSiswaService.get_bakat_history_by_user(user_id)
            if not history:
                return jsonify({"status": "error", "message": "No talent history found for this user"}), 404

            return jsonify({
                "status": "success",
                "message": "Your talent history retrieved successfully",
                "data": history
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": "Server error occurred",
                "error": str(e)
            }), 500