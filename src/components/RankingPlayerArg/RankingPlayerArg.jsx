import React, { useState, useEffect } from "react";
import { getPlayersRankingArg } from "../../Services/ConnectAPI.js";
import "./RankingPlayerArg.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function RankingPlayerArg() {
    const [ranking, setInfo] = useState(null);
    const [visiblePlayers, setVisiblePlayers] = useState(5);

    useEffect(() => {
        async function fetchRankingData() {
            try {
                const response = await getPlayersRankingArg();
                console.log("RESPONSE:", response)
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

    const handleShowMore = () => setVisiblePlayers((prev) => prev + 5);
    const handleShowLess = () => setVisiblePlayers((prev) => Math.max(5, prev - 5));

    return (
        <div className="player-ranking-list">
            {ranking.slice(0, visiblePlayers).map((player, index) => (
                <div key={player.tag} className="player-ranking-row">
                    <span className="player-ranking-rank">{MEDALS[index] || `${index + 1}°`}</span>

                    <img
                        src={player.leagueTier?.iconUrls?.small || player.league?.iconUrls?.medium}
                        alt="Liga"
                        className="player-ranking-league-icon"
                    />

                    <span className="player-ranking-name">{player.name}</span>

                    <span className="player-ranking-trophies">
                        <img src="/trophy.png" alt="trofeo" className="player-ranking-trophy-icon" />
                        {player.trophies.toLocaleString()}
                    </span>
                </div>
            ))}

            <div className="ranking-buttons">
                {ranking.length > visiblePlayers && (
                    <button onClick={handleShowMore} className="ranking-btn ranking-btn--more-arg">Ver más</button>
                )}
                {visiblePlayers > 5 && (
                    <button onClick={handleShowLess} className="ranking-btn ranking-btn--less-arg">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingPlayerArg;
