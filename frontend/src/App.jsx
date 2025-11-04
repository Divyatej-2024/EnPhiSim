import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

// Easy levels
import L1 from "./pages/levels/easy/l1";
import L2 from "./pages/levels/easy/l2";
import L3 from "./pages/levels/easy/l3";

// Normal levels
import L13 from "./pages/levels/normal/l13";
import L14 from "./pages/levels/normal/l14";

// Hard levels
import L24 from "./pages/levels/hard/l24";

// Bonus
import BL1 from "./pages/levels/bonus levels/bl1";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />

        {/* Easy Levels */}
        <Route path="/levels/easy/l1" element={<L1 />} />
        <Route path="/levels/easy/l2" element={<L2 />} />
        <Route path="/levels/easy/l3" element={<L3 />} />

        {/* Normal */}
        <Route path="/levels/normal/l13" element={<L13 />} />
        <Route path="/levels/normal/l14" element={<L14 />} />

        {/* Hard */}
        <Route path="/levels/hard/l24" element={<L24 />} />

        {/* Bonus */}
        <Route path="/levels/bonus/bl1" element={<BL1 />} />

        {/* 404 fallback */}
        <Route path="*" element={<h1 style={{ color: "red", textAlign: "center" }}>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
