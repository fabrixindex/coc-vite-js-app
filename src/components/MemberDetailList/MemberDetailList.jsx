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
            leagueId={member.leagueTier?.id}
            leagueName={member.leagueTier?.name}
            leagueIconUrlSmall={member.leagueTier?.iconUrls?.small}
            leagueIconUrlMedium={member.leagueTier?.iconUrls?.large}
            builderBaseLeagueId={member.builderBaseLeague.id}
            builderBaseLeagueName={member.builderBaseLeague.name}
        />
    );
}

export default MemberDetailList;
