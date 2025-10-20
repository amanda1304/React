import Recetuario from '../Receituario/ValidMedical'
import HistoricoReceitas from '../Receituario/HistoricoReceita'
import Menu from "../Menu/Menu"
import "./medical.css"
function Medical(){
     return(
        <>
        <section className="wrapper-medical">
            <h1>Receitas digitais</h1>
          <Recetuario />

        <HistoricoReceitas />
            <div className='div-menu'>
                        <Menu />
            </div>
        
        </section>
        </>
    )
}
export default Medical