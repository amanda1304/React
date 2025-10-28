import Menu from "../Menu/Menu"
import PersonInform from "./person"
import PacienteInform from "./paciente"
import './user-inform.css'
function UserInform (){
    return(
        <>
        <section>
            <h1>Perfil</h1>
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