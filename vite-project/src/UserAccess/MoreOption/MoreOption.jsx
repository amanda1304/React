
import { NavLink } from 'react-router-dom';
import Report from '../assets/images/medical-report.png';
import Exit from '../assets/images/exit.png';
import Less from '../assets/images/less.png'
import './MoreOption.css';
function MoreOption({ visivel, fecharMenu }){
     if (!visivel) return null;
    return(
        <>
            <nav className='listMore'>
                <ul className='list-aberta'>
                <li>
                    <NavLink className='nav-more'  to='/Exam'>
                        <img src={Report} alt="icone de laudo/exame" />
                        Exame Laudo
                    </NavLink>
                </li>
                <li>
                    <NavLink className='nav-more'  to='/'>
                        <img src={Exit} alt="icone de sair" />
                        Sair
                    </NavLink>
                </li>
                
                </ul>
                <ul>
                    <li >
                         <button
                            className="less-nav"
                            onClick={(event) => {
                            event.stopPropagation();
                            fecharMenu();
                            }}
                            
                        >
                            <img className='img-less' src={Less} alt="" /> 
                        </button>
                    </li>
                </ul>
                
            </nav>  
        </>
    )
}
export default MoreOption