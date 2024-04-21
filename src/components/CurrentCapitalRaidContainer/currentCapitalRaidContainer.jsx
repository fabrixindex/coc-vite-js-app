import React, { useState, useEffect } from "react";
import CurrentCapitalRaidList from "../CurrentCapitalRaidList/currentCapitalRaidList.jsx";
import Loader from "../Loader/Loader.jsx"; 
import { getClanCapitalRaidSeasons, fetchClanMembersData } from "../../Services/ConnectAPI.js";

export default function CurrentCapitalRaidContainer() {
    const [loading, setLoading] = useState(true); 
    const [members, setMembers] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        async function fetchCapitalRaidData() {
            try {
                const capitalRaidData = await getClanCapitalRaidSeasons();
                const allMembers = await fetchClanMembersData();
                const allMembers2 = allMembers.items
                const raidMemberTags = new Set(capitalRaidData.members.map(member => member.tag));

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
                setLoading(false); 
            } catch(error) {
                console.error('Error fetching data:', error);
                setLoading(false); 
            }
        }

        fetchCapitalRaidData();
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <CurrentCapitalRaidList members={members} startTime={startTime} endTime={endTime} />
            )}
        </>
    );
}
