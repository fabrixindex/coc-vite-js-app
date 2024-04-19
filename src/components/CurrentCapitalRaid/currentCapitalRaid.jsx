import React from "react";
import "./currentCapitalRaid.css";

export function CurrentCapitalRaid(props) {
    return (
        <li className="capital-raid-list-item">
            <p>{props.number}. {props.attacks === 6 ? <span className="green-circle">🟢</span> : <span className="red-circle">🔴</span>} {props.name} ➡ {props.attacks} de 6 ataques</p>
        </li>    
    );
};
