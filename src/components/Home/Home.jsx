import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader.jsx"; 
import "./Home.css"

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000); 

        return () => clearTimeout(timeout);
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="home-card-container">
                <Link to={"/losMagiosClan"} className="home-card-1-container">
                    <div>
                        <p className="home-card-1-p">NUESTRO CLAN</p>
                    </div>
                </Link>

                <Link to={"currentWar"} className="home-card-2-container">
                    <div>
                        <p className="home-card-2-p">NUESTRA GUERRA ACTUAL</p>
                    </div>
                </Link>
            </div>

            <div className="home-card-3-container">
                <p className="home-card-3-container-first-p"><strong>Con nuestra App lograrás hacer un seguimiento completo del clan "Los Magios" en Clash of Clans, podrás acceder a multiples estadísticas de manera simple y rápida. Algunas de las tareas que podras realizar con nuestra App son:</strong></p>
                <ul className="home-card-3-container-ul">
                    <li className="home-card-3-container-li">
                        🔴 Acceder a toda la información sobre nuestro Clan.
                    </li>
                    <li className="home-card-3-container-li">
                        🟠 Acceder a toda la información sobre nuestros jugadores.
                        </li>
                    <li className="home-card-3-container-li">
                        🟡 Acceder a información en tiempo real sobre la actual guerra de Clanes.
                    </li>
                    <li className="home-card-3-container-li">
                        🟢 Acceder a información sobre la actual Liga de Guerra de Clanes.
                    </li>
                    <li className="home-card-3-container-li">
                        🔵 Controlar las Donaciones del Clan.
                    </li>
                    <li className="home-card-3-container-li">
                        🟣 Controlar los asaltos de fin de semana de la Capital del Clan.
                    </li>
                    <li className="home-card-3-container-li">
                        ⚪ Acceder a Rankings de Clanes y Jugadores.
                    </li>
                </ul>

                <p className="home-card-3-container-final-p">Nos dedicamos continuamente a mejorar nuestra App para brindar una experiencia mas personalizada y confortable para el usuario y todos los que amamos Clash of Clans.</p>
            </div>
  
        </>   
    )
};

export default Home;