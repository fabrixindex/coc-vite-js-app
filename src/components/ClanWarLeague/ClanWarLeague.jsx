import React, { useState, useEffect } from "react";
import { getWarLeagueGroup, getWarLeagueWar } from "../../Services/ConnectAPI.js";
import Loader from "../Loader/Loader.jsx";
import "../CurrentWar/CurrentWar.css";
import "./ClanWarLeague.css";

const OWN_CLAN_TAG = "#29Q92YL9Y"; // Los Magios

// Caracteres invisibles que usa WhatsApp al exportar menciones (@⁨Nombre⁩)
const MENTION_OPEN = "\u2068";
const MENTION_CLOSE = "\u2069";

const RANK_EMOJIS = ["👑1️⃣👑", "🗡️2️⃣🗡️", "👏🏻3️⃣👏🏻", "💪🏻4️⃣💪🏻", "✨5️⃣✨"];
const KEYCAP_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const ORDINALS = ["PRIMER", "SEGUNDO", "TERCER", "CUARTO", "QUINTO", "SEXTO", "SÉPTIMO", "OCTAVO"];

function ClanWarLeague() {
    const [group, setGroup] = useState(null);
    const [roundsData, setRoundsData] = useState([]); // [{ roundNumber, war }]
    const [currentRoundNumber, setCurrentRoundNumber] = useState(null);
    const [selectedRound, setSelectedRound] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState({ open: false, title: "", content: "" });
    const [copied, setCopied] = useState(false);

    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [swapOutSelected, setSwapOutSelected] = useState(new Set());
    const [swapInSelected, setSwapInSelected] = useState(new Set());

    const [topPlayersModalOpen, setTopPlayersModalOpen] = useState(false);
    const [topPlayersSelected, setTopPlayersSelected] = useState([]);

    const [bonusModalOpen, setBonusModalOpen] = useState(false);
    const [bonusSelected, setBonusSelected] = useState([]);

    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [resultPlacement, setResultPlacement] = useState(1);

    useEffect(() => {
        async function fetchAll() {
            try {
                const groupData = await getWarLeagueGroup();
                setGroup(groupData);

                if (!groupData || !groupData.rounds) {
                    setLoading(false);
                    return;
                }

                const results = await Promise.all(
                    groupData.rounds.map(async (round, idx) => {
                        const roundNumber = idx + 1;
                        const validTags = (round.warTags || []).filter((t) => t && t !== "#0");

                        const settled = await Promise.allSettled(
                            validTags.map((tag) => getWarLeagueWar(tag))
                        );

                        const match = settled.find(
                            (r) =>
                                r.status === "fulfilled" &&
                                (r.value?.clan?.tag === OWN_CLAN_TAG || r.value?.opponent?.tag === OWN_CLAN_TAG)
                        );

                        if (!match) return { roundNumber, war: null };

                        const warData = match.value;
                        const normalized = warData.opponent.tag === OWN_CLAN_TAG
                            ? { ...warData, clan: warData.opponent, opponent: warData.clan }
                            : warData;

                        return { roundNumber, war: normalized };
                    })
                );

                const valid = results.filter((r) => r.war !== null);
                setRoundsData(valid);

                let current = valid.find((r) => r.war.state !== "warEnded");
                if (!current && valid.length > 0) {
                    current = valid[valid.length - 1];
                }

                if (current) {
                    setCurrentRoundNumber(current.roundNumber);
                    setSelectedRound(current.roundNumber);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching CWL data:', error);
                setLoading(false);
            }
        }

        fetchAll();

        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (roundsData.length === 0 || !selectedRound) {
        return (
            <div className="war-container">
                <h1 className="cwl-title-main">
                    <span className="cwl-title-main-text">Liga de Guerra de Clanes</span>
                </h1>
                <div className="no-war-message">
                    <p className="no-war-message-text">⚔️ No se encontró ninguna guerra de liga para Los Magios.</p>
                </div>
            </div>
        );
    }

    const war = roundsData.find((r) => r.roundNumber === selectedRound)?.war;

    if (!war) {
        return (
            <div className="war-container">
                <h1 className="cwl-title-main">
                    <span className="cwl-title-main-text">Liga de Guerra de Clanes</span>
                </h1>
                <div className="no-war-message">
                    <p className="no-war-message-text">⚔️ No hay datos para esta ronda.</p>
                </div>
            </div>
        );
    }

    const magiosClanInfo = group?.clans?.find((c) => c.tag === OWN_CLAN_TAG);
    const fullRoster = magiosClanInfo?.members
        ? [...magiosClanInfo.members].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    const isLastRound = group?.rounds?.length === selectedRound;

    const formatPercentage = (value) => {
        if (value === undefined || value === null || Number.isNaN(Number(value))) return "0.00";
        return Number(value).toFixed(2);
    };

    const getTownHallImage = (level) => {
        if (level === 16) return "../public/th16.png";
        if (level === 15) return "../public/th15.png";
        return null;
    };

    // Verde: 3⭐ (100%) · Amarillo: 2⭐ · Rojo: 1⭐ o sin atacar
    const getAttackRating = (member) => {
        const attack = member.attacks && member.attacks[0];
        if (!attack) return "low";
        if (attack.stars === 3) return "high";
        if (attack.stars === 2) return "mid";
        return "low";
    };

    // Para defensas invertimos la lectura: que nos saquen 3⭐ es rojo (mala defensa),
    // 2⭐ amarillo, 0-1⭐ o sin ataque recibido todavía es verde (buena defensa).
    const getDefenseRating = (member) => {
        const defense = member.bestOpponentAttack;
        if (!defense) return "high";
        if (defense.stars >= 3) return "low";
        if (defense.stars === 2) return "mid";
        return "high";
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
        if (!war.clan.members) return;

        const pendingMembers = war.clan.members.filter(
            (member) => !member.attacks || member.attacks.length === 0
        );

        const lines = [
            "⏱️⚔️‼️ *RECORDATORIO* ‼️⚔️⏱️",
            "🔥 *ATAQUE DE LIGA (CWL)*",
            "",
        ];

        if (pendingMembers.length === 0) {
            lines.push("✅ Todos los jugadores ya realizaron su ataque.");
        } else {
            pendingMembers.forEach((member) => lines.push(member.name));
        }

        lines.push(
            "",
            "Recuerden realizar su ataque en la Liga de Guerra de Clanes!!",
            "~~~~~~~~~~~~~~~~~~~~~~",
            "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑",
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
            ganado: "*¡HEMOS GANADO LA GUERRA!* 💪🏼🔥",
            perdido: "*¡HEMOS PERDIDO LA GUERRA!* ☠️😪",
            empatado: "*¡HEMOS EMPATADO LA GUERRA!* 🤝⚡",
        }[result];

        const content = [
            "⚔️ *GUERRA DE CLANES (CWL)* ⚔️",
            "😱💥 *FINALIZADA* 💥😱",
            "",
            resultLine,
            "",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑",
        ].join("\n");

        openModal("Cierre de guerra CWL", content);
    };

    // ---- Cambios de ronda ----

    const outCandidates = war.clan.members
        ? [...war.clan.members].sort((a, b) => {
            const aStars = a.attacks?.[0]?.stars ?? -1;
            const bStars = b.attacks?.[0]?.stars ?? -1;
            if (aStars !== bStars) return aStars - bStars;
            const aDest = a.attacks?.[0]?.destructionPercentage ?? -1;
            const bDest = b.attacks?.[0]?.destructionPercentage ?? -1;
            return aDest - bDest;
        })
        : [];

    const roundMemberTags = new Set((war.clan.members || []).map((m) => m.tag));

    const inCandidates = fullRoster.filter((m) => !roundMemberTags.has(m.tag))
        .sort((a, b) => {
            if (b.townHallLevel !== a.townHallLevel) return b.townHallLevel - a.townHallLevel;
            return a.name.localeCompare(b.name);
        });

    const toggleOutSelection = (tag) => {
        setSwapOutSelected((prev) => {
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag); else next.add(tag);
            return next;
        });
    };

    const toggleInSelection = (tag) => {
        setSwapInSelected((prev) => {
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag); else next.add(tag);
            return next;
        });
    };

    const openSwapModal = () => {
        setSwapOutSelected(new Set());
        setSwapInSelected(new Set());
        setSwapModalOpen(true);
    };

    const closeSwapModal = () => setSwapModalOpen(false);

    const handleGenerateSwapTemplate = () => {
        const outNames = outCandidates.filter((m) => swapOutSelected.has(m.tag)).map((m) => m.name);
        const inNames = inCandidates.filter((m) => swapInSelected.has(m.tag)).map((m) => m.name);
        const nextRound = selectedRound + 1;

        const lines = [
            `🔄 *CAMBIOS PARA LA RONDA NÚMERO ${nextRound}* 🔄`,
            "",
            "⛔😔 *SALEN* 😔⛔",
            "",
        ];

        if (outNames.length === 0) {
            lines.push("—");
        } else {
            outNames.forEach((name) => lines.push(`🔴 ${name}`));
        }

        lines.push("")

        lines.push("✅🤩 *ENTRAN* 🤩✅",
            "",
        );

        if (inNames.length === 0) {
            lines.push("—");
        } else {
            inNames.forEach((name) => lines.push(`🟢${name}`));
        }

        lines.push("")

        lines.push("~~~~~~~~~~~~~~~~~~~~~~~~", "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑");

        setSwapModalOpen(false);
        openModal("Cambios de ronda", lines.join("\n"));
    };

    // ---- Selección ordenada genérica (mejores jugadores / bonus) ----

    const toggleOrderedSelection = (tag, selected, setSelected, cap) => {
        setSelected((prev) => {
            if (prev.includes(tag)) {
                return prev.filter((t) => t !== tag);
            }
            if (cap && prev.length >= cap) return prev;
            return [...prev, tag];
        });
    };

    const moveSelected = (setSelected, index, direction) => {
        setSelected((prev) => {
            const next = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= next.length) return prev;
            [next[index], next[newIndex]] = [next[newIndex], next[index]];
            return next;
        });
    };

    const buildMention = (name) => `@${MENTION_OPEN}${name} COC${MENTION_CLOSE}`;

    const handleGenerateTopPlayers = () => {
        const lines = ["🌟MEJORES JUGADORES DE LIGA🌟"];
        topPlayersSelected.forEach((tag, index) => {
            const member = fullRoster.find((m) => m.tag === tag);
            if (!member) return;
            lines.push(`${RANK_EMOJIS[index]} ${member.name} ${buildMention(member.name)}`);
        });
        setTopPlayersModalOpen(false);
        openModal("Mejores jugadores de liga", lines.join("\n"));
    };

    const handleGenerateBonus = () => {
        const lines = ["⚔️BONUS DE LIGA DE GUERRA DE CLANES⚔️"];
        bonusSelected.forEach((tag, index) => {
            const member = fullRoster.find((m) => m.tag === tag);
            if (!member) return;
            const emoji = KEYCAP_EMOJIS[index] || `${index + 1}.`;
            lines.push(`${emoji} ${member.name} ${buildMention(member.name)}`);
        });
        setBonusModalOpen(false);
        openModal("Bonus de liga", lines.join("\n"));
    };

    const handleGenerateResult = () => {
        const ordinal = ORDINALS[resultPlacement - 1] || `${resultPlacement}°`;
        const content = [
            "⚔️ *LIGA DE GUERRA DE CLANES* ⚔️",
            "😱💥 *FINALIZADA* 💥😱",
            "",
            `*¡HEMOS OBTENIDO EL ${ordinal} PUESTO* 🏅🌟`,
            "",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑",
        ].join("\n");
        setResultModalOpen(false);
        openModal("Resultado de la liga", content);
    };

    // ---- Estadísticas agregadas de la liga (todas las rondas cargadas) ----

    const playerStatsMap = {};
    roundsData.forEach(({ war: roundWar }) => {
        (roundWar.clan.members || []).forEach((member) => {
            if (!playerStatsMap[member.tag]) {
                playerStatsMap[member.tag] = {
                    tag: member.tag,
                    name: member.name,
                    attacks: 0,
                    starsSum: 0,
                    destructionSum: 0,
                    defenses: 0,
                    starsConcededSum: 0,
                };
            }
            const stat = playerStatsMap[member.tag];
            const attack = member.attacks && member.attacks[0];
            if (attack) {
                stat.attacks += 1;
                stat.starsSum += attack.stars;
                stat.destructionSum += attack.destructionPercentage;
            }
            if (member.bestOpponentAttack) {
                stat.defenses += 1;
                stat.starsConcededSum += member.bestOpponentAttack.stars;
            }
        });
    });

    const playerStatsList = Object.values(playerStatsMap).map((stat) => ({
        ...stat,
        avgStars: stat.attacks > 0 ? stat.starsSum / stat.attacks : 0,
        avgDestruction: stat.attacks > 0 ? stat.destructionSum / stat.attacks : 0,
        avgConceded: stat.defenses > 0 ? stat.starsConcededSum / stat.defenses : 0,
    }));

    const rosterRankedByStars = fullRoster.map((member) => {
        const stat = playerStatsMap[member.tag];
        return {
            ...member,
            totalStars: stat?.starsSum ?? 0,
            totalDestruction: stat?.destructionSum ?? 0,
            attacksCount: stat?.attacks ?? 0,
        };
    }).sort((a, b) => (b.totalStars - a.totalStars) || (b.totalDestruction - a.totalDestruction));

    const topAttackers = [...playerStatsList]
        .filter((p) => p.attacks > 0)
        .sort((a, b) => (b.avgStars - a.avgStars) || (b.avgDestruction - a.avgDestruction))
        .slice(0, 5);

    const topDefenders = [...playerStatsList]
        .filter((p) => p.defenses > 0)
        .sort((a, b) => a.avgConceded - b.avgConceded)
        .slice(0, 5);

    let wins = 0, losses = 0, draws = 0, totalStars = 0, totalDestructionSum = 0;
    roundsData.forEach(({ war: roundWar }) => {
        totalStars += roundWar.clan.stars;
        totalDestructionSum += roundWar.clan.destructionPercentage;
        if (roundWar.clan.stars > roundWar.opponent.stars) wins += 1;
        else if (roundWar.clan.stars < roundWar.opponent.stars) losses += 1;
        else if (roundWar.clan.destructionPercentage > roundWar.opponent.destructionPercentage) wins += 1;
        else if (roundWar.clan.destructionPercentage < roundWar.opponent.destructionPercentage) losses += 1;
        else draws += 1;
    });
    const avgClanDestruction = roundsData.length > 0 ? totalDestructionSum / roundsData.length : 0;

    const isReminderDisabled = war.state === "warEnded";

    return (
        <div className="war-container">

            <h1 className="cwl-title-main">
                <span className="cwl-title-main-text">Liga de Guerra de Clanes</span>
            </h1>

            <div className="round-selector">
                {roundsData.map(({ roundNumber }) => (
                    <button
                        key={roundNumber}
                        className={
                            "round-pill" +
                            (roundNumber === selectedRound ? " round-pill--active" : "") +
                            (roundNumber === currentRoundNumber ? " round-pill--current" : "")
                        }
                        onClick={() => setSelectedRound(roundNumber)}
                    >
                        Ronda {roundNumber}
                    </button>
                ))}
            </div>

            <div className="war-actions">

                <button
                    className="war-action-button war-action-button--reminder"
                    onClick={handleReminder}
                    disabled={isReminderDisabled}
                    title={isReminderDisabled ? "Esta ronda ya finalizó" : undefined}
                >
                    Enviar recordatorio
                </button>

                <button className="war-action-button war-action-button--closure" onClick={handleWarClosure}>
                    Generar cierre de guerra
                </button>

                {!isLastRound && (
                    <button className="war-action-button war-action-button--swap" onClick={openSwapModal}>
                        Generar cambios de ronda
                    </button>
                )}

                {isLastRound && (
                    <>
                        <button
                            className="war-action-button war-action-button--top-players"
                            onClick={() => {
                                setTopPlayersSelected(rosterRankedByStars.slice(0, 5).map((m) => m.tag));
                                setTopPlayersModalOpen(true);
                            }}
                        >
                            Mejores jugadores de liga
                        </button>

                        <button
                            className="war-action-button war-action-button--bonus"
                            onClick={() => {
                                setBonusSelected(
                                    rosterRankedByStars.filter((m) => m.attacksCount > 0).map((m) => m.tag)
                                );
                                setBonusModalOpen(true);
                            }}
                        >
                            Bonus de liga
                        </button>

                        <button
                            className="war-action-button war-action-button--result"
                            onClick={() => setResultModalOpen(true)}
                        >
                            Resultado de la liga
                        </button>
                    </>
                )}

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
                                <td className="clan-destruction-column">Porcentaje de destrucción: {formatPercentage(war.clan.destructionPercentage)}%</td>
                                <td className="oponent-destruction-column">Porcentaje de destrucción: {formatPercentage(war.opponent.destructionPercentage)}%</td>
                            </tr>
                            <tr>
                                <td className="clan-stars-column"><img src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img-table-clan" /><strong>{war.clan.stars}</strong></td>
                                <td className="clan-oponent-column"><img src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img-table" /><strong>{war.opponent.stars}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="cwl-section-subtitle">⚔️ Ataques</h3>
                <div className="participants">
                {war.clan.members && war.clan.members
                    .slice()
                    .sort((a, b) => a.mapPosition - b.mapPosition)
                    .map((member, index) => (

                        <div key={index} className={`participant-card cwl-rating-${getAttackRating(member)}`}>

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
                                            <p className="attack-card-child-3-destruccion"><strong>Destrucción:</strong> {formatPercentage(attack.destructionPercentage)}%</p>

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

                <h3 className="cwl-section-subtitle">🛡️ Defensas</h3>
                <div className="participants">
                {war.clan.members && war.clan.members
                    .slice()
                    .sort((a, b) => a.mapPosition - b.mapPosition)
                    .map((member, index) => {
                        const defense = member.bestOpponentAttack;
                        const attacker = defense && war.opponent.members?.find((om) => om.tag === defense.attackerTag);

                        return (
                            <div key={index} className={`participant-card cwl-rating-${getDefenseRating(member)}`}>

                                <div className="participant-card-header">

                                    <img src={war.clan.badgeUrls.small} alt="Clan Badge" />

                                    <h4 className="participant-card-name">{member.name}</h4>

                                    {getTownHallImage(member.townhallLevel) && <img src={getTownHallImage(member.townhallLevel)} alt="Town Hall" className="th-img" />}
                                </div>

                                {defense ? (
                                    <div className="attacks">
                                        <div className="attack-card">
                                            <div className="attack-card-child-1">
                                                <img src="https://imgur.com/3AWSRKg.jpg" alt="escudo" className="escudo-img" />
                                                <p className="attack-card-child-1-p"><strong>Defensa:</strong></p>
                                            </div>

                                            <div className="attack-card-child-2-stars">
                                                {Array.from({ length: defense.stars }, (_, i) => (
                                                    <img key={i} src="https://imgur.com/J82orxp.jpg" alt="Star" className="star-img" />
                                                ))}
                                            </div>

                                            <div className="attack-card-child-3">
                                                <p className="attack-card-child-3-destruccion"><strong>Destrucción recibida:</strong> {formatPercentage(defense.destructionPercentage)}%</p>
                                                <p className="attack-card-child-3-oponent">
                                                    <strong>Atacante:</strong> {attacker ? attacker.name : "Desconocido"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="attack-card-child-4-p">🛡️ Sin ataques recibidos todavía.</p>
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>

                <h3 className="cwl-section-subtitle">📊 Estadísticas de la Liga</h3>
                <div className="cwl-stats-section">

                    <div className="cwl-stats-summary">
                        <div className="cwl-stat-box">
                            <span className="cwl-stat-value">{roundsData.length}</span>
                            <span className="cwl-stat-label">Rondas jugadas</span>
                        </div>
                        <div className="cwl-stat-box">
                            <span className="cwl-stat-value">{wins}-{losses}-{draws}</span>
                            <span className="cwl-stat-label">Récord (G-P-E)</span>
                        </div>
                        <div className="cwl-stat-box">
                            <span className="cwl-stat-value">{totalStars}</span>
                            <span className="cwl-stat-label">Estrellas totales</span>
                        </div>
                        <div className="cwl-stat-box">
                            <span className="cwl-stat-value">{formatPercentage(avgClanDestruction)}%</span>
                            <span className="cwl-stat-label">Destrucción promedio</span>
                        </div>
                    </div>

                    <div className="cwl-stats-columns">

                        <div className="cwl-stats-column">
                            <h4 className="cwl-stats-column-title">🗡️ Mejores atacantes</h4>
                            {topAttackers.length === 0 && <p className="swap-list-empty">Todavía no hay ataques registrados.</p>}
                            {topAttackers.map((player) => (
                                <div key={player.tag} className="cwl-bar-row">
                                    <span className="cwl-bar-label">{player.name}</span>
                                    <div className="cwl-bar-track">
                                        <div
                                            className="cwl-bar-fill cwl-bar-fill--attack"
                                            style={{ width: `${(player.avgStars / 3) * 100}%` }}
                                        />
                                    </div>
                                    <span className="cwl-bar-value">{player.avgStars.toFixed(1)}⭐ · {player.avgDestruction.toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="cwl-stats-column">
                            <h4 className="cwl-stats-column-title">🛡️ Mejores defensores</h4>
                            {topDefenders.length === 0 && <p className="swap-list-empty">Todavía no hay defensas registradas.</p>}
                            {topDefenders.map((player) => (
                                <div key={player.tag} className="cwl-bar-row">
                                    <span className="cwl-bar-label">{player.name}</span>
                                    <div className="cwl-bar-track">
                                        <div
                                            className="cwl-bar-fill cwl-bar-fill--defense"
                                            style={{ width: `${100 - (player.avgConceded / 3) * 100}%` }}
                                        />
                                    </div>
                                    <span className="cwl-bar-value">{player.avgConceded.toFixed(1)}⭐ recibidas</span>
                                </div>
                            ))}
                        </div>

                    </div>
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

            {swapModalOpen && (
                <div className="modal-overlay" onClick={closeSwapModal}>
                    <div className="modal-box swap-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Cambios para la Ronda {selectedRound + 1}</h3>
                            <button className="modal-close-button" onClick={closeSwapModal}>✕</button>
                        </div>

                        <p className="swap-modal-hint">
                            Según el rendimiento en la Ronda {selectedRound} (peor a mejor), elegí quién sale y quién entra.
                        </p>

                        <div className="swap-modal-columns">

                            <div className="swap-column">
                                <h4 className="swap-column-title swap-column-title--out">🔴 Salen</h4>
                                <div className="swap-list">
                                    {outCandidates.map((member) => {
                                        const attack = member.attacks && member.attacks[0];
                                        return (
                                            <label key={member.tag} className="swap-list-item">
                                                <input
                                                    type="checkbox"
                                                    checked={swapOutSelected.has(member.tag)}
                                                    onChange={() => toggleOutSelection(member.tag)}
                                                />
                                                <span className="swap-list-item-name">{member.name}</span>
                                                <span className="swap-list-item-meta">
                                                    {attack
                                                        ? `${attack.stars}⭐ / ${formatPercentage(attack.destructionPercentage)}%`
                                                        : "Sin atacar"}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="swap-column">
                                <h4 className="swap-column-title swap-column-title--in">🟢 Entran</h4>
                                <div className="swap-list">
                                    {inCandidates.length === 0 && (
                                        <p className="swap-list-empty">No hay jugadores disponibles fuera de la ronda.</p>
                                    )}
                                    {inCandidates.map((member) => (
                                        <label key={member.tag} className="swap-list-item">
                                            <input
                                                type="checkbox"
                                                checked={swapInSelected.has(member.tag)}
                                                onChange={() => toggleInSelection(member.tag)}
                                            />
                                            <span className="swap-list-item-name">{member.name}</span>
                                            <span className="swap-list-item-meta">TH{member.townHallLevel}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button
                                className="war-action-button war-action-button--swap"
                                onClick={handleGenerateSwapTemplate}
                                disabled={swapOutSelected.size === 0 && swapInSelected.size === 0}
                            >
                                Generar plantilla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {topPlayersModalOpen && (
                <div className="modal-overlay" onClick={() => setTopPlayersModalOpen(false)}>
                    <div className="modal-box swap-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Mejores jugadores de liga</h3>
                            <button className="modal-close-button" onClick={() => setTopPlayersModalOpen(false)}>✕</button>
                        </div>

                        <p className="swap-modal-hint">Elegí hasta 5 jugadores, en orden del 1° al 5° puesto.</p>

                        {topPlayersSelected.length > 0 && (
                            <div className="selected-chips">
                                {topPlayersSelected.map((tag, index) => {
                                    const member = fullRoster.find((m) => m.tag === tag);
                                    if (!member) return null;
                                    return (
                                        <div key={tag} className="selected-chip">
                                            <span className="selected-chip-rank">{RANK_EMOJIS[index]}</span>
                                            <span className="selected-chip-name">{member.name}</span>
                                            <button className="selected-chip-move" onClick={() => moveSelected(setTopPlayersSelected, index, -1)}>↑</button>
                                            <button className="selected-chip-move" onClick={() => moveSelected(setTopPlayersSelected, index, 1)}>↓</button>
                                            <button
                                                className="selected-chip-remove"
                                                onClick={() => toggleOrderedSelection(tag, topPlayersSelected, setTopPlayersSelected, 5)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="swap-list">
                            {rosterRankedByStars.map((member) => (
                                <label key={member.tag} className="swap-list-item">
                                    <input
                                        type="checkbox"
                                        checked={topPlayersSelected.includes(member.tag)}
                                        disabled={!topPlayersSelected.includes(member.tag) && topPlayersSelected.length >= 5}
                                        onChange={() => toggleOrderedSelection(member.tag, topPlayersSelected, setTopPlayersSelected, 5)}
                                    />
                                    <span className="swap-list-item-name">{member.name}</span>
                                    <span className="swap-list-item-meta">⭐ {member.totalStars} en la liga</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="war-action-button war-action-button--top-players"
                                onClick={handleGenerateTopPlayers}
                                disabled={topPlayersSelected.length === 0}
                            >
                                Generar plantilla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {bonusModalOpen && (
                <div className="modal-overlay" onClick={() => setBonusModalOpen(false)}>
                    <div className="modal-box swap-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Bonus de liga</h3>
                            <button className="modal-close-button" onClick={() => setBonusModalOpen(false)}>✕</button>
                        </div>

                        <p className="swap-modal-hint">Elegí, en orden, a los jugadores que reciben el bono de liga.</p>

                        {bonusSelected.length > 0 && (
                            <div className="selected-chips">
                                {bonusSelected.map((tag, index) => {
                                    const member = fullRoster.find((m) => m.tag === tag);
                                    if (!member) return null;
                                    return (
                                        <div key={tag} className="selected-chip">
                                            <span className="selected-chip-rank">{KEYCAP_EMOJIS[index] || `${index + 1}.`}</span>
                                            <span className="selected-chip-name">{member.name}</span>
                                            <button className="selected-chip-move" onClick={() => moveSelected(setBonusSelected, index, -1)}>↑</button>
                                            <button className="selected-chip-move" onClick={() => moveSelected(setBonusSelected, index, 1)}>↓</button>
                                            <button
                                                className="selected-chip-remove"
                                                onClick={() => toggleOrderedSelection(tag, bonusSelected, setBonusSelected, null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="swap-list">
                            {rosterRankedByStars.map((member) => (
                                <label key={member.tag} className="swap-list-item">
                                    <input
                                        type="checkbox"
                                        checked={bonusSelected.includes(member.tag)}
                                        onChange={() => toggleOrderedSelection(member.tag, bonusSelected, setBonusSelected, null)}
                                    />
                                    <span className="swap-list-item-name">{member.name}</span>
                                    <span className="swap-list-item-meta">⭐ {member.totalStars} en la liga</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="war-action-button war-action-button--bonus"
                                onClick={handleGenerateBonus}
                                disabled={bonusSelected.length === 0}
                            >
                                Generar plantilla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {resultModalOpen && (
                <div className="modal-overlay" onClick={() => setResultModalOpen(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Resultado de la liga</h3>
                            <button className="modal-close-button" onClick={() => setResultModalOpen(false)}>✕</button>
                        </div>

                        <p className="swap-modal-hint">¿Qué puesto obtuvo el clan en la liga?</p>

                        <select
                            className="result-select"
                            value={resultPlacement}
                            onChange={(e) => setResultPlacement(Number(e.target.value))}
                        >
                            {ORDINALS.map((word, index) => (
                                <option key={word} value={index + 1}>{index + 1}° puesto — {word}</option>
                            ))}
                        </select>

                        <div className="modal-footer">
                            <button className="war-action-button war-action-button--result" onClick={handleGenerateResult}>
                                Generar mensaje
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ClanWarLeague;
