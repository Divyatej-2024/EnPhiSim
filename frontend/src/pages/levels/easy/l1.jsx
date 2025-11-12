import React, { useState } from 'react';

// --- Level 1 Data Definition ---
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
    nextPath: "/levels/easy/l2",
    simulatedData: {
        sender: "IT Support <it-helpdesk@uni-login-verify.com>",
        subject: "URGENT: Your Account Requires Immediate Action",
        suspiciousURL: "https://secure.uni-account.phishing.login.ru/verify"
    }
};

// --- Reusable Feedback Dialog Component ---
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

// --- Main Simulation Component (renamed to L1 for file consistency) ---
const L1 = () => {
    const [dialog, setDialog] = useState(null);
    const { id, title, content, options, correctOption, nextPath, simulatedData, category } = level1Data;

    // Placeholder for actual navigation (e.g., using React Router's useNavigate)
    const handleNavigation = (destination) => {
        // In a real application, this would use a router like navigate(destination)
        console.log(`Navigating to: ${destination}`);
        alert(`Simulated Navigation to: ${destination}`);
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
            // Neutral Action 
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
            // Restart the current level
            handleNavigation(`/levels/${category}/${id}`); 
        } else if (type === 'wrong' || type === 'close') {
            setDialog(null);
        }
    };

    // --- Rendering Logic ---
    const ctaOption = options.find(opt => opt.key !== 'report');
    const reportOption = options.find(opt => opt.key === 'report');
    
    const sender = simulatedData?.sender || 'Unknown Sender';
    const subject = simulatedData?.subject || 'Important Notification';
    const suspiciousURL = simulatedData?.suspiciousURL || '#';
    const levelNumber = id.slice(1);

    return (
        <>
            <style>
                {`
                    /* Variables for easy color adjustments */
                    :root {
                        --dark-blue: #111424;
                        --text-light: #ffffff;
                        --card-bg: #1e213b;
                        --report-button: #4490f2; /* Blue */
                        --delete-button: #4a4f6e; /* Grey */
                        --warning-yellow: #ffc107; /* Yellow for warning/tooltip */
                    }

                    /* Base Page Styling */
                    .level-container {
                        background-color: var(--dark-blue);
                        color: var(--text-light);
                        padding: 30px;
                        font-family: 'Inter', sans-serif;
                        min-height: 100vh;
                    }

                    .back-button {
                        background-color: #3a3f5a;
                        color: var(--text-light);
                        border: none;
                        padding: 8px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-bottom: 20px;
                    }

                    /* Titles */
                    .level-title {
                        font-size: 2em;
                        color: var(--text-light);
                        margin-bottom: 5px;
                        font-weight: 700;
                    }

                    .level-subtitle {
                        font-size: 1em;
                        color: #b0b0b0;
                        margin-bottom: 30px;
                    }

                    /* Main Content Layout (Task Card + Email Area) */
                    .simulation-content {
                        display: flex;
                        gap: 30px;
                    }

                    /* Task Card (Instructions) */
                    .task-card {
                        background-color: var(--card-bg);
                        border: 1px solid #3a3f5a;
                        padding: 20px;
                        border-radius: 8px;
                        flex: 1; 
                        height: fit-content;
                    }

                    .task-card h2 {
                        color: var(--text-light);
                        margin-top: 0;
                    }

                    /* Email Area (Logo + Email Client) */
                    .email-area {
                        flex: 2;
                    }

                    .email-logo {
                        background-color: #2c314c;
                        padding: 10px 20px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    }

                    .logo-text {
                        font-size: 1.2em;
                        font-weight: bold;
                        color: var(--text-light);
                    }

                    /* Simulated Email Client */
                    .simulated-email-client {
                        background-color: #2c314c;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        border: 1px solid #3a3f5a;
                        border-top: none;
                        padding: 20px;
                    }

                    /* Email Actions (Buttons) */
                    .email-actions {
                        margin-bottom: 15px;
                    }

                    .email-actions button {
                        padding: 8px 15px;
                        border: none;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-right: 10px;
                    }

                    .report-button {
                        background-color: var(--report-button);
                        color: var(--text-light);
                    }

                    .delete-button {
                        background-color: var(--delete-button);
                        color: var(--text-light);
                    }

                    /* Email Header Details (From/To/Subject) */
                    .email-details {
                        padding: 15px 0;
                        border-bottom: 1px solid #3a3f5a;
                        position: relative; 
                    }

                    .email-details p {
                        margin: 5px 0;
                        font-size: 0.9em;
                    }

                    .email-details h3 {
                        margin: 10px 0;
                        font-weight: bold;
                    }
                    
                    /* Email Body */
                    .email-body {
                        padding: 15px 0;
                        text-align: center;
                    }

                    .cta-button {
                        background-color: var(--report-button);
                        color: var(--text-light);
                        border: none;
                        padding: 12px 30px;
                        border-radius: 4px;
                        font-size: 1.1em;
                        font-weight: bold;
                        cursor: pointer;
                        margin-top: 20px;
                    }
                    .cta-button.primary-pay {
                        background-color: #ffc107; /* Used for pay button in L2, but useful here */
                        color: var(--dark-blue);
                    }

                    /* Status Bar */
                    .status-bar {
                        background-color: #111424;
                        color: #b0b0b0;
                        padding: 5px 10px;
                        font-size: 0.8em;
                        border-top: 1px solid #3a3f5a;
                        margin-top: 20px;
                    }

                    .status-url {
                        background-color: #111424;
                        color: var(--warning-yellow);
                        padding: 5px 10px;
                        font-size: 0.9em;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }

                    /* --- Dialog Box Styles --- */

                    .dialog-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.7); 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }

                    .feedback-dialog {
                        background-color: #2c314c;
                        border-radius: 8px;
                        padding: 30px;
                        width: 90%;
                        max-width: 450px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                        color: var(--text-light);
                    }

                    .dialog-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }

                    .dialog-header h2 {
                        margin: 0;
                    }

                    .close-button {
                        font-size: 1.5em;
                        cursor: pointer;
                        line-height: 1;
                        color: #b0b0b0;
                    }

                    .dialog-message {
                        font-size: 1em;
                        line-height: 1.5;
                        margin-bottom: 25px;
                    }

                    .dialog-actions {
                        text-align: right;
                    }

                    .dialog-primary-btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    /* Color Coding for Dialog Types */
                    .dialog-correct .dialog-header h2 {
                        color: #28a745; 
                    }
                    .dialog-correct .dialog-primary-btn {
                        background-color: #28a745;
                        color: var(--text-light);
                    }

                    .dialog-neutral .dialog-header h2 {
                        color: #ffc107; 
                    }
                    .dialog-neutral .dialog-primary-btn {
                        background-color: #ffc107;
                        color: var(--dark-blue);
                    }

                    .dialog-wrong .dialog-header h2 {
                        color: #dc3545;
                    }
                    .dialog-wrong .dialog-primary-btn {
                        background-color: #dc3545;
                        color: var(--text-light);
                    }
                `}
            </style>

            <div className="level-container">
                <div className="app-header">
                    <button className="back-button">Back to Dashboard</button>
                </div>
                
                <h1 className="level-title">Level {levelNumber} — {title}</h1>
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
                                    onClick={() => handleAction(ctaOption?.key)} 
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
        </>
    );
};

export default L1;