import React from 'react'
import ImgDoctor from './UserAccess/assets/images/Doctors-bro.svg'
import { Link } from 'react-router-dom'
import './make-access/Form.css'

function SendCode() {
    return(
        <>
                <section>
                    <div class="title-img">
                        <img src={ImgDoctor}alt="Desenho de uma mulher que esqueceu a senha" />
                        <h1>Criar uma nova senha</h1>
                    </div>
                    <form action="" method="post">

                        <div class="input-wrapper">
                            <label class="label-form" htmlFor="newpassword">Nova senha:</label><br />
                            <div class="input-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                        <path d="M16.5 11V7.25C16.5 6.05653 16.0259 4.91193 15.182 4.06802C14.3381 3.22411 13.1935 2.75 12 2.75C10.8065 2.75 9.66193 3.22411 8.81802 4.06802C7.97411 4.91193 7.5 6.05653 7.5 7.25V11M6.75 22.25H17.25C17.8467 22.25 18.419 22.0129 18.841 21.591C19.2629 21.169 19.5 20.5967 19.5 20V13.25C19.5 12.6533 19.2629 12.081 18.841 11.659C18.419 11.2371 17.8467 11 17.25 11H6.75C6.15326 11 5.58097 11.2371 5.15901 11.659C4.73705 12.081 4.5 12.6533 4.5 13.25V20C4.5 20.5967 4.73705 21.169 5.15901 21.591C5.58097 22.0129 6.15326 22.25 6.75 22.25Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <input type="password" name="" id="newpassword" formmethod="post" placeholder="Nova senha:" maxlength="20" />
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <label class="label-form" htmlFor="othernewpassword">Senha:</label><br />
                            <div class="input-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                        <path d="M16.5 11V7.25C16.5 6.05653 16.0259 4.91193 15.182 4.06802C14.3381 3.22411 13.1935 2.75 12 2.75C10.8065 2.75 9.66193 3.22411 8.81802 4.06802C7.97411 4.91193 7.5 6.05653 7.5 7.25V11M6.75 22.25H17.25C17.8467 22.25 18.419 22.0129 18.841 21.591C19.2629 21.169 19.5 20.5967 19.5 20V13.25C19.5 12.6533 19.2629 12.081 18.841 11.659C18.419 11.2371 17.8467 11 17.25 11H6.75C6.15326 11 5.58097 11.2371 5.15901 11.659C4.73705 12.081 4.5 12.6533 4.5 13.25V20C4.5 20.5967 4.73705 21.169 5.15901 21.591C5.58097 22.0129 6.15326 22.25 6.75 22.25Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <input type="password" name="" id="othernewpassword" formmethod="post" placeholder="Digite novamente" maxlength="20" />
                            </div>
                        </div>
                        
                        <div class="input-wrapper-submit " > 
                             <button className ="submit-color" type="submit">Mudar</button>
                        </div>

                    </form>
                </section>
        </>
    )
}
export default SendCode