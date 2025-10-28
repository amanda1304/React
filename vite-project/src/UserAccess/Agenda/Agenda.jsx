import Menu from "../Menu/Menu"
import { Link, NavLink } from "react-router-dom"
import Consul from "../Consult/consultation"
import './Agenda.css'
import HistoricoCunsul from "../Consult/Históricoconsul"
import Tiposervico from "../ServiçoAgenda/ServicoAgenda"

function Agenda (){

     return(
        <>
        <section>
            <h1>agendamentos/encaminhamento</h1>
           
        
            <button>
                <NavLink to="/Tiposervico" end className={({isActive}) => isActive? "on-link" : "link" } className="link-agendar">
                    Agendar Consulta
                </NavLink>
            </button>
            <Consul />
            <HistoricoCunsul />
            <div className='div-menu'>
                    <Menu />
            </div>

        </section>
        </>
    )
}
export default Agenda