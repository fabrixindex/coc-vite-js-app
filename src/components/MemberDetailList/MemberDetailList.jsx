import React from "react";
import MemberDetail from "../MemberDetail/MemberDetail.jsx";

function MemberDetailList({ member }) {
    return (
        <MemberDetail
            name={member.name}
            tag={member.tag}
            townHallLevel={member.townHallLevel}
            townHallWeaponLevel={member.townHallWeaponLevel}
            expLevel={member.expLevel}
            trophies={member.trophies}
            bestTrophies={member.bestTrophies}
            warStars={member.warStars}
            attackWins={member.attackWins}
            defenseWins={member.defenseWins}
            builderHallLevel={member.builderHallLevel}
            builderBaseTrophies={member.builderBaseTrophies}
            bestBuilderBaseTrophies={member.bestBuilderBaseTrophies}
            role={member.role}
            warPreference={member.warPreference}
            donations={member.donations}
            donationsReceived={member.donationsReceived}
            clanCapitalContributions={member.clanCapitalContributions}
            clanTag={member.clan.tag}
            clanName={member.clan.name}
            clanLevel={member.clan.clanLevel}
            clanBadgeUrlSmall={member.clan.badgeUrls.small}
            clanBadgeUrlMedium={member.clan.badgeUrls.medium}
            clanBadgeUrlLarge={member.clan.badgeUrls.large}
            leagueId={member.league.id}
            leagueName={member.league.name}
            leagueIconUrlSmall={member.league.iconUrls.small}
            leagueIconUrlTiny={member.league.iconUrls.tiny}
            leagueIconUrlMedium={member.league.iconUrls.medium}
            builderBaseLeagueId={member.builderBaseLeague.id}
            builderBaseLeagueName={member.builderBaseLeague.name}
        />
    );
}

export default MemberDetailList;
