import React from 'react';
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
