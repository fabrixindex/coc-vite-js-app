import React, { useState, useEffect } from "react";
import { getPlayersRankingMex } from "../../Services/ConnectAPI.js";
import "./RankingPlayerMx.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function RankingPlayerMx() {
    const [ranking, setInfo] = useState(null);
    const [visiblePlayersMex, setVisiblePlayersMex] = useState(5);

    useEffect(() => {
        async function fetchRankingData() {
            try {
                const response = await getPlayersRankingMex();
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

    const handleShowMore = () => setVisiblePlayersMex((prev) => Math.min(prev + 5, ranking.length));
    const handleShowLess = () => setVisiblePlayersMex((prev) => Math.max(prev - 5, 5));

    return (
        <div className="player-ranking-list-mx">
            {ranking.slice(0, visiblePlayersMex).map((player, index) => (
                <div key={player.tag} className="player-ranking-row-mx">
                    <span className="player-ranking-rank-mx">{MEDALS[index] || `${index + 1}°`}</span>

                    <img
                        src={player.leagueTier?.iconUrls?.small || player.league?.iconUrls?.medium}
                        alt="Liga"
                        className="player-ranking-league-icon-mx"
                    />

                    <span className="player-ranking-name-mx">{player.name}</span>

                    <span className="player-ranking-trophies-mx">
                        <img src="/trophy.png" alt="trofeo" className="player-ranking-trophy-icon-mx" />
                        {player.trophies.toLocaleString()}
                    </span>
                </div>
            ))}

            <div className="ranking-buttons">
                {ranking.length > visiblePlayersMex && (
                    <button onClick={handleShowMore} className="ranking-btn ranking-btn--more-mx">Ver más</button>
                )}
                {visiblePlayersMex > 5 && (
                    <button onClick={handleShowLess} className="ranking-btn ranking-btn--less-mx">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingPlayerMx;
