import Menu from "../Menu/Menu"
import PersonInform from "./person"
import PacienteInform from "./paciente"
import './user-inform.css'
function UserInform (){
    return(
        <>
        <section>
            <h1>mudar texto aqui ficará outras partes</h1>
            <PersonInform/>
            <PacienteInform />
            <div className='div-menu'>
                    <Menu />
            </div>

        </section>
        </>
    )
}
export default UserInform