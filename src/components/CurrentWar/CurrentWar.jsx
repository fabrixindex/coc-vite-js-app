import React, { useState, useEffect } from "react";
import { getCurrentWarData } from "../../Services/ConnectAPI.js";
import Loader from "../Loader/Loader.jsx";
import "./CurrentWar.css";

function CurrentWar() {
    const [war, setWar] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showReminderMenu, setShowReminderMenu] = useState(false);
    const [modal, setModal] = useState({ open: false, title: "", content: "" });
    const [copied, setCopied] = useState(false);

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

    if (!war || war.state === "notInWar" || !war.preparationStartTime) {
        return (
            <div className="war-container">
                <h1 className="current-war-title">Estadisticas de Guerra Actual</h1>
                <div className="no-war-message">
                    <p className="no-war-message-text">⚔️ El clan no se encuentra actualmente en guerra.</p>
                </div>
            </div>
        );
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

    const getMirrorTag = (member) => {
        const mirrorOpponent = war.opponent.members.find(
            (opponentMember) => opponentMember.mapPosition === member.mapPosition
        );
        return mirrorOpponent ? mirrorOpponent.tag : null;
    };

    const getAllAttackedDefenderTags = () => {
        const tags = new Set();
        war.clan.members.forEach((m) => {
            (m.attacks || []).forEach((a) => tags.add(a.defenderTag));
        });
        return tags;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    };

    const openModal = (title, content) => {
        setCopied(false);
        setModal({ open: true, title, content });
    };

    const closeModal = () => {
        setModal({ open: false, title: "", content: "" });
    };

    const handleSearchWar = () => {
        const content = [
            "⚔️ *BÚSQUEDA DE GUERRA* ⚔️",
            "                           *DE* ",
            "🛡️🔥 *CLANES INICIADA* 🔥🛡️",
        ].join("\n");

        openModal("Búsqueda de guerra", content);
    };

    const handleRegistrationMessage = () => {
        const content = [
            "⚔️ 🔥 *GUERRA DE CLANES* 🔥⚔️",
            "",
            "👑 *COLÍDER A CARGO:* xxxxx",
            "",
            "⚠️‼️ Ya se encuentra disponible el registro para la próxima guerra de clanes. Recuerda presionar el botón verde para participar.",
            "",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑",
        ].join("\n");

        openModal("Registro de guerra", content);
    };

    const handleReminder = (attackNumber) => {
        setShowReminderMenu(false);
        if (!war.clan.members) return;

        const pendingMembers = war.clan.members.filter(
            (member) => !member.attacks || member.attacks.length < attackNumber
        );

        const attackWord = attackNumber === 1 ? "primer" : "segundo";
        const title = attackNumber === 1
            ? "Recordatorio: 1er ataque"
            : "Recordatorio: 2do ataque";

        const lines = [
            "⏱️⚔️‼️ *RECORDATORIO* ‼️⚔️⏱️",
            "",
            `🔥 *ATAQUE N° ${attackNumber}*`,
            "",
        ];

        if (pendingMembers.length === 0) {
            lines.push("✅ Todos los jugadores ya realizaron este ataque.");
        } else {
            pendingMembers.forEach((member) => lines.push(member.name));
        }

        lines.push(
            "",
            `*Recuerden realizar su ${attackWord} ataque en guerra!!*`,
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "⚔️🛡️ *CÚPULA DEL CLAN* 🛡️⚔️"
        );

        openModal(title, lines.join("\n"));
    };

    const handleSanctions = () => {
        if (!war.clan.members) return;
    
        const maxStars = war.teamSize * 3;
        const isPerfectWar = war.clan.stars >= maxStars && war.clan.destructionPercentage >= 100;
    
        const attackedTags = new Set();
        war.clan.members.forEach((m) => {
            (m.attacks || []).forEach((a) => attackedTags.add(a.defenderTag));
        });
    
        const lines = [
            "⚔️😡 *SANCIONES DE GUERRA* 😡⚔️",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "",
        ];
    
        if (isPerfectWar) {
            lines.push("🎉 ¡GUERRA PERFECTA! No hay sanciones.");
        } else {
            const attackedTags = getAllAttackedDefenderTags();
            const faultLines = [];

            war.clan.members.forEach((member) => {
                const faults = [];

                if (!member.attacks || member.attacks.length === 0) {
                    faults.push("No realizó ningún ataque (EXPULSIÓN)");
                } else {
                    const mirrorTag = getMirrorTag(member);
                    if (mirrorTag && !attackedTags.has(mirrorTag)) {
                        faults.push("No atacó a su espejo en el 1er ataque (1 GUERRA DE SANCIÓN)");
                    }
                    if (member.attacks.length < 2) {
                        faults.push("No realizó su 2do ataque (1 GUERRA DE SANCIÓN)");
                    }
                }

                if (faults.length > 0) {
                    faultLines.push(`🔴 ${member.name} ➡️ ${faults.join(" / ")}`);
                }
            });

            if (faultLines.length === 0) {
                lines.push("✅ No hay jugadores sancionados.");
            } else {
                lines.push(...faultLines);
            }
        }
    
        lines.push("", "~~~~~~~~~~~~~~~~~~~~~~~~", "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑");
    
        openModal("Lista de sanciones", lines.join("\n"));
    };

    const handleWarClosure = () => {
        let result;
        if (war.clan.stars > war.opponent.stars) {
            result = "ganado";
        } else if (war.clan.stars < war.opponent.stars) {
            result = "perdido";
        } else if (war.clan.destructionPercentage > war.opponent.destructionPercentage) {
            result = "ganado";
        } else if (war.clan.destructionPercentage < war.opponent.destructionPercentage) {
            result = "perdido";
        } else {
            result = "empatado";
        }

        const resultLine = {
            ganado: "*¡HEMOS GANADO LA GUERRA!* 💪🏼🔥",
            perdido: "*¡HEMOS PERDIDO LA GUERRA!* ☠️😪",
            empatado: "*¡HEMOS EMPATADO LA GUERRA!* 🤝⚡",
        }[result];

        const content = [
            "⚔️ *GUERRA DE CLANES* ⚔️",
            "😱💥 *FINALIZADA* 💥😱",
            "",
            resultLine,
            "",
            "*~~~~~~~~~~~~~~~~~~~~~~~~*",
            "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑",
        ].join("\n");

        openModal("Cierre de guerra", content);
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
                                <td className="clan-stars-column"><img src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img-table-clan" /><strong>{war.clan.stars}</strong></td>
                                <td className="clan-oponent-column"><img src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img-table" /><strong>{war.opponent.stars}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="war-actions">

                        <button className="war-action-button war-action-button--search" onClick={handleSearchWar}>
                            Buscar guerra
                        </button>

                        <button className="war-action-button war-action-button--registration" onClick={handleRegistrationMessage}>
                            Abrir registro
                        </button>

                    <div className="reminder-wrapper">
                        
                        <button
                            className="war-action-button war-action-button--reminder"
                            onClick={() => setShowReminderMenu((prev) => !prev)}
                        >
                            Enviar recordatorio
                        </button>

                        {showReminderMenu && (
                            <div className="reminder-submenu">
                                <button className="reminder-submenu-item" onClick={() => handleReminder(1)}>1er ataque</button>
                                <button className="reminder-submenu-item" onClick={() => handleReminder(2)}>2do ataque</button>
                            </div>
                        )}
                    </div>

                    <button className="war-action-button war-action-button--sanctions" onClick={handleSanctions}>
                        Generar lista de sanciones
                    </button>

                    <button className="war-action-button war-action-button--closure" onClick={handleWarClosure}>
                        Generar cierre de guerra
                    </button>

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
                                            <img src="https://imgur.com/3AWSRKg.jpg" alt="escudo" className="escudo-img" />
                                            <p className="attack-card-child-1-p"><strong> Ataque N° {index + 1}:</strong></p>
                                        </div>

                                        <div className="attack-card-child-2-stars">
                                            {Array.from({ length: attack.stars }, (_, i) => (
                                                <img key={i} src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img" />
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

            {modal.open && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{modal.title}</h3>
                            <button className="modal-close-button" onClick={closeModal}>✕</button>
                        </div>
                        <pre className="modal-content">{modal.content}</pre>
                        <div className="modal-footer">
                            <button className="war-action-button" onClick={() => copyToClipboard(modal.content)}>
                                {copied ? "¡Copiado!" : "Copiar mensaje"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CurrentWar;
