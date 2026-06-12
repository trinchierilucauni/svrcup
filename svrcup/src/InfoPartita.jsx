import {useLocation, useNavigate} from "react-router-dom";
import { FaArrowLeftLong, FaFutbol, FaArrowRightArrowLeft, FaSquare } from "react-icons/fa6";
import {useState, useEffect} from "react";

function InfoPartita(){
    const navigate= useNavigate();
    const location= useLocation();
    const [partita, setPartita]= useState([]);
    const [dettagliPartita, setdettagliPartita]= useState([]);
    const [eventi, seteventi]= useState([]);
    const dati=location.state;
    const gestisciClickArrow = () => { navigate(-1); }

    const cercaPartita= async()=>{
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/cercaPartita`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id_partita: dati.id_partita})
        });
        const data= await response.json();
        setPartita(data.rows);
    }

    const infoPartita= async()=>{
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/dettagliPartita`,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({id_partita: dati.id_partita})
        });
        const data= await response.json();
        console.log(data.rows);
        setdettagliPartita(data.rows);
    }

    const allEventi= async()=>{
        // Sostituito localhost con la variabile d'ambiente di Vite usando i backtick
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/allEventi`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({id_partita: dati.id_partita})
        });
        const data= await response.json();
        console.log("Ciao2",data.rows)
        seteventi(data.rows);
    }

    useEffect(()=>{
        cercaPartita();
        infoPartita();
        allEventi();
    },[]);

    // Restituisce icona e classe colore in base al tipo di evento
    const infoEvento = (eventoInfo) => {
        switch(eventoInfo){
            case "Gol":
                return { icon: <FaFutbol/>, classe: "evento-icon-gol" };
            case "Cartellino giallo":
                return { icon: <FaSquare/>, classe: "evento-icon-giallo" };
            case "Cartellino rosso":
                return { icon: <FaSquare/>, classe: "evento-icon-rosso" };
            case "Sostituzione":
                return { icon: <FaArrowRightArrowLeft/>, classe: "evento-icon-sostituzione" };
            default:
                return { icon: <FaFutbol/>, classe: "evento-icon-default" };
        }
    }

    return(
        <>
            <div className="mega-container">
                <div className="info-squadra-header">
                    <div className="arrow-back-container" onClick={gestisciClickArrow}>
                        <FaArrowLeftLong className="arrow-left"/>
                    </div>
                </div>

                <div style={{paddingLeft:"16px", paddingRight:"16px", paddingBottom:"20px"}}>

                    {/* Card riepilogo partita */}
                    {dettagliPartita.map((key)=>{
                        return(
                            <div className="match-hero-card" key={key.id_partita}>
                                <div className="match-team-block">
                                    <div className="match-team-icon" style={{backgroundImage: `url(${key.icon1})`}}></div>
                                    <div className="match-team-name">{key.squadra1}</div>
                                </div>

                                <div className="match-score-block">
                                    <div className="match-score-label">Risultato</div>
                                    <div className="match-score">
                                        <span>{key.risultato1==null ? "–" : key.risultato1}</span>
                                        <span className="match-score-sep">:</span>
                                        <span>{key.risultato2==null ? "–" : key.risultato2}</span>
                                    </div>
                                </div>

                                <div className="match-team-block">
                                    <div className="match-team-icon" style={{backgroundImage: `url(${key.icon2})`}}></div>
                                    <div className="match-team-name">{key.squadra2}</div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Timeline eventi */}
                    <div className="timeline-title">Timeline</div>
                    <div className="timeline-list">
                        {eventi.length===0 && (
                            <div className="timeline-empty">Nessun evento registrato</div>
                        )}
                        {eventi.map((key, index)=>{
                            const { icon, classe } = infoEvento(key.evento_info);
                            return(
                                <div className="timeline-item" key={index}>
                                    <div className={`timeline-icon-container ${classe}`}>
                                        {icon}
                                    </div>
                                    <div className="logoSquadra-infopartita" style={{backgroundImage: `url(${key.icon_square    })`}}></div>
                                    <div className="timeline-center">
                                        <div className="timeline-player">{key.giocatore}</div>
                                        <div className="timeline-event">{key.evento_info}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
export default InfoPartita;