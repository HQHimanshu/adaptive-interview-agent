import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

// Feature Icons
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>
);

const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
);

const NodesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
);

const GaugeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 16A10 10 0 1 1 20.66 16" /></svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <div className="home-container">
        <div className="badge">
          <SparklesIcon /> AI Cohort &middot; 31 days &middot; 8 modules
        </div>

        <h1 className="hero-title">
          Technical interviews,<br />
          <span className="gradient-text">conducted by AI.</span>
        </h1>

        <p className="hero-subtitle">
          AB Talks runs adaptive technical interviews that meet every<br className="hide-mobile" />
          candidate where they are. Answer at least eight questions, then<br className="hide-mobile" />
          receive structured feedback aligned to a real 31-day AI Engineering<br className="hide-mobile" />
          program.
        </p>

        <div className="hero-actions">
          <Link to="/interview" className="btn btn-primary btn-lg">
            Start your interview <ArrowRightIcon />
          </Link>
          <Link to="/program" className="btn btn-outline btn-lg">
            Explore the program
          </Link>
        </div>

        <div className="features-list">
          <span><CheckIcon /> Adaptive questions</span>
          <span><CheckIcon /> Unique session ID</span>
          <span><CheckIcon /> Structured feedback</span>
          <span><CheckIcon /> Program-aligned next steps</span>
        </div>
      </div>

      {/* Why AB Talks Section */}
      <section className="why-section">
        <div className="section-header">
          <div className="section-eyebrow">WHY AB TALKS</div>
          <h2 className="section-title">An interviewer that adapts to every<br className="hide-mobile" />answer.</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper"><BrainIcon /></div>
            <h3 className="feature-title">Adaptive Questioning</h3>
            <p className="feature-desc">The AI reads every answer in real time and shapes the next question to your level &mdash; going deeper when you're strong, recalibrating when you're not.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><ChatBubbleIcon /></div>
            <h3 className="feature-title">Conversational Interview</h3>
            <p className="feature-desc">A natural chatbot flow that welcomes you, asks a minimum of eight focused technical questions, and keeps a single unique session ID for every attempt.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><ClipboardCheckIcon /></div>
            <h3 className="feature-title">Structured Feedback</h3>
            <p className="feature-desc">Receive a clear evaluation card with a summary, strengths, gaps, and concrete next steps &mdash; mapped directly to program modules and days.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><NodesIcon /></div>
            <h3 className="feature-title">Program-Aligned</h3>
            <p className="feature-desc">Every assessment is benchmarked against the 31-day AI Engineering cohort, so feedback translates into an actionable learning path.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><GaugeIcon /></div>
            <h3 className="feature-title">Quantified Score</h3>
            <p className="feature-desc">Walk away with an overall score and a recommendation you can act on immediately, not vague impressions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><ShieldCheckIcon /></div>
            <h3 className="feature-title">Consistent &amp; Fair</h3>
            <p className="feature-desc">The same structured rubric for every candidate, every time &mdash; reducing bias and keeping evaluations comparable.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-section">
        <div className="section-header">
          <div className="section-eyebrow">HOW IT WORKS</div>
          <h2 className="section-title">Three steps to your evaluation.</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-title">Enter your details</h3>
            <p className="step-desc">Share your name, role, experience level and focus area to personalize the interview.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-title">Interview with the AI</h3>
            <p className="step-desc">The interviewer welcomes you and asks at least eight adaptive technical questions.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-title">Get structured feedback</h3>
            <p className="step-desc">A feedback card appears with summary, strengths, gaps, and program-aligned next steps.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="cta-banner">
          <div className="cta-content">
            <h2 className="cta-title">Ready to be interviewed?</h2>
            <p className="cta-subtitle">It takes about ten minutes. Get feedback you can act on.</p>
          </div>
          <Link to="/interview" className="btn btn-outline btn-lg cta-btn">
            Begin interview <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
