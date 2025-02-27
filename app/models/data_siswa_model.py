from app import db

class DataSiswa(db.Model):
    __tablename__ = "datasiswa"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nama = db.Column(db.String(100), nullable=False)
    nisn = db.Column(db.String(20), unique=True, nullable=False)
    jenis_kelamin = db.Column(db.String(10), nullable=False)
    alamat_sekolah = db.Column(db.String(255), nullable=False)

    bakat_siswa = db.relationship('BakatSiswa', backref='siswa', cascade="all, delete-orphan")
