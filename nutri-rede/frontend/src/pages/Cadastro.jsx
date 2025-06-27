import React, { useState } from "react";
import axios from "axios";

function Cadastro() {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    localizacao: "",
    eh_doador: true, // Por padrão, o usuário é doador
    foto_perfil: null, // Para uploads locais
    bio: "",
    senha: "",
    confirmarSenha: "",
  });

  const API_URL = import.meta.env.VITE_API_URL; // Usando variável de ambiente

  // Atualiza os dados do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDados({
      ...dados,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Atualiza o campo de upload de foto
  const handleFotoChange = (e) => {
    setDados({ ...dados, foto_perfil: e.target.files[0] });
  };

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dados.senha !== dados.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", dados.nome);
      formData.append("email", dados.email);
      formData.append("localizacao", dados.localizacao);
      formData.append("eh_doador", dados.eh_doador);
      formData.append("bio", dados.bio);
      formData.append("senha", dados.senha);

      if (dados.foto_perfil) {
        formData.append("foto_perfil", dados.foto_perfil);
      }

      const response = await axios.post(`${API_URL}/usuarios`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.mensagem || "Usuário cadastrado com sucesso!");

      setDados({
        nome: "",
        email: "",
        localizacao: "",
        eh_doador: true,
        foto_perfil: null,
        bio: "",
        senha: "",
        confirmarSenha: "",
      });

      // Redireciona para a página de login após o cadastro
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={dados.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={dados.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="localizacao"
          placeholder="Localização"
          value={dados.localizacao}
          onChange={handleChange}
          required
        />
        <label>
          Sou um doador:
          <input
            type="checkbox"
            name="eh_doador"
            checked={dados.eh_doador}
            onChange={handleChange}
          />
        </label>
        <textarea
          name="bio"
          placeholder="Bio"
          value={dados.bio}
          onChange={handleChange}
        ></textarea>
        <label>Foto de Perfil (Upload)</label>
        <input type="file" name="foto_perfil" onChange={handleFotoChange} />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={dados.senha}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar Senha"
          value={dados.confirmarSenha}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;
