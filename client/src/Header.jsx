import React from 'react';
import './Header.css';
import logo from './gstlogo.png';

const Header = () => {
  const handleLogout = () => {
    alert("You have been logged out");
    window.location.reload(); // Refresh the window
  };

  return (
    <div className="header" style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <div className="header-left">
        <img
          src={logo}
          alt="SIES Graduate School of Technology"
          className="logo"
        />
      </div>
      <div className="header-right">
        <h1>SIES Graduate School of Technology</h1>
        <p>Accredited with NAAC A+ Grade and NBA Accredited</p>
        <p>www.siesgst.edu.in</p>
        <div className='buttons-nav'>
        <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
