from app import db
from app.models.bakat_siswa import BakatSiswa
from app.models.ml.model import predict_jurusan
import json

class BakatSiswaService:
    @staticmethod
    def create_bakat(siswa_id, deskripsi_bakat):
        rekomendasi = predict_jurusan(deskripsi_bakat, top_n=5)

        if not rekomendasi:
            raise ValueError("Gagal memproses deskripsi bakat")

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
