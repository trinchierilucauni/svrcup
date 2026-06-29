import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { FaArrowLeftLong, FaFutbol, FaArrowRightArrowLeft, FaSquare } from "react-icons/fa6";

function InfoGiocatore(){
    const navigate= useNavigate();
    const gestisciClickArrow = () => { navigate(-1); }
    const location= useLocation();
    const dati= location.state;
    const [datiGiocatore, setdatiGiocatore]= useState({});
    console.log(dati);

    const dataGiocatore= async()=>{
        const response= await fetch((`${import.meta.env.VITE_API_URL}/api/dataGiocatore`),{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({nomeGiocatore: dati})
        })
        const data= await  response.json();
        console.log(data);
        setdatiGiocatore(data[0]);
    }
    useEffect(()=>{
        dataGiocatore();
    },[]);

    return(
        <div className="mega-container">
            <div className="info-squadra-header">
                <div className="arrow-back-container" onClick={gestisciClickArrow}>
                    <FaArrowLeftLong className="arrow-left"/>
                </div>
            </div>
            <div style={{paddingLeft:"16px", paddingTop:"16px", paddingRight:"16px", paddingBottom:"20px"}}>
                <div className="rettangolo-infoGiocatore">
                    <div className="bandiera-squadra" style={{backgroundImage: `url(${datiGiocatore.icon_square})`}}></div>
                    <div className="infoTextGiocatore-container">
                        <div className="ruolo-InfoGiocatore">{datiGiocatore.ruolo}</div>
                        <div className="nomeInfoGiocatore">{datiGiocatore.nome_giocatore}</div>
                        <div className="squadra-InfoGiocatore">{datiGiocatore.squadra_giocatore}</div>
                    </div>
                </div>
                <div className="containerBoxInfoGiocatore">
                    <div className="boxInfoGiocatore">
                        <div className="boxText">NUMERO</div>
                            <div className="boxValue">{datiGiocatore.numero_giocatore}</div>

                    </div>
                    <div className="boxInfoGiocatore">
                        <div className="boxText">GOAL</div>
                        <div className="boxValue">{datiGiocatore.gol}</div>
                    </div>
                </div>
                <div className="boxDeiFalli">
                    <div className="boxInfoGiocatore-gialli">
                        <div className="boxText-gialli" style={{color: "#FFC400", opacity:"50%"}}>GIALLI</div>
                        <div className="boxValue" style={{color: "#FFC400"}}>{datiGiocatore.gialli}</div>

                    </div>
                    <div className="boxInfoGiocatore-rossi">
                        <div className="boxText-rossi" style={{color: "#D6454F", opacity:"50%"}}>ROSSI</div>
                        <div className="boxValue" style={{color: "#D6454F"}}>{datiGiocatore.rossi}</div>
                    </div>
                </div>
            </div>

        </div>



    );

}
export default InfoGiocatore;