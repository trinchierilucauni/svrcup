import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import {useState, useEffect} from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function InfoSquadra(){
    const location = useLocation();
    const dati = location.state;
    const navigate = useNavigate();
    const [elemSelezionato, setelemSelezionato] = useState("partite");
    const [partite, setpartite] = useState([]);
    const [componentiSquadra, setcomponentiSquadra] = useState([]);
    const [capoCannoniere, setcapoCannoniere] = useState({});
    const [classificaSquadre, setclassificaSquadre]= useState([]);

    const partitedellaSquadra = async () => {
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partitemancanti`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nome: dati.nome})
        });
        const data = await response.json();
        setpartite(data.rows);
    }

    const gestisciClickArrow = () => { navigate(-1); }

    const gestisciSelezione = (selezionato) => {
        setelemSelezionato(selezionato);
    }

    const cheGiorno = (data) => {
        const d = new Date(data);
        return d.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" });
    }

    const cheOra = (data) => {
        const d = new Date(data);
        return d.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
    }

    const componentiSquadraFun = async (nomeSquadra) => {
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/componentiSquadra`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nomeSquadra})
        });
        const data = await response.json();
        setcomponentiSquadra(data.rows);
        let temp = 0, tempNome = "";
        for(let i = 0; i < data.rows.length; i++){
            if(data.rows[i].gol > temp){
                temp = data.rows[i].gol;
                tempNome = data.rows[i].nome_giocatore;
            }
        }
        setcapoCannoniere({nome: tempNome, gol: temp});
    }

    const classifica = async () => {
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classificaCompleta`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        const data = await response.json();
        setclassificaSquadre(data.rows);
    }

    const gestisciClickSuSquadra=(e, infoSquadra)=>{
        e.stopPropagation();
        setelemSelezionato("partite");
        navigate("/infosquadra", {state: infoSquadra, replace: true});
    }

    const gestisciClickSuPartita=(partitaInfo)=>{
        navigate("/infopartita",{state: partitaInfo})
    }

    useEffect(() => {
        partitedellaSquadra();
        componentiSquadraFun(dati.nome);
        classifica();
    }, [dati.nome]);

    return (
        <div className="mega-container">
            {/* Header con freccia back */}
            <div className="info-squadra-header">
                <div className="arrow-back-container" onClick={gestisciClickArrow}>
                    <FaArrowLeftLong className="arrow-left"/>
                </div>
            </div>

            {/* Hero squadra */}
            <div className="info-squadra-hero">
                <div className="icona-squadra-info" style={{backgroundImage: `url(${dati.icona})`}}></div>
                <div className="nome-squadra-info">{dati.nome}</div>
            </div>

            {/* Tab navigation interna */}
            <div className="nav-bar-infopartita">
                {["partite", "posizionamento", "squadra"].map((tab) => (
                    <div
                        key={tab}
                        className={`nav-bar-infopartita-elem ${elemSelezionato === tab ? 'tab-attiva' : ''}`}
                        onClick={() => gestisciSelezione(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </div>
                ))}
            </div>

            {/* Sezione PARTITE */}
            {elemSelezionato === "partite" && (
                <div style={{paddingLeft:"16px", paddingRight:"16px", paddingBottom:"20px"}}>
                    {partite.map((key) => (
                        <React.Fragment key={key.id_partita}>
                            <div className="giorno-text">{cheGiorno(key.giorno)}</div>
                            <div className="single-match-container" onClick={()=>gestisciClickSuPartita({id_partita: key.id_partita})}>
                                <div className="left-part">
                                    <div className="squadre-name-container">
                                        <div className="squadra1-container">
                                            <div className="squadra-info">
                                                <div className="squadra1-partite-icon" style={{backgroundImage:`url(${key.icon1})`}}></div>
                                                <div className="squadra1-name" onClick={(e) => gestisciClickSuSquadra(e, {nome: key.squadra1, icona: key.icon1})}>{key.squadra1}</div>
                                            </div>
                                            <div className="squadra1-result">{key.risultato1 ?? "–"}</div>
                                        </div>
                                        <div className="squadra1-container" onClick={(e) => { e.stopPropagation(); gestisciClickSuPartita({id_partita: key.id_partita}); }}>
                                            <div className="squadra-info" onClick={(e) => gestisciClickSuSquadra(e,{nome: key.squadra2, icona: key.icon2})}>
                                                <div className="squadra1-partite-icon" style={{backgroundImage:`url(${key.icon2})`}}></div>
                                                <div className="squadra1-name">{key.squadra2}</div>
                                            </div>
                                            <div className="squadra1-result">{key.risultato2 ?? "–"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-part">
                                    <div className="rectangle">{cheOra(key.giorno)}</div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Sezione SQUADRA */}
            {elemSelezionato === "squadra" && (
                <div style={{paddingLeft:"16px", paddingRight:"16px", paddingBottom:"20px"}}>
                    {capoCannoniere.nome && (
                        <div className="capo-cannoniere">
                            <div className="capo-cannoniere-label">⚽ Capo Cannoniere</div>
                            <div className="capo-cannoniere-info">
                                <div className="nome-capocannoniere">{capoCannoniere.nome}</div>
                                <div className="gol-capocannoniere">{capoCannoniere.gol} gol</div>
                            </div>
                        </div>
                    )}
                    {componentiSquadra.map((key, index) => (
                        <div className="componente-squadra-container" key={key.id_giocatore}>
                            <div className="numero-maglia">{key.numero_giocatore}</div>
                            <div className="center-componente">
                                <div className="nome-componente">{key.nome_giocatore}</div>
                                <div className="info-componente">{key.gol} gol</div>
                            </div>
                            <div className="right-componente">
                                <div className="ruolo-componente">{key.ruolo}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sezione POSIZIONAMENTO */}
            {elemSelezionato === "posizionamento" && (
                <div style={{padding:"40px 16px", textAlign:"center"}}>
                    {classificaSquadre.map((key, index) => (
                        <div
                            className={`classifica-row ${index < 3 ? `classifica-top-${index+1}` : ''}`}
                            key={key.id} style={{backgroundColor: dati.nome==key.nome ? "rgba(255,255,255,0.08)" : ""}}
                            onClick={(e) => gestisciClickSuSquadra(e, {nome: key.nome, icona: key.icon})}
                        >
                            <div className="classifica-row-left">
                                <div className="classifica-pos">{index + 1}</div>
                                <div className="icon-classifica" style={{backgroundImage: `url(${key.icon_square})`}}></div>
                                <div className="nome-squadra-classifica">{key.nome}</div>
                            </div>
                            <div className="classifica-row-right">
                                <div className="classifica-stat classifica-stat-punti">{key.punti}</div>
                                <div className="classifica-stat">{key.partite_giocate}</div>
                                <div className="classifica-stat">{key.gol_fatti - key.gol_subiti}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default InfoSquadra;