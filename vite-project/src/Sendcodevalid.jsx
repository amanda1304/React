import React from 'react'
import ImgPassword from './UserAccess/assets/images/Forgot password-bro.svg'
import { Link } from 'react-router-dom'
import './make-access/Form.css'

function SendCode() {
    return(
        <>
            <section>
                <hgroup class="title-img">
                    <img src={ImgPassword} alt="Desenho de uma mulher que esqueceu a senha"/>
                    <h1>Recuperar Senha</h1>
                    <h2>Informe o seu e-mail ou telefone cadastrado para recuperar a senha.</h2>
                </hgroup>
                <form  className='acesso' action="" method="post">
                    <fieldset>

                        <div class="input-wrapper">
                            <label class="label-form" htmlFor="email">Email:</label><br />
                        <div class="input-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M16.4062 6.25C16.4062 7.286 15.9947 8.27957 15.2621 9.01214C14.5296 9.7447 13.536 10.1562 12.5 10.1562C11.464 10.1562 10.4704 9.7447 9.73786 9.01214C9.0053 8.27957 8.59375 7.286 8.59375 6.25C8.59375 5.214 9.0053 4.22043 9.73786 3.48786C10.4704 2.7553 11.464 2.34375 12.5 2.34375C13.536 2.34375 14.5296 2.7553 15.2621 3.48786C15.9947 4.22043 16.4062 5.214 16.4062 6.25ZM4.68854 20.9562C4.72202 18.9066 5.55973 16.9523 7.02102 15.5146C8.48231 14.077 10.4501 13.2713 12.5 13.2713C14.5499 13.2713 16.5177 14.077 17.979 15.5146C19.4403 16.9523 20.278 18.9066 20.3115 20.9562C17.8608 22.08 15.196 22.6599 12.5 22.6562C9.7125 22.6562 7.06667 22.0479 4.68854 20.9562Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <input type="email" name="email" id="email" formmethod="post" placeholder="email" maxlength="50" />
                        </div>
                        </div>

                        <div class="input-wrapper">
                            <label class="label-form" htmlFor="telefone">Telefone:</label><br />
                            <div class="input-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.25 6.75C2.25 15.034 8.966 21.75 17.25 21.75H19.5C20.0967 21.75 20.669 21.5129 21.091 21.091C21.5129 20.669 21.75 20.0967 21.75 19.5V18.128C21.75 17.612 21.399 17.162 20.898 17.037L16.475 15.931C16.035 15.821 15.573 15.986 15.302 16.348L14.332 17.641C14.05 18.017 13.563 18.183 13.122 18.021C11.4849 17.4191 9.99815 16.4686 8.76478 15.2352C7.53141 14.0018 6.58087 12.5151 5.979 10.878C5.817 10.437 5.983 9.95 6.359 9.668L7.652 8.698C8.015 8.427 8.179 7.964 8.069 7.525L6.963 3.102C6.90214 2.85869 6.76172 2.6427 6.56405 2.48834C6.36638 2.33397 6.1228 2.25008 5.872 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V6.75Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            
                                <input  id="telefone"name="telefone"type="text"inputmode="numeric"
                                placeholder="(00)00000-0000"maxlength="11"autocomplete="off"
                                aria-label="telefone" /> 
                            </div>
                        </div>
                        <div className="input-wrapper-submit " >
                            
                            <input className="submit-color" type="submit" value="Enviar" />
                        </div>

                    </fieldset>
                </form>
                <button className="go-back">
                    <Link className='voltar' to= '/'>
                        Voltar
                    </Link>

                </button>
            </section>
        </>
    )
}
export default SendCode