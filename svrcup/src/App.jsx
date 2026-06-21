import React from "react";
import "./App.css";
import logo from "./assets/logo.png";
import { useEffect, useState } from "react";

import { GoHomeFill } from "react-icons/go";
import { TbSoccerField } from "react-icons/tb";
import { MdScoreboard } from "react-icons/md";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import NavBar from "./NavBar.jsx";
import { useNavigate } from "react-router-dom";

function App() {
  const [partiteFuture, setPartiteFuture] = useState([]);
  const [sezioneAttiva, setsezioneAttiva] = useState("squadre");
  const [topSquadre, settopSquadre] = useState([]);
  const [isAttivo, setisAttivo] = useState(true);
  const [isAttivo2, setisAttivo2] = useState(false);
  const navigate = useNavigate();

  // Funzione helper per uniformare le stringhe di Neon al fuso italiano
  const creaDataItaliana = (stringaDataDb) => {
    if (!stringaDataDb) return new Date();
    // Neon restituisce "YYYY-MM-DD HH:MM:SS". Sostituiamo lo spazio con 'T'
    // e forziamo il fuso orario italiano estivo (+02:00) per evitare che Vercel usi UTC
    const stringaFormattata = stringaDataDb.replace(" ", "T") + "+02:00";
    return new Date(stringaFormattata);
  };

  const elencoPartite = async () => {
    // Genera l'orario attuale esatto in Italia
    const adessoItaliaStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" });
    const adessoItalia = new Date(adessoItaliaStr);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partiteRow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    // Filtriamo usando la data normalizzata italiana
    const filtrate = data.filter((partita) => {
      const dataPartita = creaDataItaliana(partita.giorno);
      return dataPartita >= adessoItalia;
    });

    const primeCinqueFuture = filtrate.slice(0, 5);
    setPartiteFuture(primeCinqueFuture);
  };

  const classifica = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classifica`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    
    let temp = [];
    for (let i = 0; i < 5; i++) {
      if (data[i]) temp[i] = data[i];
    }
    settopSquadre(temp);
  };

  const cheDataScrivo = (key) => {
    const oggi = new Date();
    const domani = new Date();
    domani.setDate(oggi.getDate() + 1);
    
    const dataDalDb = creaDataItaliana(key.giorno);
    
    if (dataDalDb.toDateString() === oggi.toDateString()) return "Oggi";
    if (dataDalDb.toDateString() === domani.toDateString()) return "Domani";
    return dataDalDb.getDate() + " " + dataDalDb.toLocaleString('it-IT', { month: 'short' });
  };

  const cheOraScrivo = (giorno) => {
    const d = creaDataItaliana(giorno);
    
    // Usiamo toLocaleString forzando la timezone italiana, isolando ore e minuti
    return d.toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const clickBottone = (bottoneCliccato) => {
    setsezioneAttiva(bottoneCliccato);
    setisAttivo(bottoneCliccato === "squadre");
    setisAttivo2(bottoneCliccato === "marcatori");
  };

  useEffect(() => {
    elencoPartite();
    classifica();
  }, []);

  return (
    <>
      <div className="mega-container">
        <header>
          <div className="header-row">
            <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
            <div className="page-title">Home</div>
          </div>
        </header>
        <main>
          <div className="nextMatches-section">
            <Swiper
              modules={[Navigation]}
              slidesPerView={"auto"}
              spaceBetween={10}
              navigation={false}
            >
              {partiteFuture.map((key, index) => (
                key && (
                  <SwiperSlide key={index} style={{ width: "auto" }}>
                    <div className="containerPartiteFuture">
                      <div className="rowSquadre">
                        <div className="squadra1" style={{ backgroundImage: `url(${key.icon1})` }}></div>
                        <div style={{ color: "#333", fontSize: "12px", fontWeight: "700" }}>vs</div>
                        <div className="squadra2" style={{ backgroundImage: `url(${key.icon2})` }}></div>
                      </div>
                      <div className="giorno">{cheDataScrivo(key)}</div>
                      <div className="ora">{cheOraScrivo(key.giorno)}</div>
                    </div>
                  </SwiperSlide>
                )
              ))}
            </Swiper>
          </div>

          <div className="megaCard-home">
            <div className="text-section-card">
              <div className="data-card">15 Jun — 10 Jul</div>
              <div className="card-title">SVR WORLD CUP</div>
              <div className="card-text">
                Dopo 4 anni ritorna il torneo Sanvitese.<br />
                Un totale di <span>11</span> squadre in campo.<br />
                <span>2500€</span> di montepremi, <span>3</span> soli vincitori.
              </div>
            </div>
            <div className="prova">
              Fasi a gironi in corso...
              <div className="madeby">Made by SVR Campetto</div>
            </div>
          </div>

          <div className="rigaBottoni">
            <div
              className={`bottoneSquadre ${isAttivo ? 'bottoneAttivo' : ''}`}
              onClick={() => clickBottone("squadre")}
            >Top Squadre</div>
            <div
              className={`bottoneSquadre ${isAttivo2 ? 'bottoneAttivo' : ''}`}
              onClick={() => clickBottone("marcatori")}
            >Top Marcatori</div>
          </div>

          {sezioneAttiva === "squadre" && (
            <div className="top-squadre-container">
              {topSquadre.map((key, index) => (
                <div className="top-squadra-container" key={key.id} onClick={() => navigate("/infosquadra", { state: { nome: key.nome, icona: key.icon, provenienza: "/" } })}>
                  <div className="top-squadra-leftContainer">
                    <div className="posizione">{index + 1}</div>
                    <div className="icon-top-squadra" style={{ backgroundImage: `url(${key.icon_square})` }}></div>
                    <div className="nome-top-squadra">{key.nome}</div>
                  </div>
                  <div>
                    <div className="punti-top-squadra">{key.punti}</div>
                    <div className="punti-label">pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sezioneAttiva === "marcatori" && (
            <div className="marcatori-container" style={{ padding: "40px 16px", textAlign: "center" }}>
              <div style={{ color: "#444", fontSize: "14px", fontFamily: "Poppins, sans-serif" }}>Dati in arrivo...</div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
export default App;