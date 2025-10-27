import React, { useState } from 'react';
import medicine from './UserAccess/assets/images/Medicine-bro.svg'
import './make-access/Form.css'
import { Link,useNavigate } from 'react-router-dom'
const API_LOGIN_URL = 'http://localhost:8001/api/login/';

function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState(''); 
  const [Error, setError] = useState('');
  
  // Hook para navegação programática
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento padrão do formulário
    setError('');
  const cleanCpf = cpf.replace(/\D/g, ''); 
      // O payload corrigido (cpf e password) está sendo mantido.
  const payload = {
    cpf: cleanCpf,
    password: password,
  };
  try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        // SUCESSO!
        console.log("Login bem-sucedido. Token recebido:", data.token);

        // 1. Armazenar o Token para uso futuro (melhor prática para autenticação)
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user_id);
        
        // 2. Redirecionar para a tela Home (como você solicitou)
        navigate('/Home'); 

      } else {
       const errorMessage = data.non_field_errors?.[0] || data.detail || 'Credenciais inválidas. Verifique seu CPF e senha.';
        setError(errorMessage);
      } 
    } catch (err) {
      // ERRO DE REDE/CORS (servidor Django fora do ar, erro de porta, etc.)
      console.error("Erro na requisição:", err);
      setError('Falha de conexão com o servidor. Verifique se o Django está ativo na porta 8001.');
    }
  };
  // Função para formatar o CPF visualmente no campo
  const formatCpf = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };
  return (
    <>
      <section>
          <div className ="title-img">
            <img src={medicine} alt="Desenho de médico" />
            <h1>Acesso usuario <br /> unificado</h1>
          </div>
          <form  action=""method="post"onSubmit={handleSubmit}>
            <fieldset>
            <legend>
              Login do Usuário
            </legend>

             {Error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{Error}</p>}

            <div className ="input-wrapper">
                <label htmlFor="cpf" className="label-form">CPF:</label>
                  <div className ="input-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true" focusable="false" >
                          <path d="M16.4062 6.25C16.4062 7.286 15.9947 8.27957 15.2621 9.01214C14.5296 9.7447 13.536 10.1562 12.5 10.1562C11.464 10.1562 10.4704 9.7447 9.73786 9.01214C9.0053 8.27957 8.59375 7.286 8.59375 6.25C8.59375 5.214 9.0053 4.22043 9.73786 3.48786C10.4704 2.7553 11.464 2.34375 12.5 2.34375C13.536 2.34375 14.5296 2.7553 15.2621 3.48786C15.9947 4.22043 16.4062 5.214 16.4062 6.25ZM4.68854 20.9562C4.72202 18.9066 5.55973 16.9523 7.02102 15.5146C8.48231 14.077 10.4501 13.2713 12.5 13.2713C14.5499 13.2713 16.5177 14.077 17.979 15.5146C19.4403 16.9523 20.278 18.9066 20.3115 20.9562C17.8608 22.08 15.196 22.6599 12.5 22.6562C9.7125 22.6562 7.06667 22.0479 4.68854 20.9562Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <input 
                        id="cpf" 
                        name="cpf" 
                        type="text"
                        inputmode="numeric"
                        placeholder="000.000.000-00" 
                        maxlength="11"
                        autocomplete="off" 
                        required 
                        value={formatCpf(cpf)}
                        onChange={(e) => setCpf(e.target.value)}
                      /> 
                  </div>
             </div>
            
            <div className ="input-wrapper">
                <label className ="label-form" htmlFor="password">Senha:</label>
               <div className ="input-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M16.5 11V7.25C16.5 6.05653 16.0259 4.91193 15.182 4.06802C14.3381 3.22411 13.1935 2.75 12 2.75C10.8065 2.75 9.66193 3.22411 8.81802 4.06802C7.97411 4.91193 7.5 6.05653 7.5 7.25V11M6.75 22.25H17.25C17.8467 22.25 18.419 22.0129 18.841 21.591C19.2629 21.169 19.5 20.5967 19.5 20V13.25C19.5 12.6533 19.2629 12.081 18.841 11.659C18.419 11.2371 17.8467 11 17.25 11H6.75C6.15326 11 5.58097 11.2371 5.15901 11.659C4.73705 12.081 4.5 12.6533 4.5 13.25V20C4.5 20.5967 4.73705 21.169 5.15901 21.591C5.58097 22.0129 6.15326 22.25 6.75 22.25Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="password" 
                      name="" id="password" 
                      formmethod="post" 
                      placeholder="Senha" 
                      maxlength="20" 
                      aria-live="assertive"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                    />
               </div>
            </div>
           <div id ="div-esqueci">
            <Link to='/SendCode'>Esqueci Senha</Link>
           </div>
            <div className ="input-wrapper-submit " >
                <button className ="submit-color" type="submit">Entrar</button>
            </div>
            </fieldset>
        </form>
    </section>
     
    </>
  )
}

export default Login
