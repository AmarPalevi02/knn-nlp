from app import db
from app.models.bakat_siswa import BakatSiswa
from app.models.data_siswa_model import DataSiswa
from app.models.ml.model import predict_jurusan
from app.models.user_model import User 
import json

class BakatSiswaService:
    @staticmethod
    def create_bakat(siswa_id, deskripsi_bakat):
        rekomendasi = predict_jurusan(deskripsi_bakat, top_n=5)

        if not rekomendasi:
            raise ValueError("Mohon deskripsikan bakat dengan lebih jelas.")

        jurusan_utama = rekomendasi[0][0]

        rekomendasi_json = json.dumps([
            {"jurusan": j, "skor": s} for j, s in rekomendasi
        ])

        bakat_siswa = BakatSiswa(
            siswa_id=siswa_id,
            jurusan=jurusan_utama,
            deskripsi_bakat=deskripsi_bakat,
            rekomendasi=rekomendasi_json
        )

        db.session.add(bakat_siswa)
        db.session.commit()
        return bakat_siswa



    @staticmethod
    def get_prediksi(siswa_id):
        hasil = BakatSiswa.query.filter_by(siswa_id=siswa_id).order_by(BakatSiswa.id.desc()).first()
        if not hasil:
            return None
        return hasil



    @staticmethod
    def get_bakat_history_by_user(user_id):
        # Join bakatsiswa, datasiswa, and users tables, filtered by user_id
        query = db.session.query(
            BakatSiswa.id.label('bakat_id'),
            BakatSiswa.siswa_id,
            DataSiswa.nama,
            DataSiswa.nisn,
            BakatSiswa.jurusan,
            BakatSiswa.deskripsi_bakat,
            BakatSiswa.rekomendasi,
            BakatSiswa.created_at
        ).join(
            DataSiswa, BakatSiswa.siswa_id == DataSiswa.id
        ).join(
            User, DataSiswa.user_id == User.id
        ).filter(
            User.id == user_id
        ).order_by(
            BakatSiswa.created_at.desc()
        ).all()

        # Format the result
        history = []
        for row in query:
            history.append({
                "bakat_id": row.bakat_id,
                "siswa_id": row.siswa_id,
                "nama_siswa": row.nama,
                "nisn": row.nisn,
                "jurusan_utama": row.jurusan,
                "deskripsi_bakat": row.deskripsi_bakat,
                "rekomendasi": json.loads(row.rekomendasi) if row.rekomendasi else None,
                "created_at": row.created_at.isoformat() if row.created_at else None
            })

        return history