import React, { useState, useEffect } from "react";
import { fetchClanMembersData } from "../../Services/ConnectAPI.js";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";
import "./CheckDonations.css";

function CheckDonations() {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const response = await fetchClanMembersData();
                setMembers(response.items || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching members:', error);
                setLoading(false);
            }
        }
        fetchMembers();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const getDonationRatio = (member) => {
        const donated = Number(member.donations) || 0;
        const received = Number(member.donationsReceived) || 0;
        if (received === 0) return donated > 0 ? Infinity : 1;
        return donated / received;
    };

    // Verde: dona igual o más de lo que recibe · Amarillo: dona entre 50% y 100% · Rojo: dona menos de la mitad
    const getDonationRating = (member) => {
        const ratio = getDonationRatio(member);
        if (ratio >= 1) return "high";
        if (ratio >= 0.5) return "mid";
        return "low";
    };

    const formatRatioPercent = (member) => {
        const ratio = getDonationRatio(member);
        if (ratio === Infinity) return "—";
        return `${Math.round(ratio * 100)}%`;
    };

    const maxValue = Math.max(
        1,
        ...members.map((m) => Math.max(Number(m.donations) || 0, Number(m.donationsReceived) || 0))
    );

    const sortedMembers = [...members].sort((a, b) => getDonationRatio(a) - getDonationRatio(b));

    const unbalancedDonations = [...members]
        .filter((member) => getDonationRatio(member) < 0.5)
        .sort((a, b) => getDonationRatio(a) - getDonationRatio(b));

    const totalDonated = members.reduce((sum, m) => sum + (Number(m.donations) || 0), 0);
    const totalReceived = members.reduce((sum, m) => sum + (Number(m.donationsReceived) || 0), 0);

    const handleGenerateDonationsList = () => {
        setCopied(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const copyList = () => {
        const lines = ["🔴 *DONACIONES DESEQUILIBRADAS* 🔴", "~~~~~~~~~~~~~~~~~~~~~~~~", ""];

        if (unbalancedDonations.length === 0) {
            lines.push("🎉 *Nadie está desequilibrado.*");
        } else {
            unbalancedDonations.forEach((member, index) => {
                lines.push(`${index + 1}. ${member.name} (${formatRatioPercent(member)} de lo que recibe)`, "");
            });
        }

        lines.push("~~~~~~~~~~~~~~~~~~~~~~~~", "👑🛡️ *CÚPULA DEL CLAN* 🛡️👑");

        navigator.clipboard.writeText(lines.join("\n")).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    };

    return (
        <React.Fragment>

            <div className="donations-page">

                <header className="donations-header">
                    <h1 className="donations-title">
                        <span className="donations-title-text">Equilibrio de Donaciones</span>
                    </h1>
                    <p className="donations-subtitle">Quién sostiene al clan y quién solo recibe.</p>

                    <div className="donations-summary">
                        <div className="donations-stat">
                            <span className="donations-stat-value">{totalDonated.toLocaleString()}</span>
                            <span className="donations-stat-label">Donado por el clan</span>
                        </div>
                        <div className="donations-stat">
                            <span className="donations-stat-value">{totalReceived.toLocaleString()}</span>
                            <span className="donations-stat-label">Recibido por el clan</span>
                        </div>
                        <div className="donations-stat">
                            <span className="donations-stat-value">{unbalancedDonations.length}</span>
                            <span className="donations-stat-label">Desequilibrados</span>
                        </div>
                    </div>

                    <button onClick={handleGenerateDonationsList} className="donations-generate-btn">
                        Generar lista de desequilibrados
                    </button>
                </header>

                {showModal && (
                    <div className="donations-modal-overlay" onClick={closeModal}>
                        <div className="donations-modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="donations-modal-header">
                                <h3 className="donations-modal-title">Donaciones desequilibradas</h3>
                                <button className="donations-modal-close" onClick={closeModal}>✕</button>
                            </div>

                            {unbalancedDonations.length === 0 ? (
                                <p className="donations-modal-empty">🎉 Nadie está desequilibrado. ¡Buen trabajo, clan!</p>
                            ) : (
                                <ul className="donations-modal-list">
                                    {unbalancedDonations.map((member, index) => (
                                        <li key={member.tag} className="donations-modal-item">
                                            <span className="donations-modal-item-rank">{index + 1}</span>
                                            <span className="donations-modal-item-name">{member.name}</span>
                                            <span className="donations-modal-item-ratio">{formatRatioPercent(member)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="donations-modal-footer">
                                <button className="donations-action-button donations-action-button--copy" onClick={copyList}>
                                    {copied ? "¡Copiado!" : "Copiar lista"}
                                </button>
                                <button className="donations-action-button donations-action-button--hide" onClick={closeModal}>
                                    Ocultar lista
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="donations-grid">
                    {sortedMembers.map((member) => {
                        const donated = Number(member.donations) || 0;
                        const received = Number(member.donationsReceived) || 0;
                        const rating = getDonationRating(member);

                        return (
                            <Link
                                to={`/player/%23${member.tag.substring(1)}`}
                                key={member.tag}
                                className={`donation-card donation-card--${rating}`}
                            >
                                <div className="donation-card-header">
                                    <img
                                        src={member.leagueTier?.iconUrls?.small}
                                        alt="League"
                                        className="donation-card-league-icon"
                                    />
                                    <h4 className="donation-card-name">{member.name}</h4>
                                </div>

                                <div className="donation-card-bars">
                                    <div className="donation-bar-row">
                                        <span className="donation-bar-label">Donado</span>
                                        <div className="donation-bar-track">
                                            <div
                                                className="donation-bar-fill donation-bar-fill--given"
                                                style={{ width: `${(donated / maxValue) * 100}%` }}
                                            />
                                        </div>
                                        <span className="donation-bar-value">{donated}</span>
                                    </div>
                                    <div className="donation-bar-row">
                                        <span className="donation-bar-label">Recibido</span>
                                        <div className="donation-bar-track">
                                            <div
                                                className="donation-bar-fill donation-bar-fill--received"
                                                style={{ width: `${(received / maxValue) * 100}%` }}
                                            />
                                        </div>
                                        <span className="donation-bar-value">{received}</span>
                                    </div>
                                </div>

                                <p className="donation-card-ratio">
                                    {getDonationRatio(member) === Infinity
                                        ? "Solo dona 🌟"
                                        : `Dona el ${formatRatioPercent(member)} de lo que recibe`}
                                </p>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </React.Fragment>
    );
}

export default CheckDonations;
