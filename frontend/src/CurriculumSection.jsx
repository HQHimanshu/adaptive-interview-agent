import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import curriculumData from './data/curriculum.json';
import OrbitalMoon from './OrbitalMoon';
import DayDetailModal from './DayDetailModal';

const DESKTOP_X_PATTERN = [
  15, 35, 60, 80, 75, 40, 20, 25, 55, 80, 70, 30, 15, 25, 50, 75, 85, 65, 35, 15, 25, 55, 80, 65, 40, 20, 35, 65, 85, 70, 45, 50
];

export default function CurriculumSection() {
  const [activeModule, setActiveModule] = useState(1);
  const [expandedModule, setExpandedModule] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const containerRef = useRef();
  const trackNodesRef = useRef([]);
  const [pathData, setPathData] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  // Measure nodes and generate SVG path
  useLayoutEffect(() => {
    const updatePath = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const points = [];
      
      // Get all non-null nodes in visual order
      const validNodes = trackNodesRef.current.filter(Boolean);
      
      validNodes.forEach(node => {
        const dot = node.querySelector('.node-dot') || node;
        const rect = dot.getBoundingClientRect();
        const x = (rect.left - containerRect.left) + rect.width / 2;
        const y = (rect.top - containerRect.top) + rect.height / 2;
        points.push({ x, y });
      });

      if (points.length < 2) {
        setPathData('');
        return;
      }

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i-1];
        const midY = (prev.y + curr.y) / 2;
        d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
      }
      setPathData(d);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    const timeout = setTimeout(updatePath, 150);
    
    return () => {
      window.removeEventListener('resize', updatePath);
      clearTimeout(timeout);
    };
  }, [expandedModule]); // Re-run when expanded module changes

  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathData]);

  // Overall scroll progress observer for the entire curriculum section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the container
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;
      
      // Progress from 0 to 1
      let progress = -rect.top / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [expandedModule]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const progressOffset = pathLength - (pathLength * scrollProgress);

  // We will re-build the track nodes array on each render
  trackNodesRef.current = [];

  return (
    <section className="curriculum-section" id="curriculum">
      
      <div className="curriculum-anchor">
        <div className="curriculum-moon-wrap" style={{
          // Move the moon vertically based on scroll progress to make it orbit alongside the user
          transform: `translateY(${scrollProgress * 200 - 100}px)`
        }}>
          <OrbitalMoon scrollProgress={scrollProgress} />
        </div>
      </div>

      <div className="curriculum-content">
        
        {/* NEW GREETING AND INTERVIEW CTA */}
        <div className="curriculum-header">
          <div className="curriculum-greeting">
            <span className="greeting-badge">SECURE YOUR FUTURE</span>
            <h2 className="curriculum-h2">Welcome to the Cohort</h2>
            <p className="greeting-text">Your 31-day immersive journey to becoming a top-tier AI Engineer begins here. Build, learn, integrate, and deploy.</p>
            
            <div className="interview-cta-box">
              <div className="cta-text">
                <h3>Wanna check your skills?</h3>
                <p>Take an AI-powered mock interview to find your baseline.</p>
              </div>
              <button className="button primary glowing-btn">
                LET'S HAVE AN INTERVIEW →
              </button>
            </div>
          </div>
        </div>

        <div className="roadmap-path-container" ref={containerRef}>
          
          <svg className="svg-track-layer" aria-hidden="true">
            <path d={pathData} className="svg-track-base" />
            {pathLength > 0 && (
              <path 
                ref={pathRef}
                d={pathData} 
                className="svg-track-progress" 
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: progressOffset,
                }}
              />
            )}
          </svg>

          {curriculumData.modules.map((module, mIndex) => {
            const isExpanded = expandedModule === module.n;
            
            const moduleDays = curriculumData.days.filter(
              d => d.day >= module.days[0] && d.day <= module.days[1]
            );

            // Module Node X position (keeps it centered or slightly offset)
            const modX = isMobile ? 25 : 50;
            
            return (
              <div key={`mod-${module.n}`} className="roadmap-module-group">
                
                {/* Module Checkpoint Node */}
                <div 
                  className={`roadmap-day-node f1-node module-checkpoint ${isExpanded ? 'active' : ''}`}
                  ref={el => { if(el) trackNodesRef.current.push(el); }}
                  onClick={() => setExpandedModule(isExpanded ? null : module.n)}
                  onMouseEnter={() => setExpandedModule(module.n)}
                  style={{ 
                    left: `${modX}%`, 
                    transform: 'translateX(-50%)',
                    flexDirection: 'row',
                    paddingBottom: isExpanded ? '64px' : '40px'
                  }}
                >
                  <div className="node-dot module-dot">
                    <div className="module-dot-inner" />
                  </div>
                  <div className="node-content module-content">
                    <span className="module-num">MODULE {String(module.n).padStart(2, '0')}</span>
                    <h3 className="module-title-node">{module.title.toUpperCase()}</h3>
                  </div>
                </div>

                {/* Days inside the module */}
                {isExpanded && (
                  <div className="module-days-expanded animated-expand">
                    {moduleDays.map((day, dIndex) => {
                      const isCapstone = day.day === 31;
                      const globalIndex = day.day - 1;
                      
                      const desktopX = DESKTOP_X_PATTERN[globalIndex] || 50;
                      const mobileX = 15 + Math.sin(day.day) * 10;
                      const xPos = isMobile ? mobileX : desktopX;
                      const isRightSide = xPos > 50;

                      return (
                        <div 
                          key={`day-${day.day}`}
                          ref={el => { if(el) trackNodesRef.current.push(el); }}
                          className={`roadmap-day-node f1-node day-checkpoint ${isCapstone ? 'capstone-node' : ''}`}
                          onClick={() => setSelectedDay(day)}
                          style={{ 
                            left: `${xPos}%`, 
                            transform: isRightSide ? 'translateX(-100%)' : 'none',
                            flexDirection: isRightSide ? 'row-reverse' : 'row'
                          }}
                        >
                          <div className="node-dot" style={{ 
                            left: isRightSide ? 'auto' : 0, 
                            right: isRightSide ? 0 : 'auto',
                            transform: isRightSide ? 'translate(50%, -12px)' : 'translate(-50%, -12px)'
                          }}>
                            {isCapstone ? <div className="capstone-inner" /> : null}
                          </div>
                          
                          <div className="node-content" style={{ 
                            marginLeft: isRightSide ? 0 : '24px',
                            marginRight: isRightSide ? '24px' : 0,
                            textAlign: isRightSide ? 'right' : 'left',
                            transformOrigin: isRightSide ? 'right center' : 'left center'
                          }}>
                            <div className="node-day-label">DAY {String(day.day).padStart(2, '0')}</div>
                            {isCapstone && <div className="capstone-label">CAPSTONE PROJECT</div>}
                            <div className="node-day-title">{day.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <DayDetailModal dayData={selectedDay} isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} />
    </section>
  );
}
