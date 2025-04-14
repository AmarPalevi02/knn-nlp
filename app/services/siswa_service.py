from app import db
from app.models.data_siswa_model import DataSiswa
from app.models.bakat_siswa import BakatSiswa

class SiswaService:
    @staticmethod
    def create_siswa(user_id, nama, nisn, jenis_kelamin, alamat_sekolah):
        existing_siswa = DataSiswa.query.filter_by(nisn=nisn).first()
        if existing_siswa:
            return {"error": "NISN sudah ada"}  

        new_siswa = DataSiswa(
            user_id=user_id,
            nama=nama,
            nisn=nisn,
            jenis_kelamin=jenis_kelamin,
            alamat_sekolah=alamat_sekolah
        )
        db.session.add(new_siswa)
        db.session.commit()
        return new_siswa

    @staticmethod
    def get_all_siswa():
        # return DataSiswa.query.all()  
        return db.session.query(DataSiswa, BakatSiswa.jurusan, BakatSiswa.rekomendasi).outerjoin(BakatSiswa, DataSiswa.id == BakatSiswa.siswa_id).all()

    @staticmethod
    def get_siswa_by_user(user_id):
        return DataSiswa.query.filter_by(user_id=user_id).all()  

# get siswa by id all
    @staticmethod
    def get_siswa_by_user(user_id):
        return DataSiswa.query.filter_by(user_id=user_id).all()


    @staticmethod
    def delete_siswa(siswa_id):
        siswa = DataSiswa.query.get(siswa_id)
        if not siswa:
            return {"error": "Data siswa tidak ditemukan"}

        siswa_nama = siswa.nama 
        db.session.delete(siswa)
        db.session.commit()
        
        return {"message": f"Data siswa '{siswa_nama}' berhasil dihapus"}


    @staticmethod
    def get_siswa_by_id(siswa_id):
        return DataSiswa.query.get(siswa_id)


    @staticmethod
    def update_siswa(siswa_id, nama=None, nisn=None, jenis_kelamin=None, alamat_sekolah=None):
        siswa = DataSiswa.query.get(siswa_id)
        if not siswa:
            return {"error": "Data siswa tidak ditemukan"}

        if nisn and nisn != siswa.nisn:
            existing_siswa = DataSiswa.query.filter_by(nisn=nisn).first()
            if existing_siswa:
                return {"error": "NISN sudah ada"}

        if nama:
            siswa.nama = nama
        if nisn:
            siswa.nisn = nisn
        if jenis_kelamin:
            siswa.jenis_kelamin = jenis_kelamin
        if alamat_sekolah:
            siswa.alamat_sekolah = alamat_sekolah

        db.session.commit()
        
        return {"message": "Data siswa berhasil diperbarui"}
