import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Horarios() {
  const location = useLocation();
  const navigate = useNavigate();
  const sub = location.state?.subservico || null;
  const subId = sub?.id_subservico || sub?.id || sub?.id_subtipo || null;

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subId) return;
    const fetchHorarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
        const res = await fetch(`http://localhost:8001/api/horarios/?subservico_id=${encodeURIComponent(subId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Token ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Erro na API Horarios: ${res.status} ${txt}`);
        }

        const data = await res.json();
        console.debug('horarios api response', data);
        // if backend returns diagnostic object, pick subservicos key
        const list = Array.isArray(data) ? data : (Array.isArray(data?.horarios) ? data.horarios : []);
        setHorarios(list);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Falha ao carregar horários');
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [subId]);

  if (!sub) {
    return (
      <div>
        <h2>Horários</h2>
        <p>Nenhum subserviço selecionado. Volte e escolha um subserviço.</p>
        <button onClick={() => navigate('/Tiposervico')}>Voltar</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Horários para: {sub.nome_subservico || sub.nome || sub.nome_servico || 'Subserviço'}</h2>

      {loading && <p>Carregando horários...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          {horarios.length === 0 ? (
            <div>
              <p>Nenhum horário disponível no momento.</p>
              <button onClick={() => navigate('/Subservico', { state: { tipo: location.state?.tipo } })}>Voltar</button>
            </div>
          ) : (
            <ul>
              {horarios.map(h => (
                <li key={h.id_horario || JSON.stringify(h)}>
                  {h.data || h.dia_semana || ''} - {h.hora || h.hora_inicio || ''} {h.disponivel === 0 ? '(ocupado)' : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    <button className='button-agendar' onClick={() => navigate('/Sucesso')}>
      Agendar Consulta
    </button>
    </div>
   
  );
}

export default Horarios;
