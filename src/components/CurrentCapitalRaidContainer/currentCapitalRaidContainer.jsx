import React, { useState, useEffect } from "react";
import CurrentCapitalRaidList from "../CurrentCapitalRaidList/currentCapitalRaidList.jsx";
import { getClanCapitalRaidSeasons, fetchClanMembersData } from "../../Services/ConnectAPI.js";

export default function CurrentCapitalRaidContainer() {
    const [members, setMembers] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        async function fetchCapitalRaidData() {
            try {
                const capitalRaidData = await getClanCapitalRaidSeasons();
                const allMembers = await fetchClanMembersData();
                const allMembers2 = allMembers.items
                // Crear un set con los tags de los miembros de la temporada de asalto capital
                const raidMemberTags = new Set(capitalRaidData.members.map(member => member.tag));

                // Agregar los miembros que faltan en la lista de la temporada de asalto capital
                allMembers2.forEach(member => {
                    if (!raidMemberTags.has(member.tag)) {
                        capitalRaidData.members.push({
                            name: member.name,
                            tag: member.tag,
                            attacks: 0
                        });
                    }
                });

                setMembers(capitalRaidData.members);
                setStartTime(capitalRaidData.startTime);
                setEndTime(capitalRaidData.endTime);
            } catch(error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchCapitalRaidData();
    }, []);

    return <CurrentCapitalRaidList members={members} startTime={startTime} endTime={endTime} />;
}
