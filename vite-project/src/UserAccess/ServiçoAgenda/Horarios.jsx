import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Horarios.css'

export default function Horarios() {
  const location = useLocation()
  const navigate = useNavigate()
  const sub = location.state?.subservico
  const tipo = location.state?.tipo

  const [horarios, setHorarios] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sub) return
    const token = localStorage.getItem('auth_token')
    const id = sub.id_subservico || sub.id_subtipo || sub.id

    const fetchHorarios = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://127.0.0.1:8001/api/horarios/?subservico_id=${encodeURIComponent(id)}`, {
          headers: { Authorization: token ? `Token ${token}` : '' }
        })
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(`Erro na API Horarios: ${res.status} ${txt}`)
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : (Array.isArray(data?.horarios) ? data.horarios : [])
        setHorarios(list)
      } catch (e) {
        console.error(e)
        setError(e.message || 'Falha ao carregar horários')
      } finally {
        setLoading(false)
      }
    }

    fetchHorarios()
  }, [sub])

  async function handleAgendar() {
    if (!selected) return setError('Selecione um horário primeiro')
    console.log('Horário selecionado:', selected)
    setError(null)
    setLoading(true)
    const token = localStorage.getItem('auth_token')
    // construir data_hora a partir do objeto `selected` retornado pela API
    const buildDataHora = s => {
      if (!s) return ''
      // casos comuns: { data, hora } ou { date, time } ou { data, hora_inicio }
      const date = s.data || s.date || s.dia || s.dia_semana || ''
      const time = s.hora || s.time || s.hora_inicio || s.hora_inicio_str || ''
      if (date && time) {
        // tenta normalizar para YYYY-MM-DD HH:MM:SS (se já vier assim, mantém)
        return `${date} ${time}`
      }
      // se tiver campo data_hora já presente, usa direto
      if (s.data_hora) return s.data_hora
      return ''
    }

    const data_hora = buildDataHora(selected)

    const body = {
      id_tipo: tipo?.id_tipo || tipo?.id_tipo || tipo?.id,
      id_subservico: sub?.id_subservico || sub?.id_subtipo || sub?.id,
      id_horario: selected.id_horario || selected.id || null,
      data_hora: data_hora,
      observacoes: ''
    }

    try {
      const res = await fetch('http://127.0.0.1:8001/api/agenda/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || err.error || JSON.stringify(err))
      }
      await res.json()
      setLoading(false)
      navigate('/Sucesso')
    } catch (e) {
      console.error(e)
      setError('Erro ao agendar: ' + e.message)
      setLoading(false)
    }
  }

  if (!sub) {
    return (
      <div>
        <h2>Horários</h2>
        <p>Nenhum subserviço selecionado. Volte e escolha um subserviço.</p>
        <button onClick={() => navigate('/Tiposervico')}>Voltar</button>
      </div>
    )
  }

  return (
    <div className='horarios-container'>
      <h2>Horários para: {sub.nome_subservico || sub.nome || sub.nome_servico || 'Subserviço'}</h2>

      {loading && <p>Carregando horários...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          {horarios.length === 0 ? (
            <div>
              <p>Nenhum horário disponível no momento.</p>
              <button onClick={() => navigate('/Subservico', { state: { tipo } })}>Voltar</button>
            </div>
          ) : (
            <ul className='horarios-list'>
              {horarios.map(h => {
                const key = h.id_horario || h.id || `${h.data}-${h.hora}`
                const label = `${h.data || h.date || h.dia} - ${h.hora || h.hora_inicio || h.time}`
                const isSelected = selected && (selected.id_horario === h.id_horario || selected === h || JSON.stringify(selected) === JSON.stringify(h))
                return (
                  <li
                    key={key}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => setSelected(h)}
                  >
                    {label} {h.disponivel === 0 ? '(ocupado)' : ''}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      <div className='actions'>
        <button disabled={loading} onClick={handleAgendar} className='button-agendar'>
          {loading ? 'Agendando...' : 'Agendar Consulta'}
        </button>
      </div>
    </div>
  )
}
