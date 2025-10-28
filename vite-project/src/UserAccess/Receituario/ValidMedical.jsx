import './ValidMedical.css';

function ValidMedical (){
    return(
        <>
 

             <div className='wrapper-medical'>
                <h2>Receitas Validas</h2>

                <article>
                    <h3>{displaymedicamento}</h3>
                    <p>
                        {displaydose} - {displayinstrucoes} <br/>
                        Emissão: {displaydataemissao} - Validade: {displayvalidade} <br/>
                        Status: {displaystatus}
                    </p>
                </article>    
            </div>
       
        </>
    )
}
export default ValidMedical