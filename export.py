import os
import sqlite3
import json

def export_to_js(db_file, js_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Exportar dados dos usuários
    cursor.execute("SELECT * FROM usuarios")
    usuarios = cursor.fetchall()

    # Definindo os nomes das colunas dos usuários
    usuarios_columns = [description[0] for description in cursor.description]
    # Convertendo os dados, garantindo que campos bytes sejam convertidos para string
    usuarios_data = [
        {usuarios_columns[i]: (row[i].decode('utf-8') if isinstance(row[i], bytes) else row[i]) for i in range(len(usuarios_columns))}
        for row in usuarios
    ]

    # Exportar dados das postagens
    cursor.execute("SELECT * FROM postagens")
    postagens = cursor.fetchall()

    # Definindo os nomes das colunas das postagens
    postagens_columns = [description[0] for description in cursor.description]
    postagens_data = [dict(zip(postagens_columns, row)) for row in postagens]

    # Criando o conteúdo do arquivo JS
    js_content = f"""
const usuarios = {json.dumps(usuarios_data, indent=4)};
const postagens = {json.dumps(postagens_data, indent=4)};

export {{ usuarios, postagens }};
"""

    # Salvando no arquivo JS
    with open(js_file, 'w') as f:
        f.write(js_content)

    conn.close()

# Caminhos dos arquivos
db_file = 'database.db'
js_file = 'data.js'

# Exportar para JS
export_to_js(db_file, js_file)
