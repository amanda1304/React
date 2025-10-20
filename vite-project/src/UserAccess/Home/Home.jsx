
import Menu from '../Menu/Menu';
import Consul from '../Consult/consultation';
import ValidMedical from '../Receituario/ValidMedical';
import './home.css';
function Home(){
    return(
        <>
            <section className='content-user'>
                <h1>Bem Vindo: </h1>
                    <Consul />
                    <ValidMedical />
                <div className='wrapper-menu'>
                    <Menu />
                </div>
                    
            </section>


        </>
    )
}
export default Home