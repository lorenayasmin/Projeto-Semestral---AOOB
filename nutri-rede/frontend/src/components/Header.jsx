import React from "react";
import { Link } from "react-router-dom";
import doacaoIcon from '../assets/doacao-de-alimentos-branco.png'

function Header() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/"; // Redireciona para a Home
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={doacaoIcon} alt="Doação de Alimentos" className="logo-icon" />
        Nutri Rede
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/postagem">Postar</Link>
        <Link to="/perfil">Perfil</Link>
        {!usuarioLogado ? (
          <>
            <Link to="/cadastro">Cadastro</Link>
            <Link to="/login">Login</Link>
            <Link to="/sobre">Sobre Nós</Link>
          </>
        ) : (
          <>
            <Link to="/sobre">Sobre Nós</Link>
            <button onClick={handleLogout}>Sair</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
