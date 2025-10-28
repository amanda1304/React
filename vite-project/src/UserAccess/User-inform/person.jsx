import React, { useState, useEffect } from 'react';

function PersonInform({ usuario = null }){
    const [displayName, setDisplayName] = useState('Usuário');
    const [displaydate, setDisplaydate] = useState('');
    const [displaycpf, setDisplaycpf] = useState('');
    const [displayrg, setDisplayrg] = useState('');
    const [displaymae, setDisplaymae] = useState('');
    const [displaypai, setDisplaypai] = useState('');
    const [displayemail, setDisplayemail] = useState('');
    const [displaycel, setDisplaycel] = useState('');
    const [displaytel, setDisplaytel] = useState('');

    useEffect(() => {
        // Helper to apply a user object to state
        const applyUser = (userObj) => {
            if (!userObj) return;
            const fullName = userObj.nome || userObj.user_name || userObj.name || '';
            setDisplayName(fullName ? fullName.split(' ')[0] : 'Usuário');
            setDisplaydate(userObj.data_nascimento || '');
            setDisplaycpf(userObj.cpf || '');
            setDisplayrg(userObj.rg || '');
            setDisplaymae(userObj.nome_mae || userObj.nomeMae || '');
            setDisplaypai(userObj.nome_pai || userObj.nomePai || '');
            setDisplayemail(userObj.email || '');
            setDisplaycel(userObj.telefone_celular || userObj.celular || '');
            setDisplaytel(userObj.telefone_fixo || userObj.telefone || '');
        };

        // 1) Se a prop `usuario` foi passada pelo componente pai, usa ela
        if (usuario && Object.keys(usuario).length > 0) {
            applyUser(usuario);
            return;
        }

        // 2) Caso contrário, tenta buscar via API /api/me/ usando o token em localStorage
        const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;

        if (!token) {
            // Tenta preencher com dados mínimos do localStorage
            try {
                const storedName = localStorage.getItem('user_name') || '';
                if (storedName) setDisplayName(storedName.split(' ')[0]);
                const storedCpf = localStorage.getItem('user_cpf') || '';
                if (storedCpf) setDisplaycpf(storedCpf);
            } catch (e) { void e; }
            return;
        }

        // Faz o fetch para /api/me/
        fetch('http://localhost:8001/api/me/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        }).then(async (res) => {
            if (!res.ok) {
                // Se falhar, tenta preencher com localStorage mínimo
                try {
                    const storedName = localStorage.getItem('user_name') || '';
                    if (storedName) setDisplayName(storedName.split(' ')[0]);
                } catch (e) { void e; }
                return;
            }
            const data = await res.json();
            applyUser(data);
        }).catch((e) => {
            // Em caso de erro de rede, preencher o minímo do localStorage
            void e;
            try {
                const storedName = localStorage.getItem('user_name') || '';
                if (storedName) setDisplayName(storedName.split(' ')[0]);
            } catch (ex) { void ex; }
        });

    }, [usuario]);

    return(
        <>
            <form action="#">
                <fieldset>
                    <legend>
                        <h2>Informações pessoais</h2>
                    </legend>
                    <div>
                        <label htmlFor="nome">Nome:</label>
                        <input id="nome"  type="text" readOnly value={displayName}/>
                    </div>

                    <div>
                        <div>
                        <label htmlFor="datanasc">Data Nasc.:</label>
                        <input id="datanasc" type="date" value={displaydate} readOnly/>
                        </div>
                        <div>
                        <label htmlFor="cpf">CPF:</label>
                        <input id="cpf" type="text" value={displaycpf} readOnly/>
                        </div>
                        
                        <div>
                        <label htmlFor="rg">RG:</label>
                        <input id="rg" type="text" value={displayrg} readOnly/>
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Afiliados</h2>
                    </legend>
                    <div>
                    <label htmlFor="mae">Nome da mãe </label>
                    <input id="mae" type="text" value={displaymae} readOnly/>
                    </div>

                    <div>
                    <label htmlFor="pai">Nome do pai </label>
                    <input id="pai" type="text" value={displaypai} readOnly/>
                    </div>

                </fieldset>

                <fieldset>
                     <legend>
                        <h2>Contatos</h2>
                    </legend> 
                    <div>
                    <label htmlFor="email">E-mail:</label>
                    <input id="email" type="email" value={displayemail} readOnly/>
                    </div>
                    <div>
                        <label htmlFor="telefone-celular">Cel.:</label>
                        <input id="telefone-celular" value={displaycel} type="text" readOnly/>
                    </div>
                    <div>
                        <label htmlFor="telefone-fixo">Tel.:</label>
                        <input id="telefone-fixo" value={displaytel} type="text" readOnly/>
                    </div>
                    <button type="button">
                        Salvar
                    </button>
                </fieldset>
            </form>
        </>
    )
}
export default PersonInform