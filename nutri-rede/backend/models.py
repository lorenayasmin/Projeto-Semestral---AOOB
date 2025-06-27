import sqlite3

def criar_tabelas():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Tabela de usuários
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            localizacao TEXT NOT NULL,
            eh_doador BOOLEAN NOT NULL,
            foto_perfil TEXT,
            bio TEXT,
            senha TEXT NOT NULL -- Adicionando a coluna de senha
        )
    """)

    # Tabela de postagens
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS postagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            localizacao TEXT NOT NULL,
            data_validade TEXT NOT NULL,
            quantidade TEXT NOT NULL,
            contato TEXT NOT NULL,
            imagem TEXT,
            disponivel BOOLEAN DEFAULT 1,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    """)

    conn.commit()
    conn.close()

# Executa a criação das tabelas
criar_tabelas()
