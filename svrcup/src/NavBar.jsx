import {useState} from "react";
import { GoHomeFill } from "react-icons/go";
import { TbSoccerField } from "react-icons/tb";
import { MdScoreboard } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar(){
    const navigate = useNavigate();
    const location = useLocation();

    const path = location.pathname;
    const homeAttiva = path === "/";
    const partiteAttiva = path === "/partite";
    const classificaAttiva = path === "/classifica";

    const iconaAttiva = (icona) => {
        if(icona === "home") navigate("/");
        else if(icona === "classifica") navigate("/classifica");
        else if(icona === "partite") navigate("/partite");
    }

    return(
        <div className="navBarFine">
            <div className="icon-container" onClick={()=>iconaAttiva("home")}>
                <GoHomeFill className={`icon ${homeAttiva ? 'icon-attiva': ''}`}/>
                <span className="icon-text" style={{opacity:`${homeAttiva ? '1': '0.4'}`}}>Home</span>
            </div>
            <div className="icon-container" onClick={()=>iconaAttiva("partite")}>
                <TbSoccerField className={`icon ${partiteAttiva ? 'icon-attiva': ''}`}/>
                <span className="icon-text" style={{opacity:`${partiteAttiva ? '1': '0.4'}`}}>Partite</span>
            </div>
            <div className="icon-container" onClick={()=>iconaAttiva("classifica")}>
                <MdScoreboard className={`icon ${classificaAttiva ? 'icon-attiva': ''}`}/>
                <span className="icon-text" style={{opacity:`${classificaAttiva ? '1': '0.4'}`}}>Classifica</span>
            </div>
        </div>
    );
}
export default NavBar;
