import React, { useState, useEffect } from "react";
import { getCurrentWarData } from "../../Services/ConnectAPI.js";
import Loader from "../Loader/Loader.jsx";
import "./CurrentWar.css";

function CurrentWar() {
    const [war, setWar] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWarData() {
            try {
                const response = await getCurrentWarData();
                setWar(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching WAR DATA:', error);
                setLoading(false);
            }
        }

        fetchWarData();

        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <Loader />; 
    }

    const getTownHallImage = (level) => {
        if (level === 16) {
            return "../public/th16.png";
        } else if (level === 15) {
            return "../public/th15.png";
        }
        return null; 
    };

    const preparationStartTime = new Date(
        war.preparationStartTime.slice(0, 4),
        parseInt(war.preparationStartTime.slice(4, 6)) - 1,
        war.preparationStartTime.slice(6, 8),
        war.preparationStartTime.slice(9, 11),
        war.preparationStartTime.slice(11, 13),
        war.preparationStartTime.slice(13, 15)
    );

    const startTime = new Date(
        war.startTime.slice(0, 4),
        parseInt(war.startTime.slice(4, 6)) - 1,
        war.startTime.slice(6, 8),
        war.startTime.slice(9, 11),
        war.startTime.slice(11, 13),
        war.startTime.slice(13, 15)
    );

    const endTime = new Date(
        war.endTime.slice(0, 4),
        parseInt(war.endTime.slice(4, 6)) - 1,
        war.endTime.slice(6, 8),
        war.endTime.slice(9, 11),
        war.endTime.slice(11, 13),
        war.endTime.slice(13, 15)
    );

    preparationStartTime.setHours(preparationStartTime.getHours() - 3);
    startTime.setHours(startTime.getHours() - 3);
    endTime.setHours(endTime.getHours() - 3);

    const preparationStartTimeString = preparationStartTime.toLocaleString('es-AR', { hour12: false });
    const startTimeString = startTime.toLocaleString('es-AR', { hour12: false });
    const endTimeString = endTime.toLocaleString('es-AR', { hour12: false });

    const formatTimeRemaining = (time) => {
        const diff = time - currentTime;
        if (diff <= 0) {
            return '00:00:00';
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className="war-container">

            <h1 className="current-war-title">Estadisticas de Guerra Actual</h1>

            <div className="details">

                <div className="clan-comparison-container">

                    <table className="table-war-comparison">
                        <thead>
                            <tr>
                                <th colSpan="2">
                                    {war.state === "inWar" ? (
                                        <p className="end-time-war">{formatTimeRemaining(endTime)}</p>
                                    ) : (
                                        <p className="start-time-war">La Guerra Comenzará en: {formatTimeRemaining(startTime)}</p>
                                    )}
                                </th>
                            </tr>

                            <tr>
                                <th className="clan-name-column-magios">Los Magios</th>
                                <th className="clan-name-column-oponent">{war.opponent.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="clan-img-column-bg"> <img className="clan-img-column" src= {war.clan.badgeUrls.medium} alt="clan-img" /></td>
                                <td className="oponent-img-column-bg"> <img className="oponent-img-column" src= {war.opponent.badgeUrls.medium} alt="oponent-img" /></td>
                            </tr>
                            <tr>
                                <td className="clan-attacks-column">Ataques: {war.clan.attacks} de {war.attacksPerMember * war.teamSize}</td>
                                <td className="oponent-attacks-column">Ataques: {war.opponent.attacks} de {war.attacksPerMember * war.teamSize}</td>
                            </tr>
                            <tr>
                                <td className="clan-destruction-column">Porcentaje de destrucción: %{war.clan.destructionPercentage}</td>
                                <td className="oponent-destruction-column">Porcentaje de destrucción: %{war.opponent.destructionPercentage}</td>
                            </tr>
                            <tr>
                                <td className="clan-stars-column"><img src="../public/star.png" alt="Star" className="star-img-table-clan" /><strong>{war.clan.stars}</strong></td>
                                <td className="clan-oponent-column"><img src="../public/star.png" alt="Star" className="star-img-table" /><strong>{war.opponent.stars}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="participants">
                {war.clan.members && war.clan.members
                    .slice() 
                    .sort((a, b) => a.mapPosition - b.mapPosition) 
                    .map((member, index) => (

                        <div key={index} className="participant-card">

                            <div className="participant-card-header"> 

                                <img src={war.clan.badgeUrls.small} alt="Clan Badge" />

                                <h4 className="participant-card-name">{member.name}</h4>

                                {getTownHallImage(member.townhallLevel) && <img src={getTownHallImage(member.townhallLevel)} alt="Town Hall" className="th-img" />}
                            </div>

                            <p className="participant-card-map-position"><strong>Posición en el mapa N°: {member.mapPosition}</strong></p>

                            <div className="attacks">
                                {member.attacks && member.attacks.map((attack, index) => (

                                    <div key={index} className="attack-card">

                                        <div className="attack-card-child-1">
                                            <img src="../public/escudo.png" alt="escudo" className="escudo-img" />
                                            <p className="attack-card-child-1-p"><strong> Ataque N° {index + 1}:</strong></p>
                                        </div>

                                        <div className="attack-card-child-2-stars">
                                            {Array.from({ length: attack.stars }, (_, i) => (
                                                <img key={i} src="../public/star.png" alt="Star" className="star-img" />
                                            ))}
                                        </div>

                                        <div className="attack-card-child-3">
                                            <p className="attack-card-child-3-destruccion"><strong>Destrucción:</strong> %{attack.destructionPercentage}</p>
                                            
                                            {war.opponent.members && war.opponent.members.map((opponentMember, index) => {
                                               if (opponentMember.tag === attack.defenderTag) {
                                                return (
                                                    <p key={index} className="attack-card-child-3-oponent">
                                                         <strong>Oponente N°: {opponentMember.mapPosition}</strong> 
                                                    </p>
                                                 );
                                                }
                                                    return null;
                                                })}
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div>
                                <h4 className="attack-card-child-4-observaciones">Observaciones</h4>
                                {member.attacks && member.attacks[0] && (
                                    (() => {
                                        const opponentMapPosition = war.opponent.members.find(opponentMember => opponentMember.tag === member.attacks[0].defenderTag)?.mapPosition;
                                        const memberMapPosition = member.mapPosition;
                                        return (
                                            <p className="attack-card-child-4-p">
                                                {opponentMapPosition === memberMapPosition ? "✅ El jugador ha atacado a su espejo." : "❌ El jugador no ha atacado a su espejo."}
                                            </p>
                                        );
                                    })()
                                )}

                                {member.attacks && member.attacks[1] && (
                                    <p className="attack-card-child-4-p">{member.attacks[1].stars > 0 ? "✅ El jugador realizó su 2do ataque en guerra." : "❌ El jugador NO realizó su 2do ataque en guerra."}</p>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
                
            </div>

            {/*<div className="times">
                <p>Preparation started at: {preparationStartTimeString} ({formatTimeRemaining(preparationStartTime)})</p>
                <p>War starts at: {startTimeString} ({formatTimeRemaining(startTime)})</p>
                <p>War ends at: {endTimeString} ({formatTimeRemaining(endTime)})</p>
            </div>

                <p>Team Size: {war.teamSize}</p>*/}
        </div>
    );
}

export default CurrentWar;
