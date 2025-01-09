import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Add custom CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo section */}
        <div className="navbar-logo">
          <Link to="/">
            <img src="./src/assets/logo1.png" alt="Logo" className="logo" /> {/* Adjust path if needed */}
          </Link>
        </div>

        {/* Navbar Links */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/solace">Chatbot</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
