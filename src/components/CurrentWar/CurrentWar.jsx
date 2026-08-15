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
                <h1 className="current-war-title">
                    <span className="current-war-title-text">Guerra Actual</span>
                </h1>
                <div className="no-war-message">
                    <p className="no-war-message-text">⚔️ El clan no se encuentra actualmente en guerra.</p>
                </div>
            </div>
        );
    }

    const formatPercentage = (value) => {
        if (value === undefined || value === null || Number.isNaN(Number(value))) return "0.00";
        return Number(value).toFixed(2);
    };

    const getTownHallImage = (level) => (level ? `/th${level}.png` : null);

    const parseWarDate = (raw) => new Date(
        raw.slice(0, 4),
        parseInt(raw.slice(4, 6)) - 1,
        raw.slice(6, 8),
        raw.slice(9, 11),
        raw.slice(11, 13),
        raw.slice(13, 15)
    );

    const startTime = parseWarDate(war.startTime);
    const endTime = parseWarDate(war.endTime);

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

    const getMirrorTag = (member) => {
        const mirrorOpponent = war.opponent.members.find(
            (opponentMember) => opponentMember.mapPosition === member.mapPosition
        );
        return mirrorOpponent ? mirrorOpponent.tag : null;
    };

    // Único criterio de "atacó a su espejo", usado tanto en la nota visible de cada
    // tarjeta como en la lista de sanciones, para que ambos siempre coincidan.
    const attackedOwnMirror = (member) => {
        const mirrorTag = getMirrorTag(member);
        if (!mirrorTag) return false;
        return (member.attacks || []).some((a) => a.defenderTag === mirrorTag);
    };

    // Verde: usó todos sus ataques con buen resultado · Amarillo: le quedan ataques o resultado flojo · Rojo: sin atacar
    const getMemberRating = (member) => {
        const attacks = member.attacks || [];
        if (attacks.length === 0) return "low";
        const totalStars = attacks.reduce((sum, a) => sum + a.stars, 0);
        if (attacks.length < war.attacksPerMember) return "mid";
        const avgStars = totalStars / attacks.length;
        if (avgStars >= 2.5) return "high";
        if (avgStars >= 1) return "mid";
        return "low";
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

        const lines = [
            "⚔️😡 *SANCIONES DE GUERRA* 😡⚔️",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "",
        ];

        if (isPerfectWar) {
            lines.push("🎉 ¡GUERRA PERFECTA! No hay sanciones.");
        } else {
            const faultLines = [];

            war.clan.members.forEach((member) => {
                const faults = [];

                if (!member.attacks || member.attacks.length === 0) {
                    faults.push("No realizó ningún ataque (EXPULSIÓN)");
                } else {
                    if (!attackedOwnMirror(member)) {
                        faults.push("No atacó a su espejo (1 GUERRA DE SANCIÓN)");
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
                lines.push(faultLines.join("\n\n"));
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

    // ---- Estadísticas comparativas ----
    const maxPossibleStars = war.teamSize * 3;

    const bestAttacker = (war.clan.members || []).reduce((best, member) => {
        const stars = (member.attacks || []).reduce((sum, a) => sum + a.stars, 0);
        if (stars === 0) return best;
        if (!best || stars > best.stars) {
            return { name: member.name, stars, attacksCount: (member.attacks || []).length };
        }
        return best;
    }, null);

    return (
        <div className="war-container">

            <h1 className="current-war-title">
                <span className="current-war-title-text">Guerra Actual</span>
            </h1>

            <div className="details">

                {/* ---------- Panel de batalla ---------- */}
                <div className="war-battle-card">

                    <div className="war-battle-timer">
                        {war.state === "inWar" ? (
                            <>
                                <span className="war-battle-timer-label">⏱️ Termina en</span>
                                <span className="war-battle-timer-value">{formatTimeRemaining(endTime)}</span>
                            </>
                        ) : (
                            <>
                                <span className="war-battle-timer-label">⏳ Comienza en</span>
                                <span className="war-battle-timer-value">{formatTimeRemaining(startTime)}</span>
                            </>
                        )}
                    </div>

                    {war.battleModifier && war.battleModifier !== "none" && (
                        <span className="war-battle-modifier-badge">⚡ Modificador: {war.battleModifier}</span>
                    )}

                    <div className="war-battle-vs-row">

                        <div className="war-battle-emblem war-battle-emblem--own">
                            <img src={war.clan.badgeUrls.large} alt="Escudo del clan" className="war-battle-badge war-battle-badge--own" />
                            <span className="war-battle-clan-name">{war.clan.name}</span>
                            <span className="war-side-level">Nivel {war.clan.clanLevel}</span>
                        </div>

                        <span className="war-battle-vs">VS</span>

                        <div className="war-battle-emblem war-battle-emblem--opponent">
                            <img src={war.opponent.badgeUrls.large} alt="Escudo del oponente" className="war-battle-badge" />
                            <span className="war-battle-clan-name">{war.opponent.name}</span>
                            <span className="war-side-level">Nivel {war.opponent.clanLevel}</span>
                        </div>

                    </div>

                    <div className="war-battle-stats-row">

                        <div className="war-side-stats">
                            <div className="war-side-stars">
                                <img src="https://imgur.com/J82orxp.jpg" alt="Estrella" className="war-side-star-img" />
                                <strong>{war.clan.stars}</strong>
                            </div>
                            <span className="war-side-stat">Ataques: {war.clan.attacks}/{war.attacksPerMember * war.teamSize}</span>
                            <span className="war-side-stat">Destrucción: {formatPercentage(war.clan.destructionPercentage)}%</span>
                        </div>

                        <div className="war-side-stats">
                            <div className="war-side-stars">
                                <img src="https://imgur.com/J82orxp.jpg" alt="Estrella" className="war-side-star-img" />
                                <strong>{war.opponent.stars}</strong>
                            </div>
                            <span className="war-side-stat">Ataques: {war.opponent.attacks}/{war.attacksPerMember * war.teamSize}</span>
                            <span className="war-side-stat">Destrucción: {formatPercentage(war.opponent.destructionPercentage)}%</span>
                        </div>

                    </div>
                </div>

                {/* ---------- Acciones (colores sin modificar) ---------- */}
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

                {/* ---------- Comparativa ---------- */}
                <div className="war-stats-section">
                    <h3 className="war-section-title">📊 Comparativa</h3>

                    <div className="war-compare-block">
                        <p className="war-compare-block-title">⭐ Estrellas</p>
                        <div className="war-bar-row">
                            <span className="war-bar-label">{war.clan.name}</span>
                            <div className="war-bar-track">
                                <div
                                    className="war-bar-fill war-bar-fill--own"
                                    style={{ width: `${(war.clan.stars / maxPossibleStars) * 100}%` }}
                                />
                            </div>
                            <span className="war-bar-value">{war.clan.stars}</span>
                        </div>
                        <div className="war-bar-row">
                            <span className="war-bar-label">{war.opponent.name}</span>
                            <div className="war-bar-track">
                                <div
                                    className="war-bar-fill war-bar-fill--opponent"
                                    style={{ width: `${(war.opponent.stars / maxPossibleStars) * 100}%` }}
                                />
                            </div>
                            <span className="war-bar-value">{war.opponent.stars}</span>
                        </div>
                    </div>

                    <div className="war-compare-block">
                        <p className="war-compare-block-title">💥 Destrucción</p>
                        <div className="war-bar-row">
                            <span className="war-bar-label">{war.clan.name}</span>
                            <div className="war-bar-track">
                                <div
                                    className="war-bar-fill war-bar-fill--own"
                                    style={{ width: `${war.clan.destructionPercentage}%` }}
                                />
                            </div>
                            <span className="war-bar-value">{formatPercentage(war.clan.destructionPercentage)}%</span>
                        </div>
                        <div className="war-bar-row">
                            <span className="war-bar-label">{war.opponent.name}</span>
                            <div className="war-bar-track">
                                <div
                                    className="war-bar-fill war-bar-fill--opponent"
                                    style={{ width: `${war.opponent.destructionPercentage}%` }}
                                />
                            </div>
                            <span className="war-bar-value">{formatPercentage(war.opponent.destructionPercentage)}%</span>
                        </div>
                    </div>

                    {bestAttacker && (
                        <p className="war-best-attacker">
                            🏅 Mejor atacante de la guerra: <strong>{bestAttacker.name}</strong> ({bestAttacker.stars}⭐ en {bestAttacker.attacksCount} ataque{bestAttacker.attacksCount !== 1 ? "s" : ""})
                        </p>
                    )}
                </div>

                {/* ---------- Jugadores ---------- */}
                <h3 className="war-section-title">⚔️ Jugadores</h3>
                <div className="participants">
                {war.clan.members && war.clan.members
                    .slice()
                    .sort((a, b) => a.mapPosition - b.mapPosition)
                    .map((member, index) => (

                        <div key={index} className={`participant-card cw-rating-${getMemberRating(member)}`}>

                            <div className="participant-card-header">

                                <img src={war.clan.badgeUrls.small} alt="Clan Badge" className="participant-card-badge" />

                                <h4 className="participant-card-name">{member.name}</h4>

                                {getTownHallImage(member.townhallLevel) && (
                                    <img
                                        src={getTownHallImage(member.townhallLevel)}
                                        alt="Ayuntamiento"
                                        className="th-img"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                )}
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
                                                <img key={i} src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img star-img--glow" />
                                            ))}
                                        </div>

                                        <div className="attack-card-child-3">
                                            <p className="attack-card-child-3-destruccion"><strong>Destrucción:</strong> {formatPercentage(attack.destructionPercentage)}%</p>

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
                                {member.attacks && member.attacks.length > 0 && (
                                    <p className="attack-card-child-4-p">
                                        {attackedOwnMirror(member) ? "✅ El jugador ha atacado a su espejo." : "❌ El jugador no ha atacado a su espejo."}
                                    </p>
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
