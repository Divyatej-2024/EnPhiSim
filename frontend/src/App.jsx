// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
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
        <div className="App">
          <Routes>
            {/* Public routes - NO CONSENT NEEDED */}
            <Route path="/" element={<Consent />} />
            <Route path="/home" element={<Home />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/about" element={<About />} />
            
            {/* Level routes - with parameters */}
            <Route path="/levels/:category/:level_no" element={<LevelPage />} />
            
            {/* Protected routes - NEED CONSENT */}
            <Route 
              path="/game" 
              element={hasConsented ? <PhishingGame /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/dashboard" 
              element={hasConsented ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            
            {/* Thank you page */}
            <Route path="/thankyou" element={<Thankyou />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}