import React, { useState, useEffect} from "react";
import { getWarLeagueGroup } from "../../Services/ConnectAPI.js";
import "./ClanWarLeague.css";

function ClanWarLeague() {
    const [WarLeagueGroup, setData] = useState(null);

    useEffect(() => {
        async function fetchWarLeagueGroup() {
            try {
                const response = await getWarLeagueGroup();
                console.log("INFO LIGAAAA", response)
                setData(response);
            } catch (error) {
                console.error('Error fetching CLAN:', error);
            }
        }

        fetchWarLeagueGroup();
    }, []);

    return(
        <p className="cwl-title">¡PRÓXIMAMENTE!</p>
    )
}

export default ClanWarLeague;