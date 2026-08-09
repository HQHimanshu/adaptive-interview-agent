import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ProgramOverview from './pages/Program/ProgramOverview';
import ModuleDetails from './pages/Program/ModuleDetails';
import CandidateForm from './pages/Interview/CandidateForm';
import InterviewSession from './pages/Interview/InterviewSession';
import Dashboard from './pages/Candidates/Dashboard';

import './index.css';
import { InterviewProvider } from './context/InterviewContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <img src="/logo.png" alt="AB Talks Logo" className="splash-logo" />
      </div>
    );
  }

  return (
    <InterviewProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="program" element={<ProgramOverview />} />
          <Route path="program/:id" element={<ModuleDetails />} />
          <Route path="interview" element={<CandidateForm />} />
          <Route path="interview/session" element={<InterviewSession />} />
          <Route path="candidates" element={<Dashboard />} />
        </Route>
      </Routes>
    </InterviewProvider>
  );
}

export default App;
