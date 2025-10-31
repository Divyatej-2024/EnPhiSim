// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LevelPage from "./pages/LevelPage";
import Simulation from "./pages/Simulation";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
  <Route path="/levelpage" element={<LevelPage />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
