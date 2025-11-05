// src/App.jsx
import React from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disclaimer from "./pages/Disclaimer";
import Dashboard from "./pages/Dashboard";
import LevelPage from "./pages/LevelPage";
import Home from "./pages/Home"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 👇👇👇 THE FIX: Captures BOTH category and levelId parameters 👇👇👇 */}
        <Route path="/levels/:category/:levelId" element={<LevelPage />} />
        
        {/* catch-all */}
        <Route path="*" element={<div style={{ padding: 24, color: "#fff" }}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
