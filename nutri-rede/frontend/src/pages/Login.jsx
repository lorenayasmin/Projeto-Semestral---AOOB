import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [dados, setDados] = useState({
    email: "",
    senha: "",
  });

  const API_URL = import.meta.env.VITE_API_URL; // Usando variável de ambiente

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia email e senha para o backend para validar login
      const response = await axios.post(`${API_URL}/login`, {
        email: dados.email,
        senha: dados.senha,
      });

      if (response.data.mensagem) {
        alert("Login realizado com sucesso!");
        const usuarioResponse = await axios.get(
          `${API_URL}/usuarios?email=${dados.email}`
        );
        localStorage.setItem("usuario", JSON.stringify(usuarioResponse.data));
        window.location.href = "/perfil";
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.response?.data?.erro || "Erro ao realizar login.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Digite seu email"
          value={dados.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Digite sua senha"
          value={dados.senha}
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
