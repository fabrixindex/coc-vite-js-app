import React, { useState, useEffect } from "react";
import { getPlayersRankingMex } from "../../Services/ConnectAPI.js";
import "./RankingPlayerMx.css"; 

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
        return <div>Loading...</div>;
    }

    const handleShowMore = () => {
        setVisiblePlayersMex((prev) => {
            const nextValue = prev + 5;
            return Math.min(nextValue, ranking.length);
        });
    };
    
    const handleShowLess = () => {
        setVisiblePlayersMex((prev) => {
            const nextValue = prev - 5;
            return Math.max(nextValue, 5); 
        });
    };    

    return (
        <div className="ranking-player-table-mx"> 
            <div className="container-table-mx">
                <table className="player-table-mx"> 
                    <thead>

                        <tr>
                            <th colSpan="3" className="table-title-mx">Ranking Mejores Jugadores de Mexico</th>
                        </tr>

                        <tr>
                            <th className="column-title-mx">N°</th>
                            <th className="column-title-mx">Jugador</th>
                            <th className="column-title-mx">Trofeos</th>
                        </tr>

                    </thead>

                    <tbody>
                        {ranking.slice(0, visiblePlayersMex).map((player, index) => ( 
                            <tr key={index} className="data-row">

                                <td className="table-cell">{index + 1}.</td>

                                <td className="table-cell">
                                    <div className="table-rank-name-league-mx">
                                        <img src={player.league.iconUrls.medium} alt="League Icon" className="league-icon" />
                                        <p className="player-name-mx">{player.name}</p>
                                    </div>
                                </td>

                                <td className="table-cell">
                                    <div className="table-rank-trophy-mx">
                                        <img src="../public/trophy.png" alt="league" className="trophy-icon-mx" />
                                        <p className="trophy-count-mx">{player.trophies}</p>
                                    </div>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="btn-show-more-less-container">
                {ranking.length > visiblePlayersMex && (
                    <button onClick={handleShowMore} className="show-more-btn-py-mx">Ver más</button>
                )}
                {visiblePlayersMex > 5 && (
                    <button onClick={handleShowLess} className="show-less-btn-py-mx">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingPlayerMx;
