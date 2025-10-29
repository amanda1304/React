
import Menu from "../Menu/Menu"
import ValidExam from "./ValidExam"

function Exam (){
     return(
        <>
        <section>

            <h1>Exames e Laudos</h1>
            <ValidExam />

            <div className='div-menu'>
                    <Menu />
            </div>
        </section>
        </>
    )
}
export default Exam