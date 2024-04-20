import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); 
  };

  return (
    <nav id='nav'>

      <div className="menu-icon" onClick={toggleMenu}>
        <FaBars size={20} color="white" />
      </div>

      <div ref={menuRef} className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          
          <Link to="/" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Home </li> </Link>
          
          <Link to="/losMagiosClan" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Clan Los Magios </li> </Link>

          <Link to="/currentWar" className='nav-item'> <li className='nav-bar-li' onClick={handleLinkClick}> Estadisticas de la Guerra actual </li> </Link>
          
          <Link to="/warleague" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Estadisticas de CWL </li> </Link> 

          <Link to="/capitalRaid" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Asaltos de la Capital </li> </Link>

          <Link to="/checkDonations" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Donaciones del Clan </li> </Link>
          
          <Link to="/rankings" className='nav-item' onClick={handleLinkClick}> <li className='nav-bar-li'> Rankings </li> </Link>

        </ul>
      </div>

    </nav>
  );
}

export default Navbar;
