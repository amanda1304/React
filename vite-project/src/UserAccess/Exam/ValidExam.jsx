import React, { useState, useEffect } from 'react';
import './exame.css'
function ValidExam (){
    const [exames, setExames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {   
        const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
        if (!token) {
            setError('Usuário não autenticado');
            setLoading(false);
            return;
        }

        // Busca a lista de exames do backend
        fetch('http://localhost:8001/api/exames/', {
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
            setExames(Array.isArray(data) ? data : []);
            setLoading(false);
        }).catch((e) => {
            setError(e.message || 'Falha ao buscar exames');
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div>
            <h2> Recentes</h2>
            <p>Carregando...</p>
        </div>
    );

    if (error) return (
        <div>
            <h2> Recentes</h2>
            <p style={{color: 'red'}}>{error}</p>
        </div>
    );

    return (
        <div>
            <h2>Recentes</h2>
            {exames.length === 0 && <p>Nenhum exame encontrado.</p>}
            {exames.map((e) => (
                <article key={e.id_exame || `${e.id_usuario}-${e.data_exame}`}>
                    <h3>{e.tipo_exame || e.tipo || 'Exame'}</h3>
                    <p>
                        {e.descricao || e.resultados || ''} <br/>
                        Data: {e.data_exame || ''} <br/>
                        Médico: {e.medico_responsavel || e.medico || ''} <br/>
                        Status: {e.status || ''}
                    </p>
                </article>
            ))}
        </div>
    );
}
export default ValidExam;