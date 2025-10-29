import React, { useEffect, useState } from 'react'
import './consultation.css'

export default function Consul() {
  const [agendamentos, setAgendamentos] = useState([])
  const [subservico, setServico] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    
    const fetchAgenda = async () => {
      setLoading(true)
      setError(null)
      try {
        // Buscar serviços primeiro
        const servicosRes = await fetch('http://127.0.0.1:8001/api/subservicos/', { // Ajuste a URL conforme sua API
          headers: { Authorization: token ? `Token ${token}` : '' }
        })
        
        if (servicosRes.ok) {
          const servicosData = await servicosRes.json()
          const servicosMap = {}
          // Ajuste 'nome' para o campo correto da sua API
          servicosData.forEach(servico => {
            servicosMap[servico.id] = servico.nome || servico.descricao || 'Serviço'
          })
          setServico(servicosMap)
        }

        // Buscar agendamentos
        const agendaRes = await fetch('http://127.0.0.1:8001/api/agenda/', {
          headers: { Authorization: token ? `Token ${token}` : '' }
        })
        
        if (!agendaRes.ok) throw new Error('Falha ao buscar agendamentos')
        const data = await agendaRes.json()
        
        const list = Array.isArray(data) ? data : (Array.isArray(data?.agendamentos) ? data.agendamentos : [])
        list.sort((a, b) => {
          const da = new Date(a.data_hora || `${a.data} ${a.hora}`)
          const db = new Date(b.data_hora || `${b.data} ${b.hora}`)
          return da - db
        })
        setAgendamentos(list)
        
      } catch (e) {
        console.error(e)
        setError(e.message || 'Erro')
      } finally {
        setLoading(false)
      }
    }
    fetchAgenda()
  }, [])

  const getNomeServico = (id_servico) => {
    return subservico[id_servico] || 'Consulta'
  }

  const fmt = dtStr => {
    if (!dtStr) return ''
    const d = new Date(dtStr)
    if (isNaN(d)) return dtStr
    return d.toLocaleString()
  }

  return (
    <div className='consultation'>
      <h2>Próximas consultas</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && agendamentos.length === 0 && <p>Nenhum agendamento encontrado.</p>}

      {agendamentos.map(a => (
        <article key={a.id_agendamento || a.id} className='agendamento'>
          <h3>{getNomeServico(a.id_tipo_servico)}</h3>
          <p>{fmt(a.data_hora || `${a.data || ''} ${a.hora || ''}`)}</p>
          {a.status && <p>Status: {a.status}</p>}
          {a.observacoes && <p>Observações: {a.observacoes}</p>}
        </article>
      ))}
    </div>
  )
}