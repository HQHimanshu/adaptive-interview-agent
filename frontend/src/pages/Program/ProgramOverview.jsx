import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModuleDetails from './ModuleDetails';
import './ProgramOverview.css';

import curriculumData from '../../data/curriculum.json';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);

const ProgramOverview = () => {
  const [activeModule, setActiveModule] = useState('1');
  
  return (
    <div className="program-container">
      <div className="badge program-badge">
        <SparklesIcon /> {curriculumData.cohort}
      </div>
      
      <h1 className="program-title">The 31-day program</h1>
      <p className="program-subtitle">
        A structured, day-by-day path from environment setup to a production-grade<br/>
        agentic chatbot. Pick a module to explore its days, tools, and objectives.
      </p>
      
      <div className="module-grid">
        {curriculumData.modules.map(mod => {
          const modId = mod.n.toString();
          const numDays = mod.days[1] - mod.days[0] + 1;
          const duration = `Days ${mod.days[0]}-${mod.days[1]} \u00b7 ${numDays} days`;
          
          return (
            <div key={modId} className={`module-card ${modId === activeModule ? 'active' : ''}`} onClick={() => setActiveModule(modId)} style={{ cursor: 'pointer' }}>
              <div className="module-card-header">
                <span className="module-num">{modId.padStart(2, '0')}</span>
                <span className="module-icon"><LayersIcon /></span>
              </div>
              <div className="module-card-body">
                <h3 className="module-card-title">{mod.title}</h3>
                <p className="module-card-duration">{duration}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show ModuleDetails based on local state */}
      <ModuleDetails id={activeModule} />
    </div>
  );
};

export default ProgramOverview;
