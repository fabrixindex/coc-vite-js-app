import React, { useState } from "react";
import { CurrentCapitalRaid } from "../CurrentCapitalRaid/currentCapitalRaid.jsx";
import "./currentCapitalRaidList.css";

export default function CurrentCapitalRaidList({ members, startTime, endTime }) {
    
    let [counter, setCounter] = useState(1);

    // Formatear las fechas de comienzo y finalización
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

    return (
        <div>
            <h2 className="capital-raid-list-header">☁⚔ CAPITAL DEL CLAN ⚔☁</h2>
        
            <p className="capital-raid-list">✔📆 Fecha de comienzo del asalto: {formattedStartTime}</p>
            <p className="capital-raid-list">❗📆 Fecha de finalización del asalto: {formattedEndTime}</p>

            <p className="capital-raid-list">🏰🔥 Asaltos de la capital - Jugadores del clan:</p> 
            <ol className="capital-raid-list-number">
                {members.map((member) => (
                    <CurrentCapitalRaid
                        key={member.tag}
                        name={member.name}
                        tag={member.tag}
                        attacks={member.attacks}
                        number={counter++}
                    />
                ))}
            </ol>
        </div>
    );
};
