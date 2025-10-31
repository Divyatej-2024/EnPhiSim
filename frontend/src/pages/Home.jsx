import React from 'react';
import {Link} from 'react-router-dom';
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <img src={'${process.env.PUBLIC_URL}/Enphisim.png'} alt="EnPhiSim Logo" width="150"/>
      <h1>Welcome to EnPhiSim</h1>
      <p>Your phishing simulation and awareness platform.</p>
      <a href="Simulation.jsx">Let's Begin</a>
    </div>
  );
}

export default Home;

