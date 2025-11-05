// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disclaimer from "./pages/Disclaimer";
import Dashboard from "./pages/Dashboard";
import LevelPage from "./pages/LevelPage";
import Home from "./pages/Home"


// static redirects
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* easy */}
        <Route path="/levels/easy/:levelId" element={<LevelPage />} />
        {/* adv_easy */}
        <Route path="/levels/adv_easy/:levelId" element={<LevelPage />} />
        {/* normal */}
        <Route path="/levels/normal/:levelId" element={<LevelPage />} />
        {/* prehard */}
        <Route path="/levels/prehard/:levelId" element={<LevelPage />} />
        {/* hard */}
        <Route path="/levels/hard/:levelId" element={<LevelPage />} />
        {/* adv_hard */}
        <Route path="/levels/adv_hard/:levelId" element={<LevelPage />} />
        {/* final */}
        <Route path="/levels/final/:levelId" element={<LevelPage />} />
        {/* bonus */}
        <Route path="/levels/bonus/:levelId" element={<LevelPage />} />

        {/* catch-all */}
        <Route path="*" element={<div style={{ padding: 24, color: "#fff" }}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
