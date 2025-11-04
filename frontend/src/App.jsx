import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

// Easy levels
import L1 from "./pages/levels/easy/l1";
import L2 from "./pages/levels/easy/l2";
import L3 from "./pages/levels/easy/l3";
import L4 from "./pages/levels/easy/l4";
import L5 from "./pages/levels/easy/l5";
import L6 from "./pages/levels/easy/l6";

//Advanced Easy levels
import L7 from "./pages/levels/advanced easy/l7";
import L8 from "./pages/levels/advanced easy/l8";
import L9 from "./pages/levels/advanced easy/l9";
import L10 from "./pages/levels/advanced easy/l10";
import L11 from "./pages/levels/advanced easy/l11";
import L12 from "./pages/levels/advanced easy/l12";

// Normal levels
import L13 from "./pages/levels/normal/l13";
import L14 from "./pages/levels/normal/l14";
import L15 from "./pages/levels/normal/l15";
import L16 from "./pages/levels/normal/l16";
import L17 from "./pages/levels/normal/l17";
import L18 from "./pages/levels/normal/l18";

// Pre-hard levels
import L19 from "./pages/levels/pre-hard/l19";
import L20 from "./pages/levels/pre-hard/l20";
import L21 from "./pages/levels/pre-hard/l21";
import L22 from "./pages/levels/pre-hard/l22";
import L23 from "./pages/levels/pre-hard/l23";

// Hard levels
import L24 from "./pages/levels/hard/l24";
import L25 from "./pages/levels/hard/l25";
import L26 from "./pages/levels/hard/l26";
import L27 from "./pages/levels/hard/l27";
import L28 from "./pages/levels/hard/l28";

//advanced hard 

import L29 from "./pages/levels/advanced hard/l29";
import L30 from "./pages/levels/advanced hard/l30";
import L31 from "./pages/levels/advanced hard/l31";
import L32 from "./pages/levels/advanced hard/l32";
// Bonus
import BL1 from "./pages/levels/bonus levels/bl1";
import BL2 from "./pages/levels/bonus levels/bl2";
import BL3 from "./pages/levels/bonus levels/bl3";
import BL4 from "./pages/levels/bonus levels/bl4";
import BL5 from "./pages/levels/bonus levels/bl5";
import BL6 from "./pages/levels/bonus levels/bl6";

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
        <Route path="/levels/easy/l4" element={<L4 />} />
        <Route path="/levels/easy/l5" element={<L5 />} />
        <Route path="/levels/easy/l6" element={<L6 />} />

        {/*Advanced Easy */}
        <Route path="/levels/advanced easy/l7" element={<L7 />} />
        <Route path="/levels/advanced easy/l8" element={<L8 />} />
        <Route path="/levels/advanced easy/l9" element={<L9 />} />
        <Route path="/levels/advanced easy/l10" element={<L10 />} />
        <Route path="/levels/advanced easy/l11" element={<L11 />} />
        <Route path="/levels/advanced easy/l12" element={<L12 />} />

        {/* Normal */}
        <Route path="/levels/normal/l13" element={<L13 />} />
        <Route path="/levels/normal/l14" element={<L14 />} />
        <Route path="/levels/normal/l15" element={<L15 />} />
        <Route path="/levels/normal/l16" element={<L16 />} />
        <Route path="/levels/normal/l17" element={<L17 />} />
        <Route path="/levels/normal/l18" element={<L18 />} />

        {/*Pre-Hard*/}
        <Route path="/levels/pre hard/l19" element={<L19 />} />
        <Route path="/levels/pre hard/l20" element={<L20 />} />
        <Route path="/levels/pre hard/l21" element={<L21 />} />
        <Route path="/levels/pre hard/l22" element={<L22 />} />
        <Route path="/levels/pre hard/l23" element={<L23 />} />
        {/* Hard */}
        <Route path="/levels/hard/l24" element={<L24 />} />
        <Route path="/levels/hard/l25" element={<L25 />} />
        <Route path="/levels/hard/l26" element={<L26 />} />
        <Route path="/levels/hard/l27" element={<L27 />} />
        <Route path="/levels/hard/l28" element={<L28 />} />

        {/* Bonus */}
        <Route path="/levels/bonus/bl1" element={<BL1 />} />
        <Route path="/levels/bonus/bl2" element={<BL2 />} />
        <Route path="/levels/bonus/bl3" element={<BL3 />} />
        <Route path="/levels/bonus/bl4" element={<BL4 />} />
        <Route path="/levels/bonus/bl5" element={<BL5 />} />
        <Route path="/levels/bonus/bl6" element={<BL6 />} />

        {/* 404 fallback */}
        <Route path="*" element={<h1 style={{ color: "red", textAlign: "center" }}>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
