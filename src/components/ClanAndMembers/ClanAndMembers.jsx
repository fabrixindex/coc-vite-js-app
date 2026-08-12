import React, { useState, useEffect } from "react";
import { getClanData } from "../../Services/ConnectAPI.js";
import MemberListContainer from "../MemberListContainer/memberListContainer.jsx";
import Loader from "../Loader/Loader.jsx";
import "./ClanAndMembers.css";

const getFlagEmoji = (countryCode) => {
    if (!countryCode) return "🌍";
    return countryCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

const CLAN_TYPE_LABELS = {
    open: "Abierto",
    inviteOnly: "Solo por invitación",
    closed: "Cerrado",
};

function ClanAndMembers() {
    const [loading, setLoading] = useState(true);
    const [clan, setClan] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchClanData() {
            try {
                const response = await getClanData();
                setClan(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching CLAN:', error);
                setLoading(false);
            }
        }

        fetchClanData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!clan) {
        return <div className="clan-hero-error">No se pudo cargar la información del clan.</div>;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(clan.tag).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    };

    const totalWars = (clan.warWins || 0) + (clan.warLosses || 0) + (clan.warTies || 0);
    const winRate = totalWars > 0 ? (clan.warWins / totalWars) * 100 : 0;

    const stats = [
        { label: "Nivel del clan", value: clan.clanLevel },
        { label: "Miembros", value: `${clan.members}/50` },
        { label: "Tipo de clan", value: CLAN_TYPE_LABELS[clan.type] || clan.type },
        { label: "Puntos del clan", value: clan.clanPoints?.toLocaleString() },
        { label: "Puntos de capital", value: clan.clanCapitalPoints?.toLocaleString() },
        { label: "Liga de la capital", value: clan.capitalLeague?.name },
        { label: "Idioma del chat", value: clan.chatLanguage?.name || "—" },
        { label: "TH requerido", value: clan.requiredTownhallLevel },
        { label: "Trofeos requeridos", value: clan.requiredTrophies?.toLocaleString() },
        { label: "Frecuencia de guerra", value: clan.warFrequency },
    ];

    return (
        <div className="clan-page">

            <div className="clan-hero">

                <div className="clan-hero-top">
                    <img src={clan.badgeUrls?.large} alt="Insignia del clan" className="clan-hero-badge" />

                    <div className="clan-hero-titles">
                        <h1 className="clan-hero-name">{clan.name}</h1>
                        <button className="clan-hero-tag" onClick={copyToClipboard}>
                            {copied ? "¡Copiado! ✅" : `${clan.tag} 📋`}
                        </button>
                    </div>
                </div>

                {clan.description && (
                    <p className="clan-hero-description">{clan.description}</p>
                )}

                {clan.labels?.length > 0 && (
                    <div className="clan-hero-labels">
                        {clan.labels.map((label) => (
                            <span key={label.id} className="clan-label-chip">
                                <img src={label.iconUrls?.small} alt={label.name} />
                                {label.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="clan-warleague-row">
                    <span className="clan-warleague-badge">⚔️ {clan.warLeague?.name || "Sin liga de guerra"}</span>
                    {clan.location?.countryCode && (
                        <span className="clan-location-badge">
                            {getFlagEmoji(clan.location.countryCode)} {clan.location.name}
                        </span>
                    )}
                </div>

                <div className="clan-stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.label} className="clan-stat-chip">
                            <span className="clan-stat-chip-label">{stat.label}</span>
                            <span className="clan-stat-chip-value">{stat.value ?? "—"}</span>
                        </div>
                    ))}
                </div>

                <div className="clan-war-record">
                    <div className="clan-war-record-header">
                        <h3 className="clan-war-record-title">🏆 Récord de guerra</h3>
                        <span className="clan-war-record-score">
                            {clan.warWins}-{clan.warLosses}-{clan.warTies}
                        </span>
                    </div>

                    <div className="clan-war-record-bar-track">
                        <div className="clan-war-record-bar-fill" style={{ width: `${winRate}%` }} />
                    </div>

                    <div className="clan-war-record-footer">
                        <span>%{winRate.toFixed(1)} de victorias</span>
                        <span>🔥 Racha actual: {clan.warWinStreak}</span>
                    </div>
                </div>

            </div>

            <MemberListContainer />
        </div>
    );
}

export default ClanAndMembers;
