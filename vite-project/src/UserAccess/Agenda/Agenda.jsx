import Menu from "../Menu/Menu"
import Consul from "../Consult/consultation"
import './Agenda.css'
import HistoricoCunsul from "../Consult/Históricoconsul"
function Agenda (){
     return(
        <>
        <section>
            <h1>agendamentos/encaminhamento</h1>
            <button>
                Agendar Consulta
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