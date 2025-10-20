import Menu from "../Menu/Menu"
import ValidExam from "./ValidExam"
import HistoricoExam from "./HistoricoExam"
function Exam (){
     return(
        <>
        <section>

            <h1>Exames e Laudos</h1>
            <ValidExam />
            <HistoricoExam />
            <div className='div-menu'>
                    <Menu />
            </div>
        </section>
        </>
    )
}
export default Exam