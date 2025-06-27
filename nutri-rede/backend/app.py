from flask import Flask, send_from_directory
from flask_cors import CORS  # Importa o Flask-CORS
from routes.post_routes import post_routes
from routes.user_routes import user_routes
from dotenv import load_dotenv
import os

# Carrega as variáveis do .env
load_dotenv()

app = Flask(__name__)

# Configuração do upload de imagens
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Habilitar CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  # Permite qualquer origem por padrão
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}})

# Registra os blueprints
app.register_blueprint(user_routes)
app.register_blueprint(post_routes)

@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_ENV") == "development")
