import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Menu from "../Menu/Menu";
import './Servico.css'
function Subservico() {
    const location = useLocation();
    const tipo = location.state?.tipo || null; // objeto do tipo selecionado
    const tipoId = tipo?.id || tipo?.id_tipo || tipo?.id_tipo_servico || null;

    const [subservicos, setSubservicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tipoId) return;
        const fetchSub = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
                const url = `http://localhost:8001/api/subservicos/?tipo_id=${encodeURIComponent(tipoId)}`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Token ${token}` } : {}),
                    },
                });

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(`Erro na API Subservicos: ${res.status} ${txt}`);
                }

                const data = await res.json();
                console.debug('API /subservicos response:', data);
                setSubservicos(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError(e.message || 'Falha ao carregar subserviços');
            } finally {
                setLoading(false);
            }
        };

        fetchSub();
    }, [tipoId]);

    const navigate = useNavigate();

    const handleRetry = () => {
        // simples modo de forçar re-render: refazer fetch ao navegar para mesma rota
        navigate(0);
    };

    if (!tipo) {
        return (
            <div>
                <h2>Subserviços</h2>
                <p>Nenhum tipo de serviço selecionado. Volte e escolha um tipo.</p>
            </div>
        );
    }

    return (
        <div className='container-servico'>
            <h2> {tipo.nome || tipo.title || tipo.nome_servico || 'Serviço'}</h2>

            {loading && <p>Carregando subserviços...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <nav>
                    {subservicos.length === 0 ? (
                        <div >
                            <p>Nenhum subserviço encontrado para este tipo.</p>
                            <button onClick={() => navigate('/Tiposervico')}>Voltar para tipos</button>
                            <button onClick={handleRetry} >Recarregar</button>
                        </div>
                    ) : (
                        <ul>
                            {subservicos.map((s) => (
                                <li className="button-nav" key={s.id_subservico || s.id || JSON.stringify(s)}>
                                    <button className='btn-escolha'
                                        onClick={() => navigate('/Horarios', { state: { subservico: s, tipo } })}
                                        
                                    >
                                        {s.nome_subservico || s.nome_servico || s.nome || JSON.stringify(s)}
                                    </button>
                                </li>
                            ))}

                        </ul>
                    )}
                </nav>
            )}
            <Menu />
        </div>
    );
}

export default Subservico;