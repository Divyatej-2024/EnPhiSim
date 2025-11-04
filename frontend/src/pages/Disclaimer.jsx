// src/pages/Disclaimer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer(){
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(to bottom right,#0f172a,#1e293b)", color:"#fff", padding:20
    }}>
      <div style={{ background:"#0f172a", padding:28, borderRadius:16, maxWidth:720 }}>
        <h1 style={{ marginTop:0 }}>Disclaimer & Consent</h1>
        <p style={{ color:"#cbd5e1" }}>
          EnPhiSim is an educational phishing simulation. All scenarios are simulated for training and research.
          Do not share real credentials. Data is stored locally for this demo.
        </p>

        <div style={{ marginTop:16 }}>
          <label style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="checkbox" checked={agreed} onChange={()=>setAgreed(a=>!a)} />
            <span>I have read and agree to participate in this simulation.</span>
          </label>
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => agreed ? navigate("/dashboard") : alert("Please agree to proceed")}
            style={{ padding:"10px 14px", borderRadius:10, border:"none", background:"#0ea5a4", color:"#fff" }}
          >
            Proceed to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
