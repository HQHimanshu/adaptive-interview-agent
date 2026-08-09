import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ModuleDetails.css';

import curriculumData from '../../data/curriculum.json';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const ModuleDetails = ({ id }) => {
  const currentModId = id || '1';
  const moduleInfo = curriculumData.modules.find(m => m.n.toString() === currentModId) || curriculumData.modules[0];
  const moduleDays = curriculumData.days.filter(d => d.day >= moduleInfo.days[0] && d.day <= moduleInfo.days[1]);

  return (
    <div className="module-details-container">
      <div className="module-details-header">
        <div className="module-details-title-section">
          <div className="module-eyebrow">MODULE {moduleInfo.n}</div>
          <h2 className="module-title">{moduleInfo.title}</h2>
          <div className="module-duration">
            <CalendarIcon /> Days {moduleInfo.days[0]} to {moduleInfo.days[1]}
          </div>
        </div>
        <div className="module-details-actions">
          <Link to="/interview" className="btn btn-primary">
            Test this module <ArrowRightIcon />
          </Link>
        </div>
      </div>
      
      <div className="days-list">
        {moduleDays.map(day => (
          <div key={day.day} className="day-card">
            <div className="day-card-header">
              <div className="day-badge">
                <span className="day-badge-label">DAY</span>
                <span className="day-badge-num">{day.day}</span>
              </div>
              <h3 className="day-title">{day.title}</h3>
              <button className="btn btn-setup">{day.type || 'SETUP'}</button>
            </div>
            
            <div className="day-card-content">
              <div className="day-tools">
                <h4 className="section-title"><WrenchIcon /> TOOLS</h4>
                <div className="tools-pills">
                  {(day.tools || []).map(tool => (
                    <span key={tool} className="tool-pill">{tool}</span>
                  ))}
                </div>
              </div>
              <div className="day-objectives">
                <h4 className="section-title"><TargetIcon /> OBJECTIVES</h4>
                <ul className="objectives-list">
                  {(day.objectives || []).map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleDetails;
