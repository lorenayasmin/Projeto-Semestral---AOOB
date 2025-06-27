import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [postagens, setPostagens] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // Usando variável de ambiente

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        const response = await axios.get(`${API_URL}/postagens`);
        setPostagens(response.data);
      } catch (error) {
        console.error("Erro ao carregar as postagens:", error);
      }
    };

    fetchPostagens();
  }, [API_URL]);

  // Função para formatar a data no formato dd/mm/aaaa
  const formatarData = (data) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj)) return "Data inválida";
    return dataObj.toLocaleDateString("pt-BR");
  };

  return (
    <div className="home-container">
      <section className="historia">
        <h1>Bem-vindo ao Nutri Rede!</h1>
        <p>
          Nos últimos anos, o desperdício de alimentos tem sido um problema crescente,
          especialmente com muitas pessoas enfrentando a fome. Muitas vezes, alimentos em boas condições são jogados fora,
          enquanto outros precisam deles desesperadamente.
        </p>
        <p>
          Nosso projeto busca resolver esse problema, conectando doadores de alimentos com ONGs de caridade. Assim,
          garantimos que os alimentos cheguem a quem mais precisa, combatendo o desperdício e promovendo a solidariedade.
        </p>
      </section>

      <section className="postagens-container">
        <div className="postagens">
          <h2>Postagens Disponíveis</h2>
        </div>

        <div className="postagens-grid">
          {postagens.length > 0 ? (
            postagens.map((postagem) => (
              <div key={postagem.id} className="postagem-card">
                {postagem.imagem && (
                  <img
                    src={`${API_URL}/${postagem.imagem}`}
                    alt={postagem.titulo}
                    className="postagem-imagem"
                  />
                )}
                <h3>{postagem.titulo}</h3>
                <p>{postagem.descricao}</p>
                <p>
                  <strong>Localização:</strong> {postagem.localizacao}
                </p>
                <p>
                  <strong>Validade:</strong> {formatarData(postagem.data_validade)}
                </p>
                <p>
                  <strong>Quantidade:</strong> {postagem.quantidade}
                </p>
                <p>
                  <strong>Contato:</strong> {postagem.contato}
                </p>
              </div>
            ))
          ) : (
            <p>Nenhuma postagem disponível no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
