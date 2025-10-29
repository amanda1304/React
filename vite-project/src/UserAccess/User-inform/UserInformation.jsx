import Menu from "../Menu/Menu"
import PersonInform from "./person"
import PacienteInform from "./paciente"
import './user-inform.css'
function UserInform (){
    return(
        <>
        <section className='content-user'>
            <h1>Perfil</h1>
            <PersonInform/>
            
            <div className='div-menu'>
                    <Menu />
            </div>

        </section>
        </>
    )
}
export default UserInform