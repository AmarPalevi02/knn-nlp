from app import db

class BakatSiswa(db.Model):
    __tablename__ = "bakatsiswa"

    id = db.Column(db.Integer, primary_key=True)
    siswa_id = db.Column(db.Integer, db.ForeignKey("datasiswa.id", ondelete="CASCADE"), nullable=False)
    jurusan = db.Column(db.String(100), nullable=False)
    deskripsi_bakat = db.Column(db.Text, nullable=False)
    rekomendasi = db.Column(db.String(255), nullable=True) 
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    datasiswa = db.relationship('DataSiswa', backref=db.backref('bakatsiswa', lazy=True))
