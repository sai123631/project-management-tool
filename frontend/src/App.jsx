import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
          Project Nexus
        </h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
