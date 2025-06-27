import React from "react";
import "./Sobre.css"; // Certifique-se de criar e incluir este arquivo CSS

function Sobre() {
  const desenvolvedores = [
    {
      nome: "Talia Moura",
      foto: "https://avatars.githubusercontent.com/u/117600513?v=4", // Imagem simulada
      github: "https://github.com/TahMoura",
    },
    {
      nome: "Lorena Yasmin",
      foto: "https://avatars.githubusercontent.com/u/141173962?v=4", // Imagem simulada
      github: "https://github.com/lorenayasmin",
    },
    {
      nome: "Nicoly Souza",
      foto: "https://avatars.githubusercontent.com/u/141174047?v=4", // Imagem simulada
      github: "https://github.com/nicolysouzas",
    },
    {
      nome: "Kevin Mukanda",
      foto: "https://avatars.githubusercontent.com/u/175489057?v=4", // Imagem simulada
      github: "https://github.com/KevinPrince2024",
    },
  ];

  return (
    <div className="sobre-nos">
      <h1>Sobre Nós</h1>
      <div className="cards-container">
        {desenvolvedores.map((dev, index) => (
          <div key={index} className="card">
            <img src={dev.foto} alt={`Foto de ${dev.nome}`} className="card-foto" />
            <h3 className="card-nome">{dev.nome}</h3>
            <a href={dev.github} target="_blank" rel="noopener noreferrer" className="card-github">
              GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sobre;
