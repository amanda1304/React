
import React, { useState, useEffect } from 'react'; // useState/useEffect para obter o nome do localStorage
import Menu from '../Menu/Menu';
import Consul from '../Consult/consultation';
import ValidMedical from '../Receituario/ValidMedical';
import './home.css';


// A Home function aceita 'user' como propriedade (prop)
function Home({ usuario = {} }){
    // Estado local para o nome do usuário (pode vir via prop ou localStorage)
    const [displayName, setDisplayName] = useState('Usuário');

    useEffect(() => {
        // Prioriza o prop `usuario.nome` caso esteja presente
        const nomeDoProp = usuario && usuario.nome;
        if (nomeDoProp && nomeDoProp.trim().length > 0) {
            setDisplayName(nomeDoProp.split(' ')[0]);
            return;
        }

        // Caso contrário, tenta ler do localStorage (preenchido no login)
        try {
            const stored = localStorage.getItem('user_name') || localStorage.getItem('user_nome') || '';
            if (stored && stored.trim().length > 0) {
                setDisplayName(stored.split(' ')[0]);
                return;
            }
        } catch {
            // Em ambientes sem localStorage (SSR/testes) ignoramos o erro
        }

        // Fallback padrão
        setDisplayName('Usuário');
    }, [usuario]);

    console.log("Dados do usuário recebidos em Home.jsx:", usuario, 'displayName:', displayName);

    return(
        <>
            <section className='content-user'>
                {/* Exibindo o primeiro nome do usuário */}
                <h1>Bem-vindo(a): {displayName}</h1>
               
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
