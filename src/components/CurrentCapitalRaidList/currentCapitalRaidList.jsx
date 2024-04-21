import React, { useState } from "react";
import { CurrentCapitalRaid } from "../CurrentCapitalRaid/currentCapitalRaid.jsx";
import "./currentCapitalRaidList.css";

export default function CurrentCapitalRaidList({ members, startTime, endTime }) {
    
    let [counter, setCounter] = useState(1);
    let [visibleItems, setVisibleItems] = useState(10); 
    const [copied, setCopied] = useState(false);  

    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}-${month}-${year}`;
    }

    const handleCopy = () => {
        const formattedList = `
☁⚔ *CAPITAL DEL CLAN* ⚔☁

✔📆 Fecha de comienzo del asalto: *${formattedStartTime}*

❗📆 Fecha de finalización del asalto: *${formattedEndTime}*

🏰🔥 Asaltos de la capital - Jugadores del clan:

${members.map((member, index) => `${index + 1}. ${member.attacks === 6 ? '🟢' : '🔴'} ${member.name} ➡ ${member.attacks} de 6 ataques`).join("\n\n")}
        `;
        navigator.clipboard.writeText(formattedList);
        setCopied(true);
    
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    };

    const handleShowMore = () => {
        setVisibleItems(visibleItems + 10); 
    };

    const handleShowLess = () => {
        setVisibleItems(Math.max(10, visibleItems - 10)); 
    };

    return (
        <>
            <div className="rules-container">
                <h1 className="rule-title">Nuestras Reglas En La Capital Del Clan</h1>
                <div className="rule-item">
                    <span role="img" aria-label="checkmark">✔</span>
                    <p className="rule-p">Todos los jugadores del clan deben realizar sus asaltos de fin de semana en la Capital del Clan.</p>
                </div>
                <div className="rule-item">
                    <span role="img" aria-label="warning">❗</span>
                    <p className="rule-p">A lo largo del mes los jugadores del Clan solo podrán ausentarse en 1 asalto.</p>
                </div>
            </div>

            <div className="capital-raid-list-container">
                <h2 className="capital-raid-list-header">☁⚔ CAPITAL DEL CLAN ⚔☁</h2>

                <div className="capital-raid-list-dates">
                    <p className="capital-raid-list-p1">✔📆 Fecha de comienzo del asalto: {formattedStartTime}</p>
                    <p className="capital-raid-list-p2">❗📆 Fecha de finalización del asalto: {formattedEndTime}</p>
                </div>

                <p className="capital-raid-list-p3">🏰🔥 Asaltos de la capital - Jugadores del clan:</p> 
                <ol className="capital-raid-list-number">
                    {members.slice(0, visibleItems).map((member) => (
                        <CurrentCapitalRaid
                            key={member.tag}
                            name={member.name}
                            tag={member.tag}
                            attacks={member.attacks}
                            number={counter++}
                        />
                    ))}
                </ol>

                <div className="button-container">
                    {visibleItems < members.length && (
                        <button onClick={handleShowMore} className="btn-show-more">Ver más</button>
                    )}
                    {visibleItems > 10 && (
                        <button onClick={handleShowLess} className="btn-show-less">Ver menos</button>
                    )}
                </div>


                <button onClick={handleCopy} className="btn-copy-current-capital-raid">{copied ? "¡Copiado!" : "Copiar Lista"}</button>
            </div>
        </>
    );
};
