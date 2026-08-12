import React from "react";
import { Link } from "react-router-dom";
import "./member.css";

const ROLE_LABELS = {
    leader: "Líder",
    coLeader: "Co-líder",
    admin: "Veterano",
    member: "Miembro",
};

const ROLE_RATING = {
    leader: "leader",
    coLeader: "coleader",
    admin: "elder",
    member: "member",
};

function Member(props) {
    const getTownHallImage = (level) => {
        if (level === 18) return "/th18.png";
        if (level === 17) return "/th17.png";
        return null;
    };

    const townHallImage = getTownHallImage(props.townHallLevel);
    const roleLabel = ROLE_LABELS[props.role] || props.role;
    const roleRating = ROLE_RATING[props.role] || "member";

    const rankChange = (props.previousClanRank && props.clanRank)
        ? props.previousClanRank - props.clanRank
        : 0;

    return (
        <Link to={`/player/%23${props.tag.substring(1)}`} className="card-member-link">
            <div className={`card-member-container card-member-container--${roleRating}`}>

                {props.clanRank && (
                    <div className="card-member-rank">
                        <span className="card-member-rank-number">#{props.clanRank}</span>
                        {rankChange > 0 && (
                            <span className="card-member-rank-trend card-member-rank-trend--up">▲{rankChange}</span>
                        )}
                        {rankChange < 0 && (
                            <span className="card-member-rank-trend card-member-rank-trend--down">▼{Math.abs(rankChange)}</span>
                        )}
                    </div>
                )}

                <div className="card-member-header">
                    <img
                        src={props.leagueTier?.iconUrls?.small}
                        alt="Liga"
                        className="league-icon-member"
                    />
                    <h3 className="player-name">{props.name}</h3>
                </div>

                <div className="card-description-th-trophy">
                    <div className="card-member-th-img">
                        {townHallImage && <img src={townHallImage} alt="Ayuntamiento" className="th-img" />}
                    </div>
                    <div className="card-info-number-trophies">
                        <img src="/trophy.png" alt="trofeos" className="trophy-img-member" />
                        <strong>{props.trophies}</strong>
                    </div>
                </div>

                <div className="card-member-description">
                    <p className="card-member-info-role">👑 Rol <strong>{roleLabel}</strong></p>
                    <p className="card-member-info-donations">✅ Donaciones <strong>{props.donations}</strong></p>
                    <p className="card-member-info-donations-received">⬇️ Recibidas <strong>{props.donationsReceived}</strong></p>
                </div>

                <span className="card-member-cta">Ver perfil →</span>

            </div>
        </Link>
    );
}

export default Member;
