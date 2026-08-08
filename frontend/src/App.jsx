import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import './inline.css';

function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const bg = canvasRef.current;
    if (!bg) return;
    const bgCtx = bg.getContext('2d');
    let W, H;
    let mx = -999, my = -999, tmx = -999, tmy = -999;
    let animationFrameId;

    const RINGS = [
      { cx: .13, cy: .04, rx: .66, ry: .39, n: 14, rot: 32 },
      { cx: .87, cy: .94, rx: .56, ry: .33, n: 11, rot: -8 },
    ];

    const STAR_COUNT = 120;
    let stars = [];

    function initStars() {
      stars = [];
      const tries = STAR_COUNT * 6;
      for (let s = 0; s < tries && stars.length < STAR_COUNT; s++) {
        const sx = Math.random() * W;
        const sy = Math.random() * H;
        const too_close = stars.some(st => {
          const dd = (st.x - sx) * (st.x - sx) + (st.y - sy) * (st.y - sy);
          return dd < 1600;
        });
        if (too_close) continue;
        stars.push({
          x: sx, y: sy,
          r: 0.4 + Math.random() * 1.1,
          baseA: 0.15 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
        });
      }
    }

    function resize() {
      W = bg.width = window.innerWidth;
      H = bg.height = window.innerHeight;
      initStars();
    }
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      tmx = e.clientX;
      tmy = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    let t = 0;
    function drawBg() {
      bgCtx.clearRect(0, 0, W, H);
      t += 0.003;

      mx += (tmx - mx) * 0.07;
      my += (tmy - my) * 0.07;

      RINGS.forEach((set, si) => {
        const cx = set.cx * W;
        const cy = set.cy * H;
        // Continuously rotate over time AND window scroll position
        const scrollFactor = window.scrollY || 0;
        // Idle time-based rotation is now very slow (0.04 / -0.03) instead of (0.18 / -0.12)
        const rot = (set.rot * Math.PI / 180) + t * (si === 0 ? 0.04 : -0.03) + scrollFactor * (si === 0 ? 0.0025 : -0.002);
        
        // Also subtly shift the center based on scroll
        const scrollYOffset = scrollFactor * 0.15;

        for (let i = 0; i < set.n; i++) {
          const ratio = (i + 1) / set.n;
          // Add a subtle 3D wobble to the radii
          const wobble = Math.sin(t * 1.5 + i * 0.2) * 0.03;
          const rx = set.rx * W * (0.22 + ratio * 0.78) * (1 + wobble);
          const ry = set.ry * H * (0.22 + ratio * 0.78) * (1 - wobble);

          const breathe = 1 + Math.sin(t * 0.9 + i * 0.35 + si * 1.2) * 0.006;

          const ddx = mx - cx;
          const ddy = my - (cy - scrollYOffset);
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          const maxR = Math.max(W, H) * 0.72;
          const inf = Math.max(0, 1 - dist / maxR);
          const inf2 = inf * inf;

          const baseA = 0.09 + ratio * 0.07;
          const alpha = Math.min(baseA + inf2 * 0.42, 0.58);
          const lw = 0.6 + inf2 * 2.0;

          bgCtx.save();
          bgCtx.translate(cx, cy - scrollYOffset);
          bgCtx.rotate(rot);
          bgCtx.beginPath();
          bgCtx.ellipse(0, 0, rx * breathe, ry * breathe, 0, Math.PI * 2, 0);
          bgCtx.strokeStyle = `rgba(255,255,255,${alpha})`;
          bgCtx.lineWidth = lw;
          bgCtx.stroke();
          bgCtx.restore();
        }
      });

      stars.forEach(st => {
        const twinkle = st.baseA + Math.sin(t * st.speed + st.phase) * 0.18;
        const alpha = Math.max(0.05, Math.min(twinkle, 0.85));
        const sdx = mx - st.x, sdy = my - st.y;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        const boost = sdist < 200 ? (1 - sdist / 200) * 0.35 : 0;
        bgCtx.beginPath();
        bgCtx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(255,255,255,${Math.min(alpha + boost, 0.9)})`;
        bgCtx.fill();
      });

      if (mx > 0 && my > 0) {
        const g = bgCtx.createRadialGradient(mx, my, 0, mx, my, 300);
        g.addColorStop(0, 'rgba(255,255,255,.045)');
        g.addColorStop(0.45, 'rgba(255,255,255,.012)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        bgCtx.fillStyle = g;
        bgCtx.fillRect(0, 0, W, H);
      }

      animationFrameId = requestAnimationFrame(drawBg);
    }
    drawBg();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} aria-hidden="true" />;
}

function CursorVignette() {
  const vigRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (vigRef.current) {
        vigRef.current.style.setProperty('--mx', e.clientX + 'px');
        vigRef.current.style.setProperty('--my', e.clientY + 'px');
        vigRef.current.style.background = `radial-gradient(380px circle at ${e.clientX}px ${e.clientY}px,
        rgba(255,255,255,.055) 0%,
        rgba(255,255,255,.018) 35%,
        transparent 72%)`;
        vigRef.current.classList.add('visible');
      }
    };
    const handleMouseLeave = () => {
      if (vigRef.current) vigRef.current.classList.remove('visible');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div id="cursor-vignette" ref={vigRef} aria-hidden="true" />;
}

const programsData = [
  {
    time: '~4 hours total', by: 'Adaptive AI Agent', note: 'Powered by Model: Adaptive-GPT-4',
    desc: 'A structured 4-day program to sharpen interview skills, build confidence, and communicate your experience with clarity and impact.',
    days: [
      { l: 'Day 01', t: 'Foundations & Mindset', d: 'Introduction to structured thinking, setting your narrative, and crafting your story.' },
      { l: 'Day 02', t: 'Problem Solving', d: 'STAR method deep-dive, tackling ambiguous questions, and demonstrating analytical clarity.' },
      { l: 'Day 03', t: 'Communication & Presence', d: 'Concise articulation, managing nerves, and projecting confidence under pressure.' },
      { l: 'Day 04', t: 'Mock Interview & Review', d: 'Live simulation, AI feedback analysis, and targeted improvement areas.' },
    ]
  },
  {
    time: '~6 hours total', by: 'Senior AI Evaluator', note: 'Powered by Model: TechEval-Pro',
    desc: 'A rigorous program for engineers covering system design, coding interviews, and distributed systems concepts.',
    days: [
      { l: 'Day 01', t: 'Data Structures & Algorithms', d: 'Arrays, trees, graphs — solving problems efficiently with optimal time/space complexity.' },
      { l: 'Day 02', t: 'System Design Fundamentals', d: 'Scalability, CAP theorem, caching strategies, and designing for high availability.' },
      { l: 'Day 03', t: 'Behavioral + Technical Blend', d: 'Navigating both sides of the interview — leadership principles paired with technical depth.' },
      { l: 'Day 04', t: 'Live Coding & Review', d: 'Real-time problem solving with AI coaching, edge case analysis, and optimization review.' },
    ]
  },
  {
    time: '~3 hours total', by: 'Executive Coach AI', note: 'Powered by Model: LeaderGPT',
    desc: 'Purpose-built for senior roles — strategic thinking, stakeholder influence, cross-functional leadership, and executive presence.',
    days: [
      { l: 'Day 01', t: 'Executive Presence', d: 'How to command a room, communicate vision, and establish credibility quickly.' },
      { l: 'Day 02', t: 'Strategic Decision Making', d: 'Frameworks for data-driven decisions, trade-offs at scale, and risk communication.' },
      { l: 'Day 03', t: 'Stakeholder Management', d: 'Navigating organizational complexity, influencing without authority, and building consensus.' },
      { l: 'Day 04', t: 'Simulation & Debrief', d: 'Panel interview simulation with real-time AI coaching and personalized improvement plan.' },
    ]
  }
];

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

function MagneticLink({ className, children, href, ...props }) {
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
    <a
      ref={btnRef}
      className={className}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </a>
  );
}

import MoonScene from './MoonScene';

function App() {
  const [cur, setCur] = useState(0);
  const [isIn, setIsIn] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const progRef = useRef(null);
  const [isProgIn, setIsProgIn] = useState(false);
  const [stats, setStats] = useState({ q: 0, m: 0, p: 0 });

  useEffect(() => {
    const splashDuration = 1800;

    // Splash screen timing
    setTimeout(() => {
      setSplashVisible(false);
    }, splashDuration);

    // Initial hero launch
    setTimeout(() => setIsIn(true), splashDuration + 400);

    // Stats counter
    setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      const targets = { q: 10, m: 30, p: 3 };
      
      const step = (now) => {
        const pct = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        setStats({
          q: Math.round(ease * targets.q),
          m: Math.round(ease * targets.m),
          p: Math.round(ease * targets.p)
        });
        if (pct < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, splashDuration + 1300);

    // Observer for programs section
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsProgIn(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    
    if (progRef.current) observer.observe(progRef.current);
    
    return () => observer.disconnect();
  }, []);

  const [scrollY, setScrollY] = useState(0);
  const [dir, setDir] = useState('next');
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = () => {
    setDir('next');
    setCur(c => (c + 1) % programsData.length);
  };
  const handlePrev = () => {
    setDir('prev');
    setCur(c => (c - 1 + programsData.length) % programsData.length);
  };

  // Parallax transform
  const heroH1Transform = `translateY(${Math.min(scrollY / window.innerHeight, 1) * -50}px)`;
  const heroBodyTransform = `translateY(${Math.min(scrollY / window.innerHeight, 1) * -24}px)`;

  const p = programsData[cur];

  return (
    <>
      <div className={`splash-screen ${splashVisible ? '' : 'hidden'}`}>
        <img src="/logo-outline.png" alt="ABTalks Logo" className="splash-logo" />
      </div>

      <CursorVignette />
      <CanvasBackground />

      <header className={`topbar ${isIn ? 'in' : ''}`} id="topbar">
        <div className="topbar-inner">
          <div className="header-left" style={{ flex: 1, display: 'flex' }}>
            <a className="brand" href="/" aria-label="ABTalks home">
              <img src="/logo.png" alt="ABTalks Logo" style={{ height: '48px', filter: 'invert(1)' }} />
            </a>
          </div>
          <nav className="stage-nav" aria-label="Main navigation">
            <a className="active" href="/">Programs</a>
            <a href="/interview">Interview</a>
          </nav>
          <div className="header-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <MagneticButton className="account-btn" id="userAccount">
              <span className="account-dot"></span>
              Account of user
            </MagneticButton>
          </div>
        </div>
      </header>

      <section className="hero-section" id="hero">
        <div className={`hero-inner ${isIn ? 'in' : ''}`} id="heroInner">
          <div className="hero-split">
            <div className="hero-text-col">
              <h1 className="hero-h1" style={{ transform: heroH1Transform }}>
                <span className="clip-line">
                  <span className="clip-inner">Step into your next role</span>
                </span>
                <span className="clip-line">
                  <span className="clip-inner"><em>with absolute certainty.</em></span>
                </span>
              </h1>



              <div className={`hero-ctas ${isIn ? 'in' : ''}`}>
                <a className="button primary" href="/interview">Start Interview&thinsp;→</a>
              </div>

              <div className={`hero-stats ${isIn ? 'in' : ''}`}>
                <div className="stat-item">
                  <div className="stat-num">{stats.q}</div>
                  <div className="stat-label">Questions per session</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{stats.m}</div>
                  <div className="stat-label">Minutes average</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{stats.p}</div>
                  <div className="stat-label">Program tracks</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">AI</div>
                  <div className="stat-label">Adaptive model</div>
                </div>
              </div>
            </div>

            <div className="hero-moon-col">
              <MoonScene />
            </div>
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <section className="programs-section" id="programs" ref={progRef}>
        <div className="prog-heading-row">
          <div className="prog-clip-wrap">
            <span className={`prog-title ${isProgIn ? 'in' : ''}`}>Programs.</span>
          </div>
          <div className={`prog-meta-right ${isProgIn ? 'in' : ''}`}>
            <div className="prog-track-count">Available tracks</div>
            <span className="prog-track-num">{programsData.length}</span>
          </div>
        </div>

        <div className={`carousel-stage ${isProgIn ? 'in' : ''}`} role="region" aria-label="Program carousel">
          <MagneticButton className="carousel-arrow" aria-label="Previous program" onClick={handlePrev}>←</MagneticButton>

          <article key={cur} className={`program-card animate-${dir}`}>
            <div className="program-topics">
              <p className="program-topics-title">Sub-Topics · Day-wise Program</p>
              {p.days.map((day, i) => (
                <div key={i} className="day-row" style={{ animationDelay: `${200 + i * 60}ms` }}>
                  <span className="day-num">{day.l}</span>
                  <div className="day-content">
                    <strong>{day.t}</strong>
                    <small>{day.d}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="program-meta">
              <p className="program-meta-title">Program Details</p>
              <div className="meta-row" style={{ animationDelay: '300ms' }}><span>Time</span><strong>{p.time}</strong></div>
              <div className="meta-row" style={{ animationDelay: '360ms' }}><span>Conducted by</span><strong>{p.by}</strong><small>{p.note}</small></div>
              <div className="meta-row" style={{ animationDelay: '420ms' }}><span>Description</span><small>{p.desc}</small></div>
              
              <div className="program-heading" style={{ animationDelay: '500ms' }}>
                <span className="prog-pill">{p.tag}</span>
                <h3 className="prog-h3">{p.title}</h3>
              </div>
              <div className="meta-spacer"></div>
              <MagneticLink className="access-btn" href="/interview" style={{ animationDelay: '600ms' }}>Access to program →</MagneticLink>
            </div>
          </article>

          <MagneticButton className="carousel-arrow" aria-label="Next program" onClick={handleNext}>→</MagneticButton>
        </div>

        <div className="carousel-indicators" role="tablist" style={{ marginTop: '24px' }}>
          {programsData.map((_, i) => (
            <button 
              key={i} 
              className={`carousel-dot ${i === cur ? 'active' : ''}`} 
              onClick={() => setCur(i)} 
              role="tab" 
              aria-selected={i === cur}
              aria-label={`Program ${i + 1}`} 
            />
          ))}
        </div>
      </section>


    </>
  );
}

export default App;
