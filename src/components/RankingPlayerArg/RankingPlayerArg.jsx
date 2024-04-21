import React, { useState, useEffect } from "react";
import { getPlayersRankingArg } from "../../Services/ConnectAPI.js";
import "./RankingPlayerArg.css";

function RankingPlayerArg() {
    const [ranking, setInfo] = useState(null);
    const [visiblePlayers, setVisiblePlayers] = useState(5);

    useEffect(() => {
        async function fetchRankingData() {
            try {
                const response = await getPlayersRankingArg();
                setInfo(response.items);
            } catch (error) {
                console.error('Error fetching CLAN:', error);
            }
        }

        fetchRankingData();
    }, []);

    if (!ranking) {
        return <div>Loading...</div>;
    }

    const handleShowMore = () => {
        setVisiblePlayers((prev) => prev + 5);
    };

    const handleShowLess = () => {
        setVisiblePlayers((prev) => prev - 5);
    };

    return (
        <div className="ranking-player-table">
            <table>
                <thead>
                    <tr>
                        <th colSpan="3">Ranking Mejores Jugadores de Argentina</th>
                    </tr>
                    <tr>
                        <th>N°</th>
                        <th>Jugador</th>
                        <th>Trofeos</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.slice(0, visiblePlayers).map((player, index) => (
                        <tr key={index}>
                            <td>{index + 1}.</td>

                            <td>
                                <div className="table-rank-name-league">
                                    <img src={player.league.iconUrls.medium} alt="League Icon" />
                                    <p className="table-rank-p">{player.name}</p>
                                </div>
                            </td>

                            <td>
                                <div className="table-rank-trophy">
                                    <img src="../public/trophy.png" alt="league" className="trophy-img" />
                                    <p className="table-rank-points">{player.trophies}</p>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="btn-show-more-less-container">
                {ranking.length > visiblePlayers && (
                    <button onClick={handleShowMore} className="show-more-btn-py-arg">Ver más</button>
                )}
                {visiblePlayers > 5 && (
                    <button onClick={handleShowLess} className="show-less-btn-py-arg">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingPlayerArg;
