import React, { useState } from "react";
import { CurrentCapitalRaid } from "../CurrentCapitalRaid/currentCapitalRaid.jsx";
import "./currentCapitalRaidList.css";

export default function CurrentCapitalRaidList({ members, startTime, endTime }) {
    const [visibleItems, setVisibleItems] = useState(10);
    const [copied, setCopied] = useState(false);

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}-${month}-${year}`;
    }

    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);

    // Los que menos atacaron aparecen primero: es lo que la cúpula necesita ver de un vistazo.
    const sortedMembers = [...members].sort(
        (a, b) => (Number(a.attacks) || 0) - (Number(b.attacks) || 0)
    );

    const totalMembers = members.length;
    const completed = members.filter((m) => Number(m.attacks) === 6).length;
    const absent = members.filter((m) => Number(m.attacks) === 0).length;
    const avgParticipation = totalMembers > 0
        ? (members.reduce((sum, m) => sum + (Number(m.attacks) || 0), 0) / (totalMembers * 6)) * 100
        : 0;

    const handleCopy = () => {
        const lines = [
            "☁⚔ *CAPITAL DEL CLAN* ⚔☁",
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            `📆 Inicio: *${formattedStartTime}*`,
            `🏁 Fin: *${formattedEndTime}*`,
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "🏰🔥 Asaltos de los jugadores:",
            ""
        ];

        sortedMembers.forEach((member, index) => {
            const attacks = Number(member.attacks) || 0;
            const emoji = attacks === 6 ? "🟢" : attacks === 0 ? "🔴" : "🟡";
            lines.push(`${index + 1}. ${emoji} ${member.name} ➡ ${attacks} de 6 ataques`);
        });

        lines.push(
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            `✅ Completaron los 6 ataques: ${completed}`,
            `❌ No atacaron: ${absent}`,
            "~~~~~~~~~~~~~~~~~~~~~~~~",
            "👑🛡️ CÚPULA DEL CLAN 🛡️👑"
        );

        navigator.clipboard.writeText(lines.join("\n")).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    };

    const handleShowMore = () => setVisibleItems((prev) => prev + 10);
    const handleShowLess = () => setVisibleItems((prev) => Math.max(10, prev - 10));

    return (
        <div className="capital-page">

            <div className="capital-raid-list-container">

                <h1 className="capital-raid-list-header">
                    <span className="capital-raid-list-header-text">Capital del Clan</span>
                </h1>

                <div className="capital-raid-dates">
                    <span className="capital-raid-date-pill">📆 Inicio: {formattedStartTime}</span>
                    <span className="capital-raid-date-pill">🏁 Fin: {formattedEndTime}</span>
                </div>

                <div className="capital-raid-summary">
                    <div className="capital-raid-stat">
                        <span className="capital-raid-stat-value">{completed}/{totalMembers}</span>
                        <span className="capital-raid-stat-label">6 de 6 completados</span>
                    </div>
                    <div className="capital-raid-stat">
                        <span className="capital-raid-stat-value">{absent}</span>
                        <span className="capital-raid-stat-label">Sin atacar</span>
                    </div>
                    <div className="capital-raid-stat">
                        <span className="capital-raid-stat-value">%{avgParticipation.toFixed(0)}</span>
                        <span className="capital-raid-stat-label">Participación</span>
                    </div>
                </div>

                <p className="capital-raid-list-subtitle">🏰🔥 Asaltos de la capital — jugadores del clan</p>

                <ol className="capital-raid-list-number">
                    {sortedMembers.slice(0, visibleItems).map((member, index) => (
                        <CurrentCapitalRaid
                            key={member.tag}
                            name={member.name}
                            tag={member.tag}
                            attacks={Number(member.attacks) || 0}
                            number={index + 1}
                        />
                    ))}
                </ol>

                <div className="button-container">
                    {visibleItems < sortedMembers.length && (
                        <button onClick={handleShowMore} className="btn-show-more">Ver más ⬇️</button>
                    )}
                    {visibleItems > 10 && (
                        <button onClick={handleShowLess} className="btn-show-less">Ver menos ⬆️</button>
                    )}
                </div>

                <button onClick={handleCopy} className="btn-copy-current-capital-raid">
                    {copied ? "¡Copiado!" : "Copiar lista"}
                </button>

            </div>
        </div>
    );
}
