from app import db
from app.models.bakat_siswa import BakatSiswa

class BakatSiswaService:
    @staticmethod
    def create_bakat(siswa_id, jurusan, deskripsi_bakat):
        bakat_siswa = BakatSiswa(
            siswa_id=siswa_id,
            jurusan=jurusan,
            deskripsi_bakat=deskripsi_bakat
        )
        db.session.add(bakat_siswa)
        db.session.commit()
        return bakat_siswa