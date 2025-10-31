import React from 'react';
import EnphisimLogo from '../Enphisim.png';
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <img src={EnphisimLogo} alt="EnPhiSim Logo" width="150"/>
      <h1>Welcome to EnPhiSim</h1>
      <p>Your phishing simulation and awareness platform.</p>
      <a href="Simulation.jsx">Let's Begin</a>
    </div>
  );
}

export default Home;

