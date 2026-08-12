import React, { useState, useEffect } from "react";
import { getSinglePlayer } from "../../Services/ConnectAPI.js";
import MemberDetailList from "../MemberDetailList/MemberDetailList.jsx";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";

function MemberDetailContainer() {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    let { PLAYERTAG } = useParams();

    useEffect(() => {
        async function fetchMember() {
            try {
                setLoading(true);
                setError(false);
                const response = await getSinglePlayer(PLAYERTAG);
                setMember(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching member:', error);
                setError(true);
                setLoading(false);
            }
        }

        fetchMember();
    }, [PLAYERTAG]);

    if (loading) {
        return <Loader />;
    }

    if (error || !member) {
        return (
            <div className="member-detail-error">
                No se pudo cargar la información de este jugador. Puede que el tag no sea válido.
            </div>
        );
    }

    return <MemberDetailList member={member} />;
}

export default MemberDetailContainer;
