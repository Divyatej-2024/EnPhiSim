// src/pages/levels/easy/L1.jsx
import React from "react";
import "./l1.css";

export default function L1() {
  return (
   <div className="level-container">
            <div className="app-header">
                <button className="back-button">Back to Dashboard</button>
            </div>

            <h1 className="level-title">Level 1 — Phishing Email Basics</h1>
            <p className="level-subtitle">Understand how attackers trick users through social engineering.</p>

            <div className="simulation-content">
                
                {/* Task Instruction Card */}
                <div className="task-card">
                    <h2>Your Task:</h2>
                    <p>Identify the suspicious elements and inspect sender and link carefully.</p>
                </div>

                {/* Simulated Email Area */}
                <div className="email-area">
                    {/* Integrated Logo */}
                    <div className="email-logo">
                        <span className="logo-text">EnPhSim</span>
                    </div>

                    <div className="simulated-email-client">
                        
                        {/* Action Buttons */}
                        <div className="email-actions">
                            <button className="report-button">Report Phishing</button>
                            <button className="delete-button">Delete Email</button>
                        </div>

                        {/* Email Header Details */}
                        <div className="email-details">
                            <p>
                                IT Support &lt;<span className="suspicious-link" title="WARNING: Not official domain">it-helpdesk@uni-login-verify.com</span>&gt;
                                <span className="warning-tooltip">WARNING: Not official domain</span>
                            </p>
                            <p>To: John.Doe@yourcollege.edu</p>
                            <h3>URGENT: Your Account Requires Immediate Action</h3>
                        </div>
                        
                        {/* Email Body */}
                        <div className="email-body">
                            <p>Dear User, Our records indicate account has unusual activity. Failure the verify account suspension. Click your button below to secure account.</p>
                            
                            {/* Call to Action Link/Button */}
                            <button 
                                className="cta-button" 
                                data-url={simulatedUrl}
                                // In a real app, mouseEnter/Leave would update the status bar state
                            >
                                Verify Your Account Now
                            </button>
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
  );
}
