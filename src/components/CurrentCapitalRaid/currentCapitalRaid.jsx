import React from "react";
import "./currentCapitalRaid.css";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CurrentCapitalRaid(props) {
    const { number, name, attacks } = props;
    const safeAttacks = Number(attacks) || 0;

    const rating = safeAttacks === 6 ? "high" : safeAttacks === 0 ? "low" : "mid";

    const statusLabel = safeAttacks === 6
        ? "Completó los 6 ataques"
        : safeAttacks === 0
            ? "No atacó esta ronda"
            : `${safeAttacks} de 6 ataques`;

    const progress = Math.min(safeAttacks, 6) / 6;
    const dashOffset = CIRCUMFERENCE * (1 - progress);

    return (
        <li className={`capital-raid-row capital-raid-row--${rating}`}>
            <span className="capital-raid-rank">{number}</span>

            <svg className="capital-medal" viewBox="0 0 44 44" aria-hidden="true">
                <circle className="capital-medal-track" cx="22" cy="22" r={RADIUS} />
                <circle
                    className="capital-medal-fill"
                    cx="22"
                    cy="22"
                    r={RADIUS}
                    transform="rotate(-90 22 22)"
                    style={{
                        strokeDasharray: CIRCUMFERENCE,
                        strokeDashoffset: dashOffset,
                    }}
                />
                <text className="capital-medal-text" x="22" y="27" textAnchor="middle">{safeAttacks}</text>
            </svg>

            <div className="capital-raid-info">
                <span className="capital-raid-name">{name}</span>
                <span className="capital-raid-status">{statusLabel}</span>
            </div>
        </li>
    );
}
