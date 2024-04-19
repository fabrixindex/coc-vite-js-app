import React from "react";
import "./MemberDetail.css";

function MemberDetail(props) {
    return(
        <div className="member-card">
            <img src={props.clanBadgeUrlMedium} alt="Clan Badge" className="clan-badge" />
            <div className="member-info">
                <h2 className="title">{props.name}</h2>
                <p className="parrafo"><strong>Tag:</strong> {props.tag}</p>
                <p className="parrafo"><strong>Town Hall Level:</strong> {props.townHallLevel}</p>
                <p className="parrafo"><strong>Exp Level:</strong> {props.expLevel}</p>
                <p className="parrafo"><strong>Trophies:</strong> {props.trophies}</p>
                <p className="parrafo"><strong>Best Trophies:</strong> {props.bestTrophies}</p>
                <p className="parrafo"><strong>War Stars:</strong> {props.warStars}</p>
                <p className="parrafo"><strong>Attack Wins:</strong> {props.attackWins}</p>
                <p className="parrafo"><strong>Defense Wins:</strong> {props.defenseWins}</p>
                <p className="parrafo"><strong>Builder Hall Level:</strong> {props.builderHallLevel}</p>
                <p className="parrafo"><strong>Builder Base Trophies:</strong> {props.builderBaseTrophies}</p>
                <p className="parrafo"><strong>Best Builder Base Trophies:</strong> {props.bestBuilderBaseTrophies}</p>
                <p className="parrafo"><strong>Role:</strong> {props.role}</p>
                <p className="parrafo"><strong>War Preference:</strong> {props.warPreference}</p>
                <p className="parrafo"><strong>Donations:</strong> {props.donations}</p>
                <p className="parrafo"><strong>Donations Received:</strong> {props.donationsReceived}</p>
                <p className="parrafo"><strong>Clan Capital Contributions:</strong> {props.clanCapitalContributions}</p>
                <p className="parrafo"><strong>Clan Tag:</strong> {props.clanTag}</p>
                <p className="parrafo"><strong>Clan Name:</strong> {props.clanName}</p>
                <p className="parrafo"><strong>Clan Level:</strong> {props.clanLevel}</p>
                <p className="parrafo"><strong>League ID:</strong> {props.leagueId}</p>
                <p className="parrafo"><strong>League Name:</strong> {props.leagueName}</p>
                <p className="parrafo"><strong>League Icon URL Medium:</strong> <img src={props.leagueIconUrlMedium} alt="League icon medium" /></p>
                <p className="parrafo"><strong>Builder Base League ID:</strong> {props.builderBaseLeagueId}</p>
                <p className="parrafo"><strong>Builder Base League Name:</strong> {props.builderBaseLeagueName}</p>
            </div>
        </div>
    );
}

export default MemberDetail;
