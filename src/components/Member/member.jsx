import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./member.css";

function Member(props) {
    const [isCopied, setIsCopied] = useState(false);
    const playerTagRef = useRef(null);

    // Función para obtener la URL de la imagen del Town Hall
    const getTownHallImage = (level) => {
        if (level === 16) {
            return "../public/th16.png";
        } else if (level === 15) {
            return "../public/th15.png";
        }
        return null; // No devuelve ninguna imagen si no es nivel 15 o 16
    };

    const townHallImage = getTownHallImage(props.townHallLevel);

    const copyToClipboard = () => {
        const textToCopy = playerTagRef.current.textContent.trim();
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 3000); 
    };

    return (
        <div className="card-container">
            <div className="card-header">
                <img src={props.league.iconUrls.small} alt="League Icon" className="league-icon-member" />
                <h3 className="player-name">{props.name}</h3>
                {!isCopied && <p ref={playerTagRef} onClick={copyToClipboard} className="player-tag">{props.tag}</p>}
                {isCopied && <span style={{ color: "white" }}>¡Copiado!</span>}
            </div>

            <div className="card-description-th-trophy">
                <p className="card-info">
                    {townHallImage && <img src={townHallImage} alt="Town Hall" className="th-img" />}
                </p>
                <p className="card-info"><img src="../public/trophy.png" alt="league" className="trophy-img" /> <strong>{props.trophies}</strong></p>
            </div>

            <div className="card-description">
                <p className="card-info">👑 Rol: <strong>{props.role}</strong></p>
                <p className="card-info">✅ Donaciones: <strong>{props.donations}</strong></p>
                <p className="card-info">❌ Donaciones Recibidas: <strong>{props.donationsReceived}</strong></p>
            </div>

            <Link to={`/player/%23${props.tag.substring(1)}`}><button className="card-button">Ver más</button></Link>
        </div>
    );
}

export default Member;
