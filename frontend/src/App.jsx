// src/App.jsx
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import LevelPage from "./pages/LevelPage";
import Home from "./pages/Home";
import Consent from './pages/Consent';
import PhishingGame from './pages/PhishingGame';
import Thankyou from "./pages/Thankyou";
import './App.css';
import BackgroundWrapper from "./components/BackgroundWrapper";

function App() {
  // Check if user has consented
  const hasConsented = localStorage.getItem('consentGiven') === 'true';
  
  // Generate session ID if not exists
  React.useEffect(() => {
    if (!localStorage.getItem('sessionId')) {
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
  }, []);

  return (
    <BrowserRouter>
    <BackgroundWrapper>
    <div className="App">
        <Routes>
          <Route path="/" element={<Consent />} />
          <Route 
            path="/game" 
            element={hasConsented ? <PhishingGame /> : <Navigate to="/" />} 
          />
          <Route 
            path="/dashboard" 
            element={hasConsented ? <Dashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
          </BackgroundWrapper>
    </BrowserRouter>
  );
}
