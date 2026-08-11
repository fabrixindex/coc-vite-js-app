import React, { useState, useEffect } from "react";
import RankingClanArg from "../RankingClanArg/RankingClanArg.jsx";
import RankingPlayerArg from "../RankingPlayerArg/RankingPlayerArg.jsx";
import RankingPlayerMex from "../RankingPlayerMx/RankingPlayerMx.jsx";
import Loader from "../Loader/Loader.jsx";
import "./Rankings.css";

function Rankings() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="rankings-page">

            <header className="rankings-hero">
                <h1 className="rankings-hero-title">Rankings</h1>
                <p className="rankings-hero-subtitle">Los mejores clanes y jugadores de la región</p>
            </header>

            <section className="ranking-section ranking-section--arg">
                <div className="ranking-section-header">
                    <span className="ranking-section-flag">☀️</span>
                    <h2 className="ranking-section-title">Ranking de Clanes — Argentina</h2>
                </div>
                <RankingClanArg />
            </section>

            <section className="ranking-section ranking-section--arg">
                <div className="ranking-section-header">
                    <span className="ranking-section-flag">☀️</span>
                    <h2 className="ranking-section-title">Ranking de Jugadores — Argentina</h2>
                </div>
                <RankingPlayerArg />
            </section>

            <section className="ranking-section ranking-section--mex">
                <div className="ranking-section-header">
                    <span className="ranking-section-flag">🦅</span>
                    <h2 className="ranking-section-title">Ranking de Jugadores — México</h2>
                </div>
                <RankingPlayerMex />
            </section>

        </div>
    );
}

export default Rankings;
