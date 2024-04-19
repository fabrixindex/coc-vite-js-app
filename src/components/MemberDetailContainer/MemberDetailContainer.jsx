import React, { useState, useEffect } from "react";
import { getSinglePlayer } from "../../Services/ConnectAPI.js";
import MemberDetailList from "../MemberDetailList/MemberDetailList.jsx";
import { useParams } from "react-router-dom";

function MemberDetailContainer() {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    let { PLAYERTAG } = useParams();

    useEffect(() => {
        async function fetchMember() {
            try {
                const response = await getSinglePlayer(PLAYERTAG);
                setMember(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching member:', error);
                setLoading(false);
            }
        }

        fetchMember();
    }, [PLAYERTAG]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return <MemberDetailList member={member} />;
}

export default MemberDetailContainer;
