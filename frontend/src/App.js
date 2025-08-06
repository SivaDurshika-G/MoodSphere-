import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms'
import './assets/styles/App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path= "/privacy" element={<Privacy/>}/>
        <Route path= "/terms" element={<Terms/>}/>
      </Routes>
    </Router>
  );
}
