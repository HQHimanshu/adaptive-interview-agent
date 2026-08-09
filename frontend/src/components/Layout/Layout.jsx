import React, { useRef } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const hideFooter = location.pathname.startsWith('/interview') || location.pathname.startsWith('/program');

  let currentIndex = 0;
  if (location.pathname.startsWith('/program')) currentIndex = 1;
  else if (location.pathname.startsWith('/candidates')) currentIndex = 2;
  else if (location.pathname.startsWith('/interview')) currentIndex = 3;

  const prevIndexRef = useRef(currentIndex);
  const directionRef = useRef('right');

  if (currentIndex !== prevIndexRef.current) {
    directionRef.current = currentIndex > prevIndexRef.current ? 'right' : 'left';
    prevIndexRef.current = currentIndex;
  }

  return (
    <div className="layout">
      <Header />
      <main className="main-content" style={{ overflowX: 'hidden' }}>
        <div
          key={location.pathname}
          className={`page-transition-slide-${directionRef.current}`}
          style={{ width: '100%', height: '100%' }}
        >
          {outlet}
        </div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
