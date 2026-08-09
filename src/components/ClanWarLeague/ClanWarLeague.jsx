import React, { useState, useEffect } from "react";
import { getWarLeagueGroup, getWarLeagueWar } from "../../Services/ConnectAPI.js";
import Loader from "../Loader/Loader.jsx";
import "../CurrentWar/CurrentWar.css";
import "./ClanWarLeague.css";

const OWN_CLAN_TAG = "#29Q92YL9Y"; // Los Magios

function ClanWarLeague() {
    const [war, setWar] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showReminderMenu, setShowReminderMenu] = useState(false);
    const [modal, setModal] = useState({ open: false, title: "", content: "" });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchLeagueWar() {
            try {
                const group = await getWarLeagueGroup();

                if (!group || !group.rounds) {
                    setWar(null);
                    setLoading(false);
                    return;
                }

                let foundWar = null;

                // Recorremos de la última ronda hacia la primera, para quedarnos
                // con la guerra más reciente / activa de Los Magios.
                for (const round of [...group.rounds].reverse()) {
                    for (const warTag of round.warTags) {
                        if (!warTag || warTag === "#0") continue;

                        try {
                            const warData = await getWarLeagueWar(warTag);

                            if (
                                warData?.clan?.tag === OWN_CLAN_TAG ||
                                warData?.opponent?.tag === OWN_CLAN_TAG
                            ) {
                                foundWar = warData.opponent.tag === OWN_CLAN_TAG
                                    ? { ...warData, clan: warData.opponent, opponent: warData.clan }
                                    : warData;
                                break;
                            }
                        } catch (innerError) {
                            console.error('Error fetching CWL war:', innerError);
                        }
                    }
                    if (foundWar) break;
                }

                setWar(foundWar);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching CWL group:', error);
                setLoading(false);
            }
        }

        fetchLeagueWar();

        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!war || !war.preparationStartTime) {
        return (
            <div className="war-container">
                <h1 className="current-war-title">Liga de Guerra de Clanes</h1>
                <div className="no-war-message">
                    <p className="no-war-message-text">⚔️ No se encontró una guerra de liga activa para Los Magios.</p>
                </div>
            </div>
        );
    }

    const getTownHallImage = (level) => {
        if (level === 16) return "../public/th16.png";
        if (level === 15) return "../public/th15.png";
        return null;
    };

    const parseWarDate = (raw) => new Date(
        raw.slice(0, 4),
        parseInt(raw.slice(4, 6)) - 1,
        raw.slice(6, 8),
        raw.slice(9, 11),
        raw.slice(11, 13),
        raw.slice(13, 15)
    );

    const preparationStartTime = parseWarDate(war.preparationStartTime);
    const startTime = parseWarDate(war.startTime);
    const endTime = parseWarDate(war.endTime);

    preparationStartTime.setHours(preparationStartTime.getHours() - 3);
    startTime.setHours(startTime.getHours() - 3);
    endTime.setHours(endTime.getHours() - 3);

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

    const handleReminder = () => {
        setShowReminderMenu(false);
        if (!war.clan.members) return;

        // En CWL cada jugador tiene un único ataque por guerra.
        const pendingMembers = war.clan.members.filter(
            (member) => !member.attacks || member.attacks.length === 0
        );

        const lines = [
            "⏱️⚔️‼️ RECORDATORIO ‼️⚔️⏱️",
            "🔥 ATAQUE DE LIGA (CWL)",
        ];

        if (pendingMembers.length === 0) {
            lines.push("✅ Todos los jugadores ya realizaron su ataque.");
        } else {
            pendingMembers.forEach((member) => lines.push(member.name));
        }

        lines.push(
            "Recuerden realizar su ataque en la Liga de Guerra de Clanes!!",
            "~~~~~~~~",
            "⚔️🛡️ CÚPULA DEL CLAN 🛡️⚔️"
        );

        openModal("Recordatorio CWL", lines.join("\n"));
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
            ganado: "¡HEMOS GANADO LA GUERRA! 💪🏼🔥",
            perdido: "¡HEMOS PERDIDO LA GUERRA! ☠️😪",
            empatado: "¡HEMOS EMPATADO LA GUERRA! 🤝⚡",
        }[result];

        const content = [
            "⚔️ GUERRA DE CLANES (CWL) ⚔️",
            "😱💥 FINALIZADA 💥😱",
            resultLine,
            "~~~~~~~~",
            "👑🛡️ CÚPULA DEL CLAN 🛡️👑",
        ].join("\n");

        openModal("Cierre de guerra CWL", content);
    };

    return (
        <div className="war-container">

            <h1 className="current-war-title">Liga de Guerra de Clanes</h1>

            <div className="war-actions">

                <div className="reminder-wrapper">
                    <button
                        className="war-action-button war-action-button--reminder"
                        onClick={handleReminder}
                    >
                        Enviar recordatorio
                    </button>
                </div>

                <button className="war-action-button war-action-button--closure" onClick={handleWarClosure}>
                    Generar cierre de guerra
                </button>

            </div>

            <div className="details">

                <div className="clan-comparison-container">

                    <table className="table-war-comparison">
                        <thead>
                            <tr>
                                <th colSpan="2">
                                    {war.state === "inWar" ? (
                                        <p className="end-time-war">{formatTimeRemaining(endTime)}</p>
                                    ) : war.state === "preparation" ? (
                                        <p className="start-time-war">La Guerra Comenzará en: {formatTimeRemaining(startTime)}</p>
                                    ) : (
                                        <p className="start-time-war">Guerra finalizada</p>
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
                                <td className="clan-img-column-bg"> <img className="clan-img-column" src={war.clan.badgeUrls.medium} alt="clan-img" /></td>
                                <td className="oponent-img-column-bg"> <img className="oponent-img-column" src={war.opponent.badgeUrls.medium} alt="oponent-img" /></td>
                            </tr>
                            <tr>
                                <td className="clan-attacks-column">Ataques: {war.clan.attacks} de {war.teamSize}</td>
                                <td className="oponent-attacks-column">Ataques: {war.opponent.attacks} de {war.teamSize}</td>
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

                            <div className="attacks">
                                {member.attacks && member.attacks.map((attack, index) => (

                                    <div key={index} className="attack-card">

                                        <div className="attack-card-child-1">
                                            <img src="https://imgur.com/3AWSRKg.jpg" alt="escudo" className="escudo-img" />
                                            <p className="attack-card-child-1-p"><strong>Ataque:</strong></p>
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
                                                         <strong>Rival:</strong> {opponentMember.name}
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
                                {(!member.attacks || member.attacks.length === 0) ? (
                                    <p className="attack-card-child-4-p">❌ El jugador no realizó su ataque en esta guerra.</p>
                                ) : (
                                    <p className="attack-card-child-4-p">✅ El jugador realizó su ataque en esta guerra.</p>
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

export default ClanWarLeague;
