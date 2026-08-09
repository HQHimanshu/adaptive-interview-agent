import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../lib/storage';
import { useInterview } from '../../context/InterviewContext';
import curriculumData from '../../data/curriculum.json';
import './CandidateForm.css';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const CandidateForm = () => {
  const navigate = useNavigate();
  const { startNewSession } = useInterview();
  
  const [formData, setFormData] = useState({
    name: '',
    jobRole: '',
    yearsExperience: '3',
    education: ''
  });
  
  // Default to selecting days from Module 1 & 2 or first 6 days
  const [selectedDayIds, setSelectedDayIds] = useState([1, 2, 3, 7, 8, 10, 12, 16]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleDayToggle = (dayNumber) => {
    setSelectedDayIds(prev => {
      if (prev.includes(dayNumber)) {
        if (prev.length === 1) return prev; // Keep at least one mission selected
        return prev.filter(id => id !== dayNumber);
      } else {
        return [...prev, dayNumber].sort((a, b) => a - b);
      }
    });
  };

  const selectAllMissions = () => {
    setSelectedDayIds(curriculumData.days.map(d => d.day));
  };

  const selectFoundationMissions = () => {
    setSelectedDayIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.jobRole.trim()) {
      setError('Please enter your target or current job role.');
      return;
    }
    if (!formData.education.trim()) {
      setError('Please enter your educational background.');
      return;
    }

    const selectedMissions = curriculumData.days
      .filter(d => selectedDayIds.includes(d.day))
      .map(d => ({
        day: d.day,
        title: d.title,
        passed: true,
        attempts: 1
      }));

    const candidatePayload = {
      member: {
        id: `CAND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        name: formData.name.trim(),
        jobRole: formData.jobRole.trim(),
        yearsExperience: Number(formData.yearsExperience) || 1,
        education: formData.education.trim(),
        status: 'ACTIVE'
      },
      missions: selectedMissions,
      signals: {
        commitDays: Math.min(Math.max(selectedMissions.length * 3, 5), 31),
        missionsCompleted: selectedMissions.length,
        missionsFirstTry: selectedMissions.length
      }
    };

    // Generate deterministic session ID
    const sessionId = 'ABT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Save to local storage
    createSession(candidatePayload, sessionId);
    
    // Update context
    startNewSession(sessionId, candidatePayload);
    
    // Navigate to interview session
    navigate(`/interview/session?id=${sessionId}`);
  };

  return (
    <div className="candidate-form-container">
      <div className="candidate-form-card">
        <div className="form-step">Step 1 of 2 &middot; Candidate details</div>
        
        <h1 className="form-title">Before we begin</h1>
        <p className="form-subtitle">
          Tell us a little about yourself. This personalizes the interview and generates your unique session ID.
        </p>
        
        <form onSubmit={handleSubmit} className="candidate-form">
          {/* Profile Details Section */}
          <div className="form-section">
            <h2 className="section-title-sm">Profile Details</h2>
            
            <div className="form-group">
              <label className="form-label-clean">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="form-input-clean" 
                placeholder="e.g. Jane Doe" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label-clean">Job Role</label>
              <input 
                type="text" 
                name="jobRole" 
                value={formData.jobRole} 
                onChange={handleChange} 
                className="form-input-clean" 
                placeholder="e.g. Frontend Developer" 
                required 
              />
            </div>
            
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label-clean">Years Experience</label>
                <input 
                  type="number" 
                  name="yearsExperience" 
                  value={formData.yearsExperience} 
                  onChange={handleChange} 
                  className="form-input-clean" 
                  placeholder="e.g. 3" 
                  min="0"
                  max="50"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label-clean">Education</label>
                <input 
                  type="text" 
                  name="education" 
                  value={formData.education} 
                  onChange={handleChange} 
                  className="form-input-clean" 
                  placeholder="e.g. BS Computer Science" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          {/* Completed Missions Section */}
          <div className="form-section">
            <div className="section-header-row">
              <div>
                <h2 className="section-title-sm">Completed Missions</h2>
                <p className="section-desc">Select the missions the candidate successfully passed.</p>
              </div>
              <div className="quick-actions">
                <button type="button" onClick={selectAllMissions} className="btn-link">All (31)</button>
                <button type="button" onClick={selectFoundationMissions} className="btn-link">Days 1–10</button>
              </div>
            </div>
            
            <div className="missions-scroll-list">
              {curriculumData.days.map(d => {
                const isChecked = selectedDayIds.includes(d.day);
                return (
                  <label key={d.day} className={`mission-item-card ${isChecked ? 'selected' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => handleDayToggle(d.day)} 
                      className="mission-checkbox"
                    />
                    <span className="mission-day-badge">Day {d.day}</span>
                    <span className="mission-title-text">{d.title}</span>
                  </label>
                );
              })}
            </div>
            <div className="mission-count-badge">
              {selectedDayIds.length} of {curriculumData.days.length} missions selected
            </div>
          </div>

          {error && (
            <div className="form-error-banner">
              {error}
            </div>
          )}
          
          <button type="submit" className="btn btn-primary btn-submit-hero">
            Start interview <ArrowRightIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
