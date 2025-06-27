import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import sqlite3
import bcrypt  # Importando bcrypt para hashing da senha

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

user_routes = Blueprint("user_routes", __name__)

# Rotas de criação de usuários
@user_routes.route("/usuarios", methods=["POST"])
def criar_usuario():
    try:
        # Captura os dados do formulário
        nome = request.form.get("nome")
        email = request.form.get("email")
        localizacao = request.form.get("localizacao")
        eh_doador = request.form.get("eh_doador")
        bio = request.form.get("bio")
        senha = request.form.get("senha")  # Recebe a senha do formulário
        foto_perfil = None

        # Validação de campos obrigatórios
        if not nome or not email or not localizacao or eh_doador is None or not senha:
            return jsonify({"erro": "Todos os campos obrigatórios devem ser preenchidos"}), 400

        # Converte o campo `eh_doador` para booleano
        eh_doador = True if eh_doador.lower() == "true" else False

        # Criptografa a senha com bcrypt
        hashed_password = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

        # Tratamento da foto de perfil: apenas arquivo de upload
        if "foto_perfil" in request.files:
            foto = request.files["foto_perfil"]
            if foto:
                filename = secure_filename(foto.filename)
                foto_perfil = os.path.join(UPLOAD_FOLDER, filename)
                foto.save(foto_perfil)

        # Conexão com o banco de dados
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # Verifica se o email já está cadastrado
        cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
        usuario_existente = cursor.fetchone()

        if usuario_existente:
            return jsonify({"erro": "Este email já está cadastrado"}), 400

        # Insere o novo usuário no banco de dados
        cursor.execute("""
            INSERT INTO usuarios (nome, email, localizacao, eh_doador, foto_perfil, bio, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (nome, email, localizacao, eh_doador, foto_perfil, bio, hashed_password))

        conn.commit()
        return jsonify({"mensagem": "Usuário criado com sucesso!"}), 201
    except Exception as e:
        print(f"Erro ao cadastrar usuário: {e}")
        return jsonify({"erro": str(e)}), 400
    finally:
        conn.close()


@user_routes.route("/usuarios", methods=["GET"])
def buscar_usuario():
    email = request.args.get("email")
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # Busca o usuário pelo email
        cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()

        if usuario:
            usuario_dict = {
                "id": usuario[0],
                "nome": usuario[1],
                "email": usuario[2],
                "localizacao": usuario[3],
                "eh_doador": usuario[4],
                "foto_perfil": usuario[5] if usuario[5] is None else f"http://localhost:5000/{usuario[5]}",
                "bio": usuario[6],
            }
            print(f"Usuário encontrado: {usuario_dict}")  # Log para sucesso
            return jsonify(usuario_dict), 200
        else:
            print("Erro: Usuário não encontrado")  # Log para erro
            return jsonify({"mensagem": "Usuário não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")  # Log de erro
        return jsonify({"erro": str(e)}), 500
    finally:
        conn.close()

@user_routes.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    senha = request.json.get("senha")
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # Busca o usuário pelo email
        cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()

        if usuario:
            # Comparar a senha fornecida (em texto) com a senha armazenada (em bytes)
            if bcrypt.checkpw(senha.encode('utf-8'), usuario[7]):  # usuario[7] já está em bytes
                return jsonify({"mensagem": "Login bem-sucedido!"}), 200
            else:
                return jsonify({"erro": "Senha incorreta!"}), 400
        else:
            return jsonify({"erro": "Usuário não encontrado!"}), 404
    except Exception as e:
        print(f"Erro ao fazer login: {e}")
        return jsonify({"erro": str(e)}), 500
    finally:
        conn.close()

@user_routes.route("/usuarios/<int:id>", methods=["PUT"])
def atualizar_usuario(id):
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        nome = request.form.get("nome")
        email = request.form.get("email")
        localizacao = request.form.get("localizacao")
        eh_doador = request.form.get("eh_doador")
        bio = request.form.get("bio")
        foto_perfil = None

        # Verifica a foto atual do usuário
        cursor.execute("SELECT foto_perfil FROM usuarios WHERE id = ?", (id,))
        usuario = cursor.fetchone()
        foto_perfil_atual = usuario[0] if usuario else None

        # Verifica se foi enviada uma nova foto
        if "foto_perfil" in request.files:
            foto = request.files["foto_perfil"]
            if foto:
                filename = secure_filename(foto.filename)
                foto_perfil = os.path.join(UPLOAD_FOLDER, filename)
                foto.save(foto_perfil)
        else:
            foto_perfil = foto_perfil_atual  # Mantém a foto existente

        # Atualiza os dados no banco
        query = """
            UPDATE usuarios
            SET nome = ?, email = ?, localizacao = ?, eh_doador = ?, bio = ?, foto_perfil = ?
            WHERE id = ?
        """
        cursor.execute(
            query,
            (
                nome,
                email,
                localizacao,
                eh_doador.lower() == "true",
                bio,
                foto_perfil,
                id,
            ),
        )
        conn.commit()

        # Busca os dados atualizados do usuário
        cursor.execute("SELECT * FROM usuarios WHERE id = ?", (id,))
        usuario_atualizado = cursor.fetchone()

        if usuario_atualizado:
            usuario_dict = {
                "id": usuario_atualizado[0],
                "nome": usuario_atualizado[1],
                "email": usuario_atualizado[2],
                "localizacao": usuario_atualizado[3],
                "eh_doador": usuario_atualizado[4],
                "foto_perfil": usuario_atualizado[5]
                if usuario_atualizado[5] is None
                else f"http://localhost:5000/{usuario_atualizado[5]}",
                "bio": usuario_atualizado[6],
            }
            return jsonify(usuario_dict), 200
        else:
            return jsonify({"erro": "Usuário não encontrado"}), 404

    except Exception as e:
        print(f"Erro ao atualizar usuário: {e}")
        return jsonify({"erro": str(e)}), 500
    finally:
        conn.close()
