from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from config import Config
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

import os
print("JWT_SECRET_KEY:", os.getenv("JWT_SECRET_KEY"))

def create_app():
    app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)
    CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}}) 

    db.init_app(app)
    Migrate(app, db) 
    jwt.init_app(app)
    bcrypt.init_app(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.dashboardsiswa_routes import dashboard_siswa_bp
    from app.routes.dashboardadmin_routes import dashboard_admin_bp

    from app.routes.frontend_routes import frontend_bp
    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(dashboard_siswa_bp, url_prefix="/siswa")
    app.register_blueprint(dashboard_admin_bp, url_prefix="/admin")
    app.register_blueprint(frontend_bp)
      

    return app
