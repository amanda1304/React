import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Menu from "../Menu/Menu";
import './Servico.css';
function Tiposervico() {
    const [Tiposervico, setTiposervico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (servico) => {
        // Navega para a página de subserviços passando o tipo selecionado
        try {
            navigate('/Subservico', { state: { tipo: servico } });
        } catch (e) {
            console.error('Erro ao navegar para Subservico:', e);
        }
    };

    useEffect(() => {
        const fetchTipos = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
                const res = await fetch('http://localhost:8001/api/tipo_servicos/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Token ${token}` } : {}),
                    },
                });

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(`Erro na API TipoServicos: ${res.status} ${txt}`);
                }

                const data = await res.json();

                // Normaliza diferentes estruturas possíveis vindo do backend
                const servicosList = (Array.isArray(data) ? data : [])
                    .map(item => ({
                        id: item.id_tipo_servico || item.id_tipo || item.id || item.id_tipo_servico || item.id_tipo,
                        nome: item.nome_servico || item.nome || item.title || item.nome_servico,
                        descricao: item.descricao || item.descricao_servico || ''
                    }));

                setTiposervico(servicosList);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError(e.message || 'Falha ao carregar tipos de serviço');
                setLoading(false);
            }
        };

        fetchTipos();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-lg text-gray-600">Carregando tipos de serviço...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wapper-servico">
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <>
        <section>

            <h2>Nova Consulta</h2>
            <h3>Selecione o tipo de consulta:</h3>
           <nav>
                 {/* A ESTRUTURA DE REPETIÇÃO: mapeando o array tiposervico para gerar os links */}
                    <ul className="space-y-4">
                        {Tiposervico.map((servico) => (
                            <li className="button-nav" key={servico.id}>
                                <div
                                    onClick={() => handleSelect(servico)}
                                    
                                >
                                    <div className="div-servico-nav">
                                        <p className="font-medium">{servico.nome}</p>
                                        
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
            </nav>
            <div className='div-menu'>
                    <Menu />
            </div>
        </section>
        </>
    );
}
export default Tiposervico;