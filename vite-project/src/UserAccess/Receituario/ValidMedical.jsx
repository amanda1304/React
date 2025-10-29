import React, { useState, useEffect } from 'react';
import './ValidMedical.css';

function HistoricoReceitas({ usuario = null }){
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
        if (!token) {
            setError('Usuário não autenticado');
            setLoading(false);
            return;
        }

        // Busca a lista de receitas do backend
        fetch('http://localhost:8001/api/receitas/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        }).then(async (res) => {
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Erro na API: ${res.status} ${txt}`);
            }
            const data = await res.json();
            setReceitas(Array.isArray(data) ? data : []);
            setLoading(false);
        }).catch((e) => {
            setError(e.message || 'Falha ao buscar receitas');
            setLoading(false);
        });

    }, [usuario]);

    if (loading) return (<div className='wrapper-medical'><h2>Histórico de Receitas</h2><p>Carregando...</p></div>);
    if (error) return (<div className='wrapper-medical'><h2>Histórico de Receitas</h2><p style={{color:'red'}}>{error}</p></div>);

    return (
        <div className='wrapper-medical'>
            <h2>Receitas Validas</h2>
            {receitas.length === 0 && <p>Nenhuma receita encontrada.</p>}
            {receitas.map((r) => (
                <article key={r.id_receita} className='receita-item'>
                    <h3>{r.medicamento}-{r.dosagem || r.dose || ''}</h3>
                    <p>
                        {r.instrucoes} <br/>
                         - 
                        Emissão: {r.data_emissao || ''} - Val: {r.validade || ''} <br/>
                        Status: {r.status || ''}
                    </p>
                </article>
            ))}
        </div>
    );
}

export default HistoricoReceitas;
