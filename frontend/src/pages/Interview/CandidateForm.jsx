import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../lib/storage';
import curriculumData from '../../data/curriculum.json';
import './CandidateForm.css';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const levels = ['Entry', 'Junior', 'Mid', 'Senior', 'Lead'];

const CandidateForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'AI Engineer',
    experience: 'Mid',
    focusArea: curriculumData.modules[0].title
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelSelect = (level) => {
    setFormData(prev => ({ ...prev, experience: level }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill out your name and email.');
      return;
    }
    
    // Create session in mock DB
    const session = createSession(formData);
    
    // Navigate to interview session with ID
    navigate(`/interview/session?id=${session.id}`);
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
          <div className="form-group">
            <label className="form-label"><UserIcon /> FULL NAME</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder=" " required />
          </div>
          
          <div className="form-group">
            <label className="form-label"><MailIcon /> EMAIL</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@email.com" required />
          </div>
          
          <div className="form-group">
            <label className="form-label"><BriefcaseIcon /> TARGET ROLE</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label"><ClockIcon /> EXPERIENCE LEVEL</label>
            <div className="level-selector">
              {levels.map(level => (
                <button type="button" key={level} onClick={() => handleLevelSelect(level)} className={`level-btn ${level === formData.experience ? 'active' : ''}`}>
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label"><TargetIcon /> FOCUS AREA</label>
            <select name="focusArea" value={formData.focusArea} onChange={handleChange} className="form-input select-input">
              {curriculumData.modules.map(mod => (
                <option key={mod.n} value={mod.title}>Module {mod.n}: {mod.title}</option>
              ))}
            </select>
          </div>

          {error && <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px', background: '#fee2e2', padding: '12px', borderRadius: '8px' }}>{error}</div>}
          
          <button type="submit" className="btn btn-primary btn-submit">
            Start interview <ArrowRightIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
