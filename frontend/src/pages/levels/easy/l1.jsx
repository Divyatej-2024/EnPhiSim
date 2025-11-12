// src/pages/levels/easy/L1.jsx
import React,{useState} from "react";
//import "./l1.css";
//import "../../../level.css";
//import "../../../level-mail.css";

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
// ----------------------------------------

const SimulationLevel = ({ levelData }) => {
    const [dialog, setDialog] = useState(null);
    const { id, title, content, options, correctOption, nextPath, simulatedData } = levelData;

    // Placeholder for actual navigation (e.g., using React Router's useNavigate)
    const handleNavigation = (destination) => {
        alert(`Navigating to: ${destination}`);
        setDialog(null);
    };

    // --- Core Action Logic ---
    const handleAction = (key) => {
        if (key === correctOption) {
            // Correct Action (e.g., Report)
            setDialog({
                type: 'correct',
                message: "Success! You correctly identified and reported the threat. This is the safest action.",
                actionLabel: 'Go to Next Level',
            });
        } else if (key === 'delete') {
            // Neutral Action (Placeholder for a 'Delete' button)
            setDialog({
                type: 'neutral',
                message: "It's safe to delete the email, but you missed the chance to report it. Always report phishing to help others.",
                actionLabel: 'Repeat Level',
            });
        } else {
            // Wrong Action (e.g., Verify, Pay Now)
            setDialog({
                type: 'wrong',
                message: "Incorrect Action! Clicking this may have led to a scammer's trap. Always inspect links and senders carefully.",
                actionLabel: 'Try Again',
            });
        }
    };

    // Function to handle actions triggered from within the dialog box
    const handleDialogAction = (type) => {
        if (type === 'correct') {
            handleNavigation(nextPath);
        } else if (type === 'neutral') {
            handleNavigation(`/levels/${levelData.category}/${id}`); // Restart the current level
        } else if (type === 'wrong' || type === 'close') {
            setDialog(null);
        }
    };

    // --- Rendering Logic ---
    // Find the primary button style for the main CTA in the email body
    const ctaOption = options.find(opt => opt.key !== 'report');
    const reportOption = options.find(opt => opt.key === 'report');
    
    // Defaulting suspicious data if not provided (like L1, L2 have it)
    const sender = simulatedData?.sender || 'Unknown Sender';
    const subject = simulatedData?.subject || 'Important Notification';
    const suspiciousURL = simulatedData?.suspiciousURL || '#';

    return (
        <div className="level-container">
            <div className="app-header">
                <button className="back-button">Back to Dashboard</button>
            </div>
            
            <h1 className="level-title">Level {id.slice(1)} — {title}</h1>
            <p className="level-subtitle">Understand how attackers trick users through social engineering.</p>

            <div className="simulation-content">
                
                <div className="task-card">
                    <h2>Your Task:</h2>
                    <p>Determine the nature of this email. Identify all suspicious elements and choose the safest response.</p>
                </div>

                <div className="email-area">
                    <div className="email-logo"><span className="logo-text">EnPhSim</span></div>
                    <div className="simulated-email-client">
                        
                        {/* Email Client Top Action Buttons (Report and Delete) */}
                        <div className="email-actions">
                            <button className="report-button" onClick={() => handleAction('report')}>{reportOption?.label || 'Report Phishing'}</button>
                            <button className="delete-button" onClick={() => handleAction('delete')}>Delete Email</button>
                        </div>

                        {/* Email Header Details */}
                        <div className="email-details">
                            <p>
                                From: {sender}
                            </p>
                            <h3>{subject}</h3>
                        </div>
                        
                        {/* Email Body */}
                        <div className="email-body">
                            <div dangerouslySetInnerHTML={{ __html: content }}></div>
                            
                            {/* Call to Action Link/Button */}
                            <button 
                                className={`cta-button ${ctaOption?.style === 'primary' ? 'primary-cta' : ''}`}
                                onClick={() => handleAction(ctaOption?.key)} // WRONG ACTION
                            >
                                {ctaOption?.label || 'Click Here'}
                            </button>
                        </div>

                        {/* Simulated Status Bar (Visible on hover in a real app) */}
                        <div className="status-bar">Simulated Status Bar</div>
                        <div className="status-url">{suspiciousURL}</div>
                    </div>
                </div>
            </div>

            {/* Dialog Box */}
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

export default SimulationLevel;