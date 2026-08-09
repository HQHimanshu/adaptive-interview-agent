import React from 'react';
import './Footer.css';

const Logo = () => (
  <img src="/logo.png" alt="AB Talks Logo" style={{ height: '24px' }} />
);

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <Logo />
        </div>
        <div className="footer-copyright">
          &copy; 2026 AB Talks &middot; Adaptive AI Technical Interviews
        </div>
      </div>
    </footer>
  );
};

export default Footer;
