import NavBar from "./NavBar";
import logo from "./assets/logo.png";
import React, {useEffect, useState} from "react";

function Partite(){
    const [partite, setPartite] = useState([]);

    const chePartite = async () => {
        const response = await fetch("http://192.168.1.3:3001/api/partite", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        const data = await response.json();
        setPartite(data.rows);
    }

    const cheGiorno = (data) => {
        const d = new Date(data);
        return d.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" });
    }

    const cheOra = (data) => {
        const d = new Date(data);
        return d.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
    }

    useEffect(() => { chePartite(); }, []);

    return (
        <>
            <div className="mega-container">
                <div className="header-row">
                    <div className="logo" style={{backgroundImage: `url(${logo})`}}></div>
                    <div className="page-title">Partite</div>
                </div>
                <div className="linea"></div>
                <div className="sub-title">Fase a gironi</div>

                <div style={{paddingLeft:"16px", paddingRight:"16px", paddingBottom:"20px"}}>
                    {partite.map((key, index) => (
                        <React.Fragment key={key.id_partita}>
                            <div className="giorno-text">{cheGiorno(key.giorno)}</div>
                            <div className="single-match-container">
                                <div className="left-part">
                                    <div className="squadre-name-container">
                                        <div className="squadra1-container">
                                            <div className="squadra-info">
                                                <div className="squadra1-partite-icon" style={{backgroundImage:`url(${key.icon1})`}}></div>
                                                <div className="squadra1-name">{key.squadra1}</div>
                                            </div>
                                            <div className="squadra1-result">{key.risultato1 ?? "–"}</div>
                                        </div>
                                        <div className="squadra1-container">
                                            <div className="squadra-info">
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
            </div>
        </>
    );
}
export default Partite;
