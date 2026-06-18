import {useState, useEffect} from "react";
import logo from "./assets/logo.png"
function ClassificaGironi(){
    const [classificaSquadreA, setclassificaSquadreA]= useState([]);
    const [classificaSquadreB, setclassificaSquadreB]= useState([]);

    const classificaGironeA= async()=>{
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/classificaGironeA`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            
        })
        const data= await response.json();
        console.log(data);
        setclassificaSquadreA(data);
    }
    const classificaGironeB= async()=>{
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/classificaGironeB`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            
        })
        const data= await response.json();
        console.log("Giorni:",data);
        setclassificaSquadreB(data);
    }
    
    useEffect(() => { classificaGironeA();
        classificaGironeB();

     }, []);
    
    return(
                <>
                    <div className="mega-container">
                        <div className="header-row">
                            <div className="logo" style={{backgroundImage: `url(${logo})`}}></div>
                            <div className="page-title">Classifica</div>
                        </div>
        
                        <div className="classifica-container">
                            <div className="girone-title">GIRONE A</div>
                            <div className="classifica-header-row">
                                <div className="classifica-header-left">
                                    <span className="classifica-header-num">#</span>
                                    <span className="classifica-header-squadra">Squadra</span>
                                </div>
                                <div className="classifica-header-right">
                                    <span className="classifica-header-stat">PT</span>
                                    <span className="classifica-header-stat">PG</span>
                                    <span className="classifica-header-stat">DR</span>
                                </div>
                            </div>
        
                            {classificaSquadreA.map((key, index) => (
                                <div
                                    className={`classifica-row ${index < 3 ? `classifica-top-${index+1}` : ''}`}
                                    key={key.id}
                                    onClick={() => gestisciClickSuSquadra({nome: key.nome, icona: key.icon, provenienza: "/classifica"})}
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
                        <div className="spazio" style={{height: "50px"}}></div>
                        <div className="classifica-container">
                            <div className="girone-title">GIRONE B</div>

                            <div className="classifica-header-row">
                                <div className="classifica-header-left">
                                    <span className="classifica-header-num">#</span>
                                    <span className="classifica-header-squadra">Squadra</span>
                                </div>
                                <div className="classifica-header-right">
                                    <span className="classifica-header-stat">PT</span>
                                    <span className="classifica-header-stat">PG</span>
                                    <span className="classifica-header-stat">DR</span>
                                </div>
                            </div>
        
                            {classificaSquadreB.map((key, index) => (
                                <div
                                    className={`classifica-row ${index < 3 ? `classifica-top-${index+1}` : ''}`}
                                    key={key.id}
                                    onClick={() => gestisciClickSuSquadra({nome: key.nome, icona: key.icon, provenienza: "/classifica"})}
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
        
                        <div className="legenda-classifica">
                            <div className="legenda-elem">PT <span>Punti</span></div>
                            <div className="legenda-elem">PG <span>Partite Giocate</span></div>
                            <div className="legenda-elem">DR <span>Differenza Reti</span></div>
                        </div>
                    </div>
                </>


    );
}
export default ClassificaGironi;