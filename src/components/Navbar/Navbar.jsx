import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/losMagiosClan', label: 'Nuestro Clan' },
    { to: '/currentWar', label: 'Guerra Actual' },
    { to: '/warleague', label: 'Liga de Guerra' },
    { to: '/capitalRaid', label: 'Asaltos de la Capital' },
    { to: '/checkDonations', label: 'Donaciones del Clan' },
    { to: '/rankings', label: 'Rankings' },
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Evita que el fondo scrollee mientras el drawer está abierto en mobile
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <nav id="nav">
                <NavLink to="/" className="nav-logo" onClick={closeMenu}>
                    ⚔️ <span>Los Magios</span>
                </NavLink>

                <ul className="nav-links-desktop">
                    {NAV_LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    className="menu-icon"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </nav>

            <div className={`nav-overlay${isMenuOpen ? ' nav-overlay--visible' : ''}`} />

            <div ref={menuRef} className={`nav-drawer${isMenuOpen ? ' nav-drawer--open' : ''}`}>
                <div className="nav-drawer-header">
                    <span className="nav-drawer-title">⚔️ Los Magios</span>
                    <button
                        type="button"
                        className="nav-drawer-close"
                        onClick={closeMenu}
                        aria-label="Cerrar menú"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                <ul>
                    {NAV_LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) => `nav-drawer-item${isActive ? ' nav-drawer-item--active' : ''}`}
                                onClick={closeMenu}
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Navbar;
