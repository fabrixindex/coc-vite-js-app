import React, { useState, useEffect } from "react";
import RankingClanArg from "../RankingClanArg/RankingClanArg.jsx";
import RankingPlayerArg from "../RankingPlayerArg/RankingPlayerArg.jsx";
import RankingPlayerMex from "../RankingPlayerMx/RankingPlayerMx.jsx";
import Loader from "../Loader/Loader.jsx"; // Importa el componente de loader
import "./Rankings.css";

function Rankings() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos un tiempo de carga
        const timeout = setTimeout(() => {
            setLoading(false); // Cuando termina la carga, actualizamos el estado para dejar de mostrar el loader
        }, 2000); // Cambia este valor al tiempo de carga real de tus componentes

        return () => clearTimeout(timeout); // Limpiamos el timeout cuando el componente se desmonta
    }, []);

    return (
        <>
            {loading ? ( // Mostrar el loader mientras loading es true
                <Loader />
            ) : (
                <>
                    <div className="ranking-container-1">
                        <div>
                            <h1 className="clan-arg-container-text">RANKING DE CLANES ARGENTINA</h1>
                        </div>

                        <RankingClanArg />
                    </div>

                    <div className="ranking-container-2">
                        <RankingPlayerArg />

                        <div>
                            <h1 className="arg-player-container-text">RANKING <br /> DE PLAYERS ARGENTINA</h1>
                        </div>
                    </div>

                    <div className="ranking-container-3">

                        <div>
                            <h1 className="mex-player-container-text">RANKING <br /> DE PLAYERS MEXICO</h1>
                        </div>

                        <RankingPlayerMex />
                    </div>
                </>
            )}
        </>
    );
}

export default Rankings;
