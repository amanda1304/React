import SucessIcon from '../../assets/sucess.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SucessoAgendamento() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Agenda');
    }, 60 * 1000); // 1 minuto

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="sucesso-agendamento">
      <h2>Agendamento Realizado com Sucesso!</h2>
      <img src={SucessIcon} alt="icone de certo" />
      <p>Você será redirecionado para a agenda em 1 minuto...</p>
    </div>
  );
}

export default SucessoAgendamento;