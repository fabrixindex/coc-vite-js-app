import React from "react";
import Member from "../Member/member.jsx";
import ContenedorFlex from "../ContenedorFlex/contenedorFlex.jsx";

function MemberList({ members }) {
    return (
        <ContenedorFlex>
            {members.map((member) => (
                <Member
                    key={member.tag}
                    name={member.name}
                    tag={member.tag}
                    role={member.role}
                    townHallLevel={member.townHallLevel}
                    trophies={member.trophies}
                    donations={member.donations}
                    donationsReceived={member.donationsReceived}
                    leagueTier={member.leagueTier}
                    expLevel={member.expLevel}
                    clanRank={member.clanRank}
                    previousClanRank={member.previousClanRank}
                />
            ))}
        </ContenedorFlex>
    );
}

export default MemberList;
