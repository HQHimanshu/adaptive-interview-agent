import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const Logo = () => (
  <img src="/logo.png" alt="AB Talks Logo" style={{ height: '48px', mixBlendMode: 'multiply' }} />
);

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Logo />
      </div>
      <nav className="header-nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/program">Program</NavLink>
        <NavLink to="/interview">Interview</NavLink>
        <NavLink to="/candidates">Candidates</NavLink>
      </nav>
      <div className="header-actions">
        <Link to="/interview" className="btn btn-primary">
          <SparklesIcon /> Start Interview
        </Link>
      </div>
    </header>
  );
};

export default Header;
