import React, { useState, useEffect } from "react";
import { getLocationClanRankingArg } from "../../Services/ConnectAPI.js";
import "./RankingClanArg.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function RankingClanArg() {
    const [ranking, setInfo] = useState(null);
    const [visibleClans, setVisibleClans] = useState(5);

    useEffect(() => {
        async function fetchRankingData() {
            try {
                const response = await getLocationClanRankingArg();
                setInfo(response.items);
            } catch (error) {
                console.error('Error fetching CLAN:', error);
            }
        }

        fetchRankingData();
    }, []);

    if (!ranking) {
        return <div className="ranking-loading">Cargando ranking...</div>;
    }

    const handleShowMore = () => setVisibleClans((prev) => prev + 5);
    const handleShowLess = () => setVisibleClans((prev) => Math.max(5, prev - 5));

    return (
        <div className="clan-ranking-list">
            {ranking.slice(0, visibleClans).map((clan, index) => {
                const isOwnClan = clan.name === "Los Magios";

                return (
                    <div
                        key={clan.tag}
                        className={`clan-ranking-row${isOwnClan ? " clan-ranking-row--own" : ""}`}
                    >
                        <span className="clan-ranking-rank">{MEDALS[index] || `${index + 1}°`}</span>

                        <img src={clan.badgeUrls.medium} alt="Escudo del clan" className="clan-ranking-badge" />

                        <span className="clan-ranking-name">{clan.name}</span>

                        <span className="clan-ranking-points">
                            <img src="/trophy.png" alt="trofeo" className="clan-ranking-trophy" />
                            {clan.clanPoints.toLocaleString()}
                        </span>
                    </div>
                );
            })}

            <div className="ranking-buttons">
                {ranking.length > visibleClans && (
                    <button onClick={handleShowMore} className="ranking-btn ranking-btn--more-clan">Ver más</button>
                )}
                {visibleClans > 5 && (
                    <button onClick={handleShowLess} className="ranking-btn ranking-btn--less-clan">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingClanArg;
