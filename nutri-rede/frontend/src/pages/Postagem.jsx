import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Postagem() {
  const [dados, setDados] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    data_validade: "",
    quantidade: "",
    contato: "",
  });

  const [imagem, setImagem] = useState(null); // Para nova imagem
  const [imagemExistente, setImagemExistente] = useState(null); // Para manter a imagem existente
  const [postagens, setPostagens] = useState([]);
  const [editarPostagemId, setEditarPostagemId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Usando variável de ambiente

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (usuarioLogado && usuarioLogado.id) {
      buscarPostagens(usuarioLogado.id);
    }
  }, [usuarioLogado]);

  const buscarPostagens = async (usuarioId) => {
    try {
      const response = await axios.get(
        `${API_URL}/postagens?usuario_id=${usuarioId}`
      );
      setPostagens(response.data);
    } catch (error) {
      console.error("Erro ao carregar as postagens:", error);
    }
  };

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !dados.titulo ||
      !dados.descricao ||
      !dados.localizacao ||
      !dados.quantidade ||
      !dados.contato
    ) {
      alert("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("usuario_id", usuarioLogado.id);
      formData.append("titulo", dados.titulo);
      formData.append("descricao", dados.descricao);
      formData.append("localizacao", dados.localizacao);
      formData.append("data_validade", dados.data_validade);
      formData.append("quantidade", dados.quantidade);
      formData.append("contato", dados.contato);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      if (editarPostagemId) {
        await axios.put(
          `${API_URL}/postagens/${editarPostagemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Postagem atualizada com sucesso!");
      } else {
        await axios.post(`${API_URL}/postagens`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Postagem criada com sucesso!");
        window.location.href = "/";
      }

      setDados({
        titulo: "",
        descricao: "",
        localizacao: "",
        data_validade: "",
        quantidade: "",
        contato: "",
      });
      setImagem(null);
      setImagemExistente(null);
      setEditarPostagemId(null);
      setModalAberto(false);
      buscarPostagens(usuarioLogado.id);
    } catch (error) {
      console.error("Erro ao cadastrar ou editar a postagem:", error);
      alert("Erro ao cadastrar ou editar a postagem. Tente novamente.");
    }
  };

  const handleEditar = (postagem) => {
    setEditarPostagemId(postagem.id);
    setDados({
      titulo: postagem.titulo,
      descricao: postagem.descricao,
      localizacao: postagem.localizacao,
      data_validade: postagem.data_validade,
      quantidade: postagem.quantidade,
      contato: postagem.contato,
    });
    setImagemExistente(postagem.imagem);
    setImagem(null); // Para garantir que nenhuma nova imagem esteja configurada
    setModalAberto(true);
  };

  const handleCancelar = () => {
    setModalAberto(false);
    setEditarPostagemId(null);
    setImagem(null);
    setImagemExistente(null);
    setDados({
      titulo: "",
      descricao: "",
      localizacao: "",
      data_validade: "",
      quantidade: "",
      contato: "",
    });
  };

  const excluirPostagem = async (postagemId) => {
    try {
      await axios.delete(`${API_URL}/postagens/${postagemId}`);
      alert("Postagem excluída com sucesso!");
      setPostagens(postagens.filter((p) => p.id !== postagemId));
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      alert("Erro ao excluir postagem. Tente novamente.");
    }
  };

  return (
    <div className="postagem-container">
      <h1>Cadastrar Alimento</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titulo"
          placeholder="Título da postagem"
          value={dados.titulo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição do alimento"
          value={dados.descricao}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="localizacao"
          placeholder="Localização"
          value={dados.localizacao}
          onChange={handleChange}
          required
        />
        <label>Data de Validade:</label>
        <input
          type="date"
          name="data_validade"
          value={dados.data_validade}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="quantidade"
          placeholder="Quantidade"
          value={dados.quantidade}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contato"
          placeholder="Contato para retirada"
          value={dados.contato}
          onChange={handleChange}
          required
        />
        <input type="file" name="imagem" onChange={handleImagemChange} />
        <button type="submit">
          {editarPostagemId ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
      <hr />
      <h1 className="titulo-postagens">Postagens</h1>
      <div className="postagens">
        {postagens.length > 0 ? (
          postagens.map((postagem) => (
            <div className="postagem-card" key={postagem.id}>
              <h3>{postagem.titulo}</h3>
              {postagem.imagem && (
                <img
                  src={`${API_URL}/${postagem.imagem}`}
                  alt={postagem.titulo}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
              <p>{postagem.descricao}</p>
              <p>Localização: {postagem.localizacao}</p>
              <p>Quantidade: {postagem.quantidade}</p>
              <p>Contato: {postagem.contato}</p>
              <div className="postagem-buttons">
                <button
                  className="editar-btn"
                  onClick={() => handleEditar(postagem)}
                >
                  Editar
                </button>
                <button
                  className="excluir-btn"
                  onClick={() => excluirPostagem(postagem.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Você Precisa Estar Logado!</p>
        )}
      </div>

      <Modal isOpen={modalAberto} onRequestClose={handleCancelar}>
        <h3>Editar Postagem</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo"
            placeholder="Título da postagem"
            value={dados.titulo}
            onChange={handleChange}
            required
          />
          <textarea
            name="descricao"
            placeholder="Descrição do alimento"
            value={dados.descricao}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="localizacao"
            placeholder="Localização"
            value={dados.localizacao}
            onChange={handleChange}
            required
          />
          <label>Data de Validade:</label>
          <input
            type="date"
            name="data_validade"
            value={dados.data_validade}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="quantidade"
            placeholder="Quantidade"
            value={dados.quantidade}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contato"
            placeholder="Contato para retirada"
            value={dados.contato}
            onChange={handleChange}
            required
          />
          {imagemExistente && !imagem && (
            <img
              src={`${API_URL}/${imagemExistente}`}
              alt="Imagem Existente"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
            />
          )}
          <label>Nova Imagem (opcional):</label>
          <input type="file" name="imagem" onChange={handleImagemChange} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Postagem;
