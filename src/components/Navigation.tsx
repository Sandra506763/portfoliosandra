import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="slider-nav">
      <div className="slider">
        <NavLink 
          to="/about"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Über mich
        </NavLink>

        <NavLink 
          to="/projects"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Projekte
        </NavLink>

        <NavLink 
          to="/contact"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Kontakt
        </NavLink>

        <span className="highlight"></span>
      </div>
    </nav>
  );
};

export default Navigation;