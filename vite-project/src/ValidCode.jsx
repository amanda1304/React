import React, {useState} from 'react';
import Enter from './UserAccess/assets/images/Enter OTP-cuate.svg'
import { Link } from 'react-router-dom'
import './make-access/Form.css'

function ValidCode (){
      // Estado para armazenar o código de 5 dígitos
  const [code, setCode] = useState(['', '', '', '', '']); 
  const [loading, setLoading] = useState(false);
  const inputRefs = React.useRef([]); // Para gerenciar o foco entre os inputs

  // Função que lida com a mudança de valor em um input específico
  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    
    // Aceita apenas o primeiro dígito digitado
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Lógica para mover o foco para o próximo input automaticamente
    if (value !== '' && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Lógica para lidar com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join('');

    if (enteredCode.length === 6) {
      setLoading(true);
      console.log('Código para validação:', enteredCode);
      
      // Simulação de chamada de API
      setTimeout(() => {
        setLoading(false);
        // Aqui você faria a chamada real para o backend para validar
        alert('Código enviado para validação!'); 
        // Em um app real: Se o código for válido, navegue para a página de redefinição de senha
      }, 1500);
    } else {
      alert('Por favor, insira o código completo de 5 dígitos.');
    }
  };

  // Função para lidar com o pressionar da tecla Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '') {
      // Se a tecla for Backspace e o campo atual estiver vazio,
      // move o foco para o campo anterior
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
    return(
        <>
               <section>
        <hgroup className="title-img">
            <img src={Enter}alt="Desenho de uma mulher que esqueceu a senha" />
            <h1>Código de validação </h1>
            <h2>Insira o código de 5 dígitos que foi enviado.</h2>
        </hgroup>
        <form onSubmit={handleSubmit} action="" method="post">

            <div className="input-Valid">
                <label htmlFor='validcode' className="label-form" >Digite o código:</label><br/>
               <div className="input-validcontainer">
                   {code.map((digit, index)=>(
                         <input id="validcode" key={index} type="text" maxLength='1' inputMode='numeric' formmethod="post" 
                         value={digit} onChange={(e) => handleCodeChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} ref={el => inputRefs.current[index] = el} required/>
                   
                    ))}
               </div>
            </div>

          
            <div className="input-wrapper-submit " >
                
                <button className="submit-color" type="submit" disabled ={loading || code.join('').length !== 5}>
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                    'Validar Código'
                    )}
                </button> 
            </div>

        </form>
        <button className="go-back">
            <Link className='voltar' to= '/'>
                Voltar
            </Link>
        </button>
  
    </section>
        </>
    );
}
export default ValidCode