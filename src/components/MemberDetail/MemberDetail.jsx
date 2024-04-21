import React from "react";
import "./MemberDetail.css";

function MemberDetail(props) {
    return (
        <div className="member-card">
            
            <div className="card-sub-header">
                 <p> {props.tag} </p>
            </div>

            <div className="card-header-member-detail">
                <img src={props.clanBadgeUrlMedium} alt="Clan Badge" className="clan-badge" />
                <h2 className="player-name-member-detail">{props.name}</h2>
                <img src={props.leagueIconUrlMedium} alt="League Icon" className="league-icon-member-detail" />
            </div>
            

            <div className="card-body">
                <p className="parrafo1"><strong>Town Hall Level:</strong> {props.townHallLevel}</p>
                <p className="parrafo2"><strong>Exp Level:</strong> {props.expLevel}</p>
                <p className="parrafo3"><strong>Trophies:</strong> {props.trophies}</p>
                <p className="parrafo4"><strong>Best Trophies:</strong> {props.bestTrophies}</p>
                <p className="parrafo5"><strong>War Stars:</strong> {props.warStars}</p>
                <p className="parrafo6"><strong>Attack Wins:</strong> {props.attackWins}</p>
                <p className="parrafo7"><strong>Defense Wins:</strong> {props.defenseWins}</p>
                <p className="parrafo8"><strong>Builder Hall Level:</strong> {props.builderHallLevel}</p>
                <p className="parrafo9"><strong>Builder Base Trophies:</strong> {props.builderBaseTrophies}</p>
                <p className="parrafo10"><strong>Best Builder Base Trophies:</strong> {props.bestBuilderBaseTrophies}</p>
                <p className="parrafo11"><strong>Role:</strong> {props.role}</p>
                <p className="parrafo12"><strong>Donations:</strong> {props.donations}</p>
                <p className="parrafo13"><strong>Donations Received:</strong> {props.donationsReceived}</p>
                <p className="parrafo14"><strong>Clan Capital Contributions:</strong> {props.clanCapitalContributions}</p>
                <p className="parrafo15"><strong>League Name:</strong> {props.leagueName}</p>
                <p className="parrafo16"><strong>Builder Base League Name:</strong> {props.builderBaseLeagueName}</p>
            </div>
        </div>
    );
}

export default MemberDetail;
