import React from "react";
import "./Loader.css";

function Loader() {
    return (
        <div className="loader-container">
            <div className="loader-spinner">
                <div className="loader-ring"></div>
                <div className="loader-ring loader-ring--inner"></div>
            </div>
            <p className="loader-text">⚔️ Cargando...</p>
        </div>
    );
}

export default Loader;