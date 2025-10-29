import Recetuario from '../Receituario/ValidMedical'

import Menu from "../Menu/Menu"
import "./medical.css"
function Medical(){
     return(
        <>
        <section className="wrapper-medical">
            <h1>Receitas digitais</h1>
          <Recetuario />


            <div className='div-menu'>
                        <Menu />
            </div>
        
        </section>
        </>
    )
}
export default Medical