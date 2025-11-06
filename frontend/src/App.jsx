// src/App.jsx
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import LevelPage from "./pages/LevelPage";
import Home from "./pages/Home"
import BackgroundWrapper from "./components/BackgroundWrapper";


export default function App() {
  return (
    <BrowserRouter>
    <BackgroundWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/about" element={< About/>}/>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 👇👇👇 THE FIX: Captures BOTH category and levelId parameters 👇👇👇 */}
        <Route path="/levels/:category/:levelId" element={<LevelPage />} />
        
        {/* catch-all */}
        <Route path="*" element={<div style={{ padding: 24, color: "#000" }}>Page not found</div>} />
      </Routes>
    </BackgroundWrapper>
    </BrowserRouter>
  );
}
