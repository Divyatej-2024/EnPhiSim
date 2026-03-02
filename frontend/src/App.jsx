// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProgressProvider } from "./context/ProgressContext";
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
  const hasConsented = localStorage.getItem('consentGiven') === 'true';
  
  React.useEffect(() => {
    if (!localStorage.getItem('sessionId')) {
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
  }, []);

  return (
    <BrowserRouter>
      <BackgroundWrapper>
        <ProgressProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Consent />} />
              <Route path="/home" element={<Home />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/about" element={<About />} />
              <Route path="/levels/:category/:level_no" element={<LevelPage />} />
              <Route 
                path="/game" 
                element={hasConsented ? <PhishingGame /> : <Navigate to="/" replace />} 
              />
              <Route 
                path="/dashboard" 
                element={hasConsented ? <Dashboard /> : <Navigate to="/" replace />} 
              />
              <Route path="/thankyou" element={<Thankyou />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ProgressProvider>
      </BackgroundWrapper>
    </BrowserRouter>
  );
}