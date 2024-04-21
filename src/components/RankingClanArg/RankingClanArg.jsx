import React, { useState, useEffect } from "react";
import { getLocationClanRankingArg } from "../../Services/ConnectAPI.js";
import "./RankingClanArg.css";

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
        return <div>Loading...</div>;
    }

    const handleShowMore = () => {
        setVisibleClans((prev) => prev + 5);
    };

    const handleShowLess = () => {
        setVisibleClans((prev) => prev - 5);
    };

    return (
        <div className="full-container">
            <table className="clan-ranking-table">
            <thead>
                    <tr style={{borderBottom:"2px solid white"}}>
                        <th colSpan="3" className="top-clanes-argentina">TOP CLANES ARGENTINA</th>
                    </tr>

                    <tr style={{borderBottom:"2px solid white"}}>
                        <th>N°</th>
                        <th>Clan</th>
                        <th>Puntos</th>
                    </tr>
            </thead>
            <tbody>
                {ranking.slice(0, visibleClans).map((clan, index) => (
                    <tr key={index} id={clan.name === "Los Magios" ? "golden-background" : ""}>
                        <td>{index + 1}.</td>
                        <td>
                            <div className="table-rank-arg-conainer-2">
                                <img src={clan.badgeUrls.medium} alt="Clan Badge" />
                                <p>{clan.name}</p>
                            </div>
                        </td>
                        <td>
                            <div className="table-rank-arg-conainer-3">
                                <p className="table-rank-arg-conainer-3-points">{clan.clanPoints}</p>
                                <img src="../public/trophy.png" alt="league" className="trophy-img" />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>

            <div className="btn-show-more-less-container">
                {ranking.length > visibleClans && (
                    <button onClick={handleShowMore} className="show-more-btn">Ver más</button>
                )}
                {visibleClans > 5 && (
                    <button onClick={handleShowLess} className="show-less-btn">Ver menos</button>
                )}
            </div>
        </div>
    );
}

export default RankingClanArg;
