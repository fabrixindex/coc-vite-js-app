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
                league={member.league} 
                expLevel={member.expLevel}
              />
            ))}
          </ContenedorFlex>
      );
}      

export default MemberList;
