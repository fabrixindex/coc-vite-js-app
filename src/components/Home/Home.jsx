import { Link } from "react-router-dom";
import "./Home.css";

const SECTIONS = [
    {
        to: "/losMagiosClan",
        icon: "🛡️",
        title: "Nuestro Clan",
        description: "Info del clan y todos los jugadores",
        variant: "gold",
        image: "https://i.imgur.com/AZwwkCo.jpg",
    },
    {
        to: "/currentWar",
        icon: "⚔️",
        title: "Guerra Actual",
        description: "Seguimiento en tiempo real",
        variant: "red",
        image: "https://imgur.com/fPU8JPr.jpg",
    },
    {
        to: "/warleague",
        icon: "🏆",
        title: "Liga de Guerra",
        description: "Rondas, estadísticas y cambios",
        variant: "gold",
        image: "https://imgur.com/IgUNyqT.jpg",
    },
    {
        to: "/capitalRaid",
        icon: "☁️",
        title: "Capital del Clan",
        description: "Asaltos de fin de semana",
        variant: "purple",
        image: "https://imgur.com/aLrHIYN.jpg",
    },
    {
        to: "/checkDonations",
        icon: "🤝",
        title: "Donaciones",
        description: "Equilibrio del clan",
        variant: "green",
        image: "https://imgur.com/GBo09n2.jpg",
    },
    {
        to: "/rankings",
        icon: "📊",
        title: "Rankings",
        description: "Clanes y jugadores de la región",
        variant: "blue",
        image: "https://imgur.com/pYgbpu1.jpg",
    },
];

function Home() {
    return (
        <div className="home-page">

            <header className="home-hero">
                <h1 className="home-hero-title">
                    <span className="home-hero-title-text">Panel del Clan</span>
                </h1>
                <p className="home-hero-subtitle">
                    Seguimiento completo del clan en Clash of Clans: guerra, liga, capital, donaciones y rankings, todo en un solo lugar.
                </p>
            </header>

            <div className="home-grid">
                {SECTIONS.map((section) => (
                    <Link
                        key={section.to}
                        to={section.to}
                        className={`home-card home-card--${section.variant}`}
                        style={section.image ? { "--home-card-image": `url(${section.image})` } : undefined}
                    >
                        <span className="home-card-icon" aria-hidden="true">{section.icon}</span>
                        <span className="home-card-title">{section.title}</span>
                        <span className="home-card-description">{section.description}</span>
                    </Link>
                ))}
            </div>

            <footer className="home-footer">
                <p className="home-footer-text">
                    Mejoramos esta App todo el tiempo para que sea más fácil seguir a nuestro Clan — hecha por y para quienes amamos Clash of Clans. 🔥
                </p>
            </footer>

        </div>
    );
}

export default Home;
