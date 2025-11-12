import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import
import "./l1.css";
import "../../../level-mail.css";

const level1Data = {
    id: "l1",
    title: "Phishing Email Basics",
    category: "easy",
    content: "<p>You've received an email claiming to be from your university IT department. It asks you to verify your account immediately by clicking a link.</p>",
    options: [
        { key: "verify", label: "Verify Your Account Now", style: "primary" },
        { key: "report", label: "Report Phishing", style: "neutral" }
    ],
    correctOption: "report", 
    nextPath: "/levels/easy/l2", // ✅ change to route path, not file
    simulatedData: {
        sender: "IT Support <it-helpdesk@enphisim.com>",
        subject: "URGENT: Your Account Requires Immediate Action",
        suspiciousURL: "https://secure-enphisim.com/verify"
    }
};

// --- FeedbackDialog Component ---
const FeedbackDialog = ({ type, message, onAction, actionLabel }) => {
    const dialogClass = type === 'correct' ? 'dialog-correct' : type === 'neutral' ? 'dialog-neutral' : 'dialog-wrong';
    return (
        <div className="dialog-overlay">
            <div className={`feedback-dialog ${dialogClass}`}>
                <div className="dialog-header">
                    <h2>{type.charAt(0).toUpperCase() + type.slice(1)}!</h2>
                    <span className="close-button" onClick={() => onAction('close')}>&times;</span>
                </div>
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <button onClick={() => onAction(type)} className="dialog-primary-btn">{actionLabel}</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Level Component ---
const L1 = () => {
    const [dialog, setDialog] = useState(null);
    const navigate = useNavigate(); // ✅ enables navigation

    const { id, title, content, options, correctOption, nextPath, simulatedData, category } = level1Data;

    const handleAction = (key) => {
        if (key === correctOption) {
            setDialog({
                type: 'correct',
                message: "✅ Success! You correctly identified and reported the threat.",
                actionLabel: 'Go to Next Level',
            });
        } else if (key === 'delete') {
            setDialog({
                type: 'neutral',
                message: "🟡 Safe choice, but you missed the opportunity to report phishing.",
                actionLabel: 'Repeat Level',
            });
        } else {
            setDialog({
                type: 'wrong',
                message: "❌ Incorrect! Clicking such links can be dangerous.",
                actionLabel: 'Try Again',
            });
        }
    };

    const handleDialogAction = (type) => {
        if (type === 'correct') {
            navigate(nextPath); // ✅ actual redirect
        } else if (type === 'neutral') {
            navigate(`/levels/${category}/${id}`);
        } else {
            setDialog(null);
        }
    };

    const ctaOption = options.find(opt => opt.key !== 'report');
    const reportOption = options.find(opt => opt.key === 'report');
    const sender = simulatedData?.sender || 'Unknown Sender';
    const subject = simulatedData?.subject || 'Important Notification';
    const suspiciousURL = simulatedData?.suspiciousURL || '#';
    const levelNumber = id.slice(1);

    return (
        <div className="level-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            
            <h1 className="level-title">Level {levelNumber} — {title}</h1>
            <p className="level-subtitle">Understand how attackers trick users through social engineering.</p>

            <div className="simulation-content">
                <div className="task-card">
                    <h2>Your Task:</h2>
                    <p>Determine the nature of this email and choose the safest action.</p>
                </div>

                <div className="level-mail-wrapper">
                    <div className="email-logo"><span className="logo-text">EnPhSim</span></div>
                    <div className="simulated-email-client">
                        <div className="email-actions">
                            <button className="report-button" onClick={() => handleAction('report')}>
                                {reportOption?.label || 'Report Phishing'}
                            </button>
                            <button className="delete-button" onClick={() => handleAction('delete')}>
                                Delete Email
                            </button>
                        </div>

                        <div className="email-details">
                            <p>From: {sender}</p>
                            <h3>{subject}</h3>
                        </div>

                        <div className="email-body">
                            <div dangerouslySetInnerHTML={{ __html: content }}></div>
                            <button 
                                className="cta-button" 
                                onClick={() => handleAction(ctaOption?.key)}
                            >
                                {ctaOption?.label || 'Click Here'}
                            </button>
                        </div>

                        <div className="status-bar">Simulated Status Bar</div>
                        <div className="status-url">{suspiciousURL}</div>
                    </div>
                </div>
            </div>

            {dialog && (
                <FeedbackDialog 
                    type={dialog.type}
                    message={dialog.message}
                    actionLabel={dialog.actionLabel}
                    onAction={handleDialogAction}
                />
            )}
        </div>
    );
};

export default L1;
