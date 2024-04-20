import React, { useState, useEffect } from "react";
import CurrentCapitalRaidList from "../CurrentCapitalRaidList/currentCapitalRaidList.jsx";
import Loader from "../Loader/Loader.jsx"; // Importa el componente de loader
import { getClanCapitalRaidSeasons, fetchClanMembersData } from "../../Services/ConnectAPI.js";

export default function CurrentCapitalRaidContainer() {
    const [loading, setLoading] = useState(true); // Estado para controlar si se está cargando o no
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
                setLoading(false); // Una vez que se completó la carga, actualizamos el estado para dejar de mostrar el loader
            } catch(error) {
                console.error('Error fetching data:', error);
                setLoading(false); // En caso de error, también dejamos de mostrar el loader
            }
        }

        fetchCapitalRaidData();
    }, []);

    return (
        <>
            {loading ? ( // Mostrar el loader mientras loading es true
                <Loader />
            ) : (
                <CurrentCapitalRaidList members={members} startTime={startTime} endTime={endTime} />
            )}
        </>
    );
}
