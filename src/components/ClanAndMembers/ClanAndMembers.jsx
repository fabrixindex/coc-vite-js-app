import React, { useState, useEffect, useRef } from "react";
import { getClanData } from "../../Services/ConnectAPI.js";
import MemberListContainer from "../MemberListContainer/memberListContainer.jsx";
import Loader from "../Loader/Loader.jsx"; 
import "./ClanAndMembers.css";

function ClanAndMembers() {
    const [loading, setLoading] = useState(true); 
    const [clan, setClan] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showCopiedText, setShowCopiedText] = useState(false);
    const clanTagRef = useRef(null);

    useEffect(() => {
        async function fetchClanData() {
            try {
                const response = await getClanData();
                setClan(response);
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching CLAN:', error);
                setLoading(false); 
            }
        }

        fetchClanData();
    }, []);

    const copyToClipboard = () => {
        const textToCopy = clanTagRef.current.textContent.trim();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setShowCopiedText(true);
    
        clanTagRef.current.textContent = "¡Copiado!";
    
        setTimeout(() => {
            clanTagRef.current.textContent = clan.tag;
            setShowCopiedText(false);
        }, 3000);
    };
    

    useEffect(() => {
        if (showCopiedText) {
            const timeout = setTimeout(() => {
                setShowCopiedText(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [showCopiedText]);

    if (loading) {
        return <Loader />; 
    }

    return (
        <>
            <div className="container">
                <div className="clan-card-container">

                    <div className="clan-img-container">
                        <img src={clan.badgeUrls?.large} alt="Insignia del clan" className="clan-img" />
                        <p className="clan-war-league">
                            <img src="../public/league.png" alt="league" className="league-img" /> 
                            <span className="bg-text">{clan.warLeague.name}</span>
                        </p>

                        <p ref={clanTagRef} onClick={copyToClipboard} className="clan-tag" onMouseEnter={() => setCopied(false)} onMouseLeave={() => setShowCopiedText(false)}>{clan.tag}</p>

                    </div>

                    <div className="clan-card-container-child">
                        <h1 className="clan-name">{clan.name}</h1>
                        <p className="clan-description">{clan.description}</p>

                        <div className="clan-card-contained-mini-child">
                            <p>Nivel del clan: {clan.clanLevel}</p>
                            <p>Miembros: {clan.members}</p>
                            <p>Ubicación: {clan.location?.name}</p>
                            <p>Liga de la capital del clan: {clan.capitalLeague?.name}</p>
                            <p>Puntos del clan: {clan.clanPoints}</p>
                            <p>Puntos de capital del clan: {clan.clanCapitalPoints}</p>
                            <p>Idioma del chat del clan: {clan.chatLanguage?.name}</p>
                            <p>Nivel de ayuntamiento requerido: {clan.requiredTownhallLevel}</p>
                            <p>Trofeos requeridos: {clan.requiredTrophies}</p>
                            <p>Frecuencia de guerra: {clan.warFrequency}</p>
                            <p>Victorias en guerra: {clan.warWins}</p>
                            <p>Racha de victorias en guerra: {clan.warWinStreak}</p>
                        </div>
                    </div>
                </div>
            </div>

            <MemberListContainer/>
        </>
    );
}

export default ClanAndMembers;
