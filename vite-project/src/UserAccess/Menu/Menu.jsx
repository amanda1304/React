import { Link, NavLink } from "react-router-dom"
import More from '../assets/images/more.png'
import React, { useState, useRef, useEffect } from "react";
import './menu.css'
import MoreOption from "../MoreOption/MoreOption"

function Menu (){
    const [aberto, setAberto] = useState(false);
    const menuRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAberto(false);
        
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);
            
    return(
        <>
            <nav>
                <ul className="list-nav">
                    <li className="option-list">
                        <NavLink to='/Home' end className={({isActive}) => isActive? "on-link" : "link" 
                        }>
                             <svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
                                <path d="M3.37943 10.625L13.5044 2.75L23.6294 10.625V23C23.6294 23.5967 23.3924 24.169 22.9704 24.591C22.5485 25.0129 21.9762 25.25 21.3794 25.25H5.62943C5.03269 25.25 4.46039 25.0129 4.03843 24.591C3.61648 24.169 3.37943 23.5967 3.37943 23V10.625Z" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.1294 25.25V14H16.8794V25.25" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div className="text-link">
                                Inicio
                            </div>
                        </NavLink>
                    </li>

                    <li className="option-list">
                        <NavLink to='/Medical' end className={({isActive}) => isActive? "on-link" : "link"
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M16.7256 4H18.7256C19.2561 4 19.7648 4.21071 20.1399 4.58579C20.5149 4.96086 20.7256 5.46957 20.7256 6V20C20.7256 20.5304 20.5149 21.0391 20.1399 21.4142C19.7648 21.7893 19.2561 22 18.7256 22H6.72565C6.19521 22 5.68651 21.7893 5.31143 21.4142C4.93636 21.0391 4.72565 20.5304 4.72565 20V6C4.72565 5.46957 4.93636 4.96086 5.31143 4.58579C5.68651 4.21071 6.19521 4 6.72565 4H8.72565" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.7256 2H9.72565C9.17336 2 8.72565 2.44772 8.72565 3V5C8.72565 5.55228 9.17336 6 9.72565 6H15.7256C16.2779 6 16.7256 5.55228 16.7256 5V3C16.7256 2.44772 16.2779 2 15.7256 2Z" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div className="text-link">
                                Receita
                            </div>
                            
                        </NavLink>
                    </li>

                    <li className="more-option" onClick={() => setAberto((prev) => !prev) }
                        ref={menuRef}
                        aria-haspopup="true"
                        aria-expanded={aberto}>
                            {/*<MoreOption />*/}
                           <img src={More} alt="Icone de mais Opções" />
                        <MoreOption visivel={aberto} fecharMenu={() => setAberto(false)} />
                    </li>

                    <li className="option-list">
                        <NavLink to='/Agenda' end className={({isActive}) => isActive? "on-link" : "link"
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M19.1681 4H5.16809C4.06352 4 3.16809 4.89543 3.16809 6V20C3.16809 21.1046 4.06352 22 5.16809 22H19.1681C20.2727 22 21.1681 21.1046 21.1681 20V6C21.1681 4.89543 20.2727 4 19.1681 4Z" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.1681 2V6" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8.16809 2V6" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.16809 10H21.1681" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div className="text-link">
                                Consulta
                            </div>
                        </NavLink>
                    </li>

                    <li className="option-list">
                        <NavLink to='/UserInform' end className={({isActive}) => isActive? "on-link" : "link"
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M20.3894 21V19C20.3894 17.9391 19.968 16.9217 19.2178 16.1716C18.4677 15.4214 17.4503 15 16.3894 15H8.3894C7.32854 15 6.31112 15.4214 5.56098 16.1716C4.81083 16.9217 4.3894 17.9391 4.3894 19V21" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.3894 11C14.5985 11 16.3894 9.20914 16.3894 7C16.3894 4.79086 14.5985 3 12.3894 3C10.1803 3 8.3894 4.79086 8.3894 7C8.3894 9.20914 10.1803 11 12.3894 11Z" stroke="#264B5D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                             <div className="text-link">
                                Perfil
                                
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}
export default Menu