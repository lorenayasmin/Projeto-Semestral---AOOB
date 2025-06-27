import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import sqlite3

post_routes = Blueprint("post_routes", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@post_routes.route("/postagens", methods=["POST"])
def criar_postagem():
    try:
        usuario_id = request.form.get("usuario_id")  # Obter o ID do usuário
        titulo = request.form.get("titulo")
        descricao = request.form.get("descricao")
        localizacao = request.form.get("localizacao")
        data_validade = request.form.get("data_validade")
        quantidade = request.form.get("quantidade")
        contato = request.form.get("contato")
        imagem = request.files.get("imagem")

        if not usuario_id or not titulo or not descricao or not localizacao or not data_validade or not quantidade or not contato:
            return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

        imagem_path = None
        if imagem:
            filename = secure_filename(imagem.filename)
            imagem_path = os.path.join(UPLOAD_FOLDER, filename)
            imagem.save(imagem_path)

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO postagens (usuario_id, titulo, descricao, localizacao, data_validade, quantidade, contato, imagem, disponivel)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (usuario_id, titulo, descricao, localizacao, data_validade, quantidade, contato, imagem_path, True))

        conn.commit()
        return jsonify({"mensagem": "Postagem criada com sucesso!", "status": "success"}), 201
    except Exception as e:
        print(f"Erro ao criar postagem: {e}")
        return jsonify({"erro": str(e)}), 400
    finally:
        conn.close()

@post_routes.route("/postagens", methods=["GET"])
def listar_postagens():
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM postagens WHERE disponivel = 1")
        postagens = cursor.fetchall()

        lista_postagens = [
            {
                "id": p[0],
                "usuario_id": p[1],
                "titulo": p[2],
                "descricao": p[3],
                "localizacao": p[4],
                "data_validade": p[5],
                "quantidade": p[6],
                "contato": p[7],
                "imagem": p[8],
                "disponivel": p[9],
            }
            for p in postagens
        ]

        return jsonify(lista_postagens), 200
    except Exception as e:
        print(f"Erro ao listar postagens: {e}")
        return jsonify({"erro": str(e)}), 500
    finally:
        conn.close()

@post_routes.route("/postagens/<int:postagem_id>", methods=["PUT"])
def editar_postagem(postagem_id):
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # Dados recebidos para atualizar
        titulo = request.form.get("titulo")
        descricao = request.form.get("descricao")
        localizacao = request.form.get("localizacao")
        data_validade = request.form.get("data_validade")
        quantidade = request.form.get("quantidade")
        contato = request.form.get("contato")
        imagem = request.files.get("imagem")  # Recebe a nova imagem, se houver

        # Mantém a imagem atual se nenhuma nova for enviada
        cursor.execute("SELECT imagem FROM postagens WHERE id = ?", (postagem_id,))
        postagem_atual = cursor.fetchone()
        imagem_path = postagem_atual[0] if postagem_atual else None

        if imagem:
            filename = secure_filename(imagem.filename)
            imagem_path = os.path.join(UPLOAD_FOLDER, filename)
            imagem.save(imagem_path)

        # Atualiza a postagem no banco de dados
        cursor.execute("""
            UPDATE postagens
            SET titulo = ?, descricao = ?, localizacao = ?, data_validade = ?, quantidade = ?, contato = ?, imagem = ?
            WHERE id = ?
        """, (titulo, descricao, localizacao, data_validade, quantidade, contato, imagem_path, postagem_id))

        conn.commit()
        return jsonify({"mensagem": "Postagem atualizada com sucesso!"}), 200
    except Exception as e:
        print(f"Erro ao editar postagem: {e}")
        return jsonify({"erro": str(e)}), 400
    finally:
        conn.close()

@post_routes.route("/postagens/<int:postagem_id>", methods=["DELETE"])
def excluir_postagem(postagem_id):
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # Atualiza a postagem para indisponível
        cursor.execute("UPDATE postagens SET disponivel = 0 WHERE id = ?", (postagem_id,))
        conn.commit()

        return jsonify({"mensagem": "Postagem excluída com sucesso!"}), 200
    except Exception as e:
        print(f"Erro ao excluir postagem: {e}")
        return jsonify({"erro": str(e)}), 400
    finally:
        conn.close()
