import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OrbitalMoon from '../OrbitalMoon';

function MagneticButton({ className, children, ...props }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.26;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.26;
    btnRef.current.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = '';
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}

export default function LandingPage() {
  const [isIn, setIsIn] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const splashDuration = 1800; // Assuming splash screen handled at App level, we just delay entry
    setTimeout(() => setIsIn(true), splashDuration > 0 ? splashDuration + 400 : 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroH1Transform = `translateY(${Math.min(scrollY / window.innerHeight, 1) * -50}px)`;

  return (
    <section className="hero-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className={`hero-inner ${isIn ? 'in' : ''}`} id="heroInner" style={{ width: '100%' }}>
        <div className="hero-split">
          <div className="hero-text-col">
            <h1 className="hero-h1" style={{ transform: heroH1Transform }}>
              <span className="clip-line">
                <span className="clip-inner">Technical interviews</span>
              </span>
              <span className="clip-line">
                <span className="clip-inner"><em>that adapt to you.</em></span>
              </span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'var(--text-muted, #9e9f9b)',
              lineHeight: '1.6',
              maxWidth: '480px',
              marginBottom: '40px',
              opacity: isIn ? 1 : 0,
              transform: isIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}>
              An AI interviewer that evaluates what you actually demonstrate — not what your resume claims.
            </p>

            <div className={`hero-ctas ${isIn ? 'in' : ''}`}>
              <button className="button primary" onClick={() => navigate('/setup')}>
                Start Interview&thinsp;→
              </button>
            </div>

            <div className={`hero-stats ${isIn ? 'in' : ''}`} style={{ marginTop: '60px' }}>
              <div className="stat-item">
                <div className="stat-num">AI</div>
                <div className="stat-label">Adaptive Evaluation</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">Tech</div>
                <div className="stat-label">Engineering Focus</div>
              </div>
            </div>
          </div>

          <div className="hero-moon-col">
            <OrbitalMoon />
          </div>
        </div>
      </div>
    </section>
  );
}
