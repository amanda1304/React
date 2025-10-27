// src/ApiTest.jsx

import React, { useState, useEffect } from 'react';

// Certifique-se de que o Django está rodando na porta correta!
const API_URL = 'http://localhost:8001/api/teste/'; 

function ApiTest() {
  const [mensagem, setMensagem] = useState("Aguardando conexão com o Backend...");
  const [erro, setErro] = useState(null);
  const [port] = useState(8000); // Para exibir a porta correta no erro

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          // Se a resposta HTTP for 404, 500, etc.
          throw new Error(`Erro HTTP: ${response.status}. Verifique se o endpoint '${API_URL}' existe.`);
        }
        return response.json();
      })
      .then(data => {
        setMensagem(`SUCESSO! Mensagem do Django: ${data.message}`);
        setErro(null);
      })
      .catch(err => {
        // Se houver um erro de rede ou CORS
        console.error("Erro ao buscar dados do Django:", err);
        setErro(`FALHA DE CONEXÃO na porta ${port}. Erro: ${err.message}. Verifique o CORS ou a porta.`);
      });
  }, [port]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Teste de Conexão com Django</h2>
      <p>Tentando conectar em: <strong>{API_URL}</strong></p>
      
      {erro ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>
      ) : (
        <p style={{ color: 'green', fontWeight: 'bold' }}>{mensagem}</p>
      )}
    </div>
  );
}

export default ApiTest