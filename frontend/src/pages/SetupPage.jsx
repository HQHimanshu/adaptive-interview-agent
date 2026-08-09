import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';

export default function SetupPage() {
  const navigate = useNavigate();
  const { startNewSession } = useInterview();
  const [isIn, setIsIn] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    jobRole: '',
    yearsExperience: '',
    education: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Small delay to allow CSS transitions
    setTimeout(() => setIsIn(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your full name.";
    if (!formData.jobRole.trim()) newErrors.jobRole = "Please enter your current or target role.";
    if (formData.yearsExperience === '' || isNaN(formData.yearsExperience)) newErrors.yearsExperience = "Please enter valid years of experience.";
    if (!formData.education.trim()) newErrors.education = "Please enter your educational background.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Generate a unique session ID
    const sessionId = 'sess-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();

    // Map strictly to candidates.json schema
    const candidate = {
      member: {
        id: 'CAND-' + Math.floor(Math.random() * 10000), // Mock ID
        name: formData.name,
        jobRole: formData.jobRole,
        yearsExperience: parseInt(formData.yearsExperience, 10),
        education: formData.education,
        status: "IN_PROGRESS"
      }
    };

    // Save to context and navigate to interview
    startNewSession(sessionId, candidate);
    navigate('/interview');
  };

  return (
    <div className={`page-container setup-page ${isIn ? 'in' : ''}`}>
      <div className="setup-header">
        <button className="back-link" onClick={() => navigate('/')}>
          ← BACK
        </button>
        <span className="brand-label">ADAPTIVE INTERVIEW</span>
      </div>

      <div className="setup-content">
        <div className="setup-title-box">
          <h1 className="setup-h1">Before we begin</h1>
          <p className="setup-desc">
            Tell us about yourself. This information helps the interviewer adapt the technical conversation to your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form" noValidate>
          <div className="form-section">
            <h3 className="section-heading">PERSONAL INFORMATION</h3>
            
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g. Sarah Johnson"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-heading">EXPERIENCE</h3>
            
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="jobRole">Job Role</label>
                <input 
                  type="text" 
                  id="jobRole" 
                  name="jobRole" 
                  value={formData.jobRole} 
                  onChange={handleChange}
                  placeholder="e.g. Senior Data Engineer"
                  className={errors.jobRole ? 'error' : ''}
                />
                {errors.jobRole && <div className="error-text">{errors.jobRole}</div>}
              </div>

              <div className="input-group">
                <label htmlFor="yearsExperience">Years of Experience</label>
                <input 
                  type="number" 
                  id="yearsExperience" 
                  name="yearsExperience" 
                  min="0"
                  max="50"
                  value={formData.yearsExperience} 
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className={errors.yearsExperience ? 'error' : ''}
                />
                {errors.yearsExperience && <div className="error-text">{errors.yearsExperience}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-heading">EDUCATION</h3>
            
            <div className="input-group">
              <label htmlFor="education">Degree / Field of Study</label>
              <input 
                type="text" 
                id="education" 
                name="education" 
                value={formData.education} 
                onChange={handleChange}
                placeholder="e.g. MS Computer Science"
                className={errors.education ? 'error' : ''}
              />
              {errors.education && <div className="error-text">{errors.education}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary cta-btn">
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
