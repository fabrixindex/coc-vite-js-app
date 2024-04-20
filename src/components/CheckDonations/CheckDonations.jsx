import React, { useState, useEffect } from "react";
import { fetchClanMembersData } from "../../Services/ConnectAPI.js";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";
import "./CheckDonations.css";

function CheckDonations() {
    const [members, setMembers] = useState([]);
    const [unbalancedDonations, setUnbalancedDonations] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [copied, setCopied] = useState(false);  
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const response = await fetchClanMembersData();
                setMembers(response.items || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching members:', error);
                setLoading(false);
            }
        }
        fetchMembers();
    }, []);

    const handleGenerateDonationsList = () => {
        const unbalanced = members.filter(member => 
            Number(member.donations) < Number(member.donationsReceived) / 2
        );
        setUnbalancedDonations(unbalanced);
        setShowModal(true);  
    };

    const closeModal = () => {
        setShowModal(false);  
    };

    const copyList = () => {
        const formattedList = unbalancedDonations.map((member, index) =>
            `🔴 ${index + 1}. ${member.name}`
        ).join("\n");
    
        const modalTitle = "⚔❌ Lista de Jugadores con Donaciones Desequilibradas ❌⚔";
    
        const textToCopy = `${modalTitle}\n${formattedList}`;
    
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
    
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    };   
    
    if (loading) {
        return <Loader />; 
    }

    return (
        <React.Fragment>

            <div className="equilibrio-donaciones">
                <h1 className="equilibrio-donaciones-title">Equilibrio de Donaciones</h1>
                <p className="equilibrio-donaciones-text">En Magios, tenemos normas para regular las donaciones durante la temporada. Todos los miembros del clan deben donar al menos la mitad de las tropas que solicitan. Esta regla garantiza un equilibrio en las donaciones. Si un jugador no cumple con esta regla, podría recibir una sanción al finalizar la temporada.</p>

                <button onClick={handleGenerateDonationsList} className="generate-donation-list-bt">Generar Lista de Control de Donaciones</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4 className="modal-title">Lista de Jugadores con Donaciones Desequilibradas</h4>
                        <div className="modal-list">
                            <ul>
                                {unbalancedDonations.map((member, index) => (
                                    <li className="item-modal" key={index}>🔴 {index + 1}. {member.name}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="button-modal-container">
                            <button className="button-modal-copy" onClick={copyList}>{copied ? "¡Copiado!" : "Copiar Lista"}</button>

                            <button className="button-modal-ocultar" onClick={closeModal}>Ocultar Lista</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div id="card-container">
                {members.map((member, index) => (
                    <div className="cards-donations" key={index}>
                        <div className="card-donations-header">
                            <img src={member.league.iconUrls.small} alt="League Icon" className="league-icon" />
                            <Link to={`/player/%23${member.tag.substring(1)}`} className="link-unstyled"><h4 className="card-donations-title">{member.name}</h4></Link>
                        </div>

                        <div className="card-donations-description">
                            <p className="card-donations-description-p">✅ Donaciones: {member.donations}</p>
                            <p className="card-donations-description-p">❌ Donaciones Recibidas: {member.donationsReceived}</p>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}

export default CheckDonations;
