import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./member.css";

function Member(props) {

    const getTownHallImage = (level) => {
        if (level === 18) {
            return "/th18.png";
        } else if (level === 17) {
            return "/th17.png";
        }
        return null; 
    };

    const townHallImage = getTownHallImage(props.townHallLevel);

    const getRole = (role) => {
        if (role === "admin") {
            return "Veteran";
        } else if (role == "coLeader") {
            return "Coleader";
        } else if (role == "member") {
            return "Member";
        } else if (role == "leader") {
            return "Leader"
        }
        return null
    };

    const memberRole = getRole(props.role);

    return (
        <Link 
            to={`/player/%23${props.tag.substring(1)}`}
            className="card-member-link"
        >
            <div className="card-member-container">
                <div className="card-member-header">
                    <img 
                        src={props.leagueTier?.iconUrls?.small} 
                        alt="League Icon" 
                        className="league-icon-member" 
                    />
                    <h3 className="player-name">{props.name}</h3>
                </div>

                <div className="card-description-th-trophy">
                    <p className="card-member-th-img">
                        {townHallImage && <img src={townHallImage} alt="Town Hall" className="th-img" />}
                    </p>
                    <p className="card-info-number-trophies"><img src="/trophy.png" alt="league" className="trophy-img-member" /> <strong>{props.trophies}</strong></p>
                </div>

                <div className="card-member-description">
                    <p className="card-member-info-role">👑 Rol: <strong> {memberRole} </strong></p>
                    <p className="card-member-info-donations">✅ Donaciones: <strong>{props.donations}</strong></p>
                    <p className="card-member-info-donations-received">⏬️ Donaciones Recibidas: <strong>{props.donationsReceived}</strong></p>
                </div>

                <div className="card-member-div-button">
                    <button className="card-member-button-more-info">Ver más</button>
                </div>
            </div>
        </Link>
    );
}

export default Member;
