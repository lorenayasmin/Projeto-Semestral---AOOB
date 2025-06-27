import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    localizacao: "",
    eh_doador: false,
    bio: "",
  });
  const [modalAberto, setModalAberto] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Usando variável de ambiente

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLogado) {
      setUsuario(usuarioLogado);
      setFotoPerfil(usuarioLogado.foto_perfil);
      setDados({
        nome: usuarioLogado.nome,
        email: usuarioLogado.email,
        localizacao: usuarioLogado.localizacao,
        eh_doador: usuarioLogado.eh_doador,
        bio: usuarioLogado.bio,
      });
    } else {
      alert("Você precisa estar logado para acessar esta página!");
      window.location.href = "/login";
    }
  }, []);

  const handleFotoPerfilChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nome", dados.nome);
      formData.append("email", dados.email);
      formData.append("localizacao", dados.localizacao);
      formData.append("eh_doador", dados.eh_doador);
      formData.append("bio", dados.bio);

      if (fotoPerfil && typeof fotoPerfil !== "string") {
        formData.append("foto_perfil", fotoPerfil);
      }

      const response = await axios.put(
        `${API_URL}/usuarios/${usuario.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const usuarioAtualizado = response.data;
      setUsuario(usuarioAtualizado);
      setFotoPerfil(usuarioAtualizado.foto_perfil);
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

      alert("Perfil atualizado com sucesso!");
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Erro ao atualizar o perfil. Tente novamente.");
    }
  };

  const handleEditarPerfil = () => {
    if (usuario) {
      setFotoPerfil(usuario.foto_perfil);
    }
    setModalAberto(true);
  };

  const handleCancelar = () => {
    if (usuario) {
      setFotoPerfil(usuario.foto_perfil);
    }
    setModalAberto(false);
  };

  return (
    <div className="perfil-container">
      {usuario && (
        <div className="perfil-info">
          <div className="perfil-foto">
            {fotoPerfil ? (
              <img
                src={
                  typeof fotoPerfil === "string"
                    ? fotoPerfil
                    : URL.createObjectURL(fotoPerfil)
                }
                alt="Foto de Perfil"
              />
            ) : (
              <div className="foto-placeholder">Sem Foto</div>
            )}
          </div>

          <div className="perfil-dados">
            <h2>{usuario.nome}</h2>
            <p>{usuario.email}</p>
            <p>
              <strong>Localização:</strong> {usuario.localizacao}
            </p>
            <p>
              <strong>Tipo:</strong> {usuario.eh_doador ? "Doador" : "ONG"}
            </p>
            <p>
              <strong>Bio:</strong> {usuario.bio}
            </p>
            <button onClick={handleEditarPerfil}>Editar Perfil</button>
          </div>
        </div>
      )}

      <Modal isOpen={modalAberto} onRequestClose={handleCancelar}>
        <h3>Editar Perfil</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-foto">
            <label htmlFor="foto_perfil">Foto de Perfil:</label>
            <input
              type="file"
              id="foto_perfil"
              onChange={handleFotoPerfilChange}
              accept="image/*"
            />
            {fotoPerfil && (
              <img
                src={
                  typeof fotoPerfil === "string"
                    ? fotoPerfil
                    : URL.createObjectURL(fotoPerfil)
                }
                alt="Preview"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={dados.nome}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={dados.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="localizacao"
            placeholder="Localização"
            value={dados.localizacao}
            onChange={handleInputChange}
            required
          />
          <label>
            Tipo:
            <select
              name="eh_doador"
              value={dados.eh_doador.toString()}
              onChange={(e) =>
                setDados({ ...dados, eh_doador: e.target.value === "true" })
              }
            >
              <option value="true">Doador</option>
              <option value="false">ONG</option>
            </select>
          </label>
          <textarea
            name="bio"
            placeholder="Bio"
            value={dados.bio}
            onChange={handleInputChange}
            required
          ></textarea>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button type="button" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit">Salvar Alterações</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Perfil;
