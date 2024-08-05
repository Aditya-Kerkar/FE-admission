// Layout.jsx
import React from 'react';
import Header from './Header'; // Correct path to Header.jsx
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;