import React, { useState, useEffect, useRef } from "react";
import BaseLevel from "./BaseLevel";

export default function MessageLevel() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const messageStyles = `
    .messenger-container {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .messenger-header {
      background: #075e54;
      color: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 50%;
    }

    .back-button:hover {
      background: rgba(255,255,255,0.1);
    }

    .chat-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #128C7E;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
    }

    .chat-info {
      flex: 1;
    }

    .chat-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .chat-status {
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-online {
      width: 8px;
      height: 8px;
      background: #25D366;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .header-actions {
      display: flex;
      gap: 16px;
    }

    .header-action {
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
    }

    .header-action:hover {
      background: rgba(255,255,255,0.1);
    }

    .messages-area {
      height: 500px;
      overflow-y: auto;
      padding: 24px;
      background: #e5ddd5;
      background-image: url('data:image/svg+xml,...'); /* WhatsApp pattern */
    }

    .message-wrapper {
      display: flex;
      margin-bottom: 16px;
      animation: fadeIn 0.3s ease;
    }

    .message-wrapper.sent {
      justify-content: flex-end;
    }

    .message-wrapper.received {
      justify-content: flex-start;
    }

    .message-bubble {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 18px;
      position: relative;
      word-wrap: break-word;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .received .message-bubble {
      background: #fff;
      border-bottom-left-radius: 4px;
    }

    .sent .message-bubble {
      background: #dcf8c6;
      border-bottom-right-radius: 4px;
    }

    .message-sender {
      font-size: 12px;
      font-weight: 600;
      color: #075e54;
      margin-bottom: 4px;
    }

    .message-text {
      font-size: 14px;
      line-height: 1.5;
      color: #303030;
    }

    .message-time {
      font-size: 11px;
      color: #999;
      margin-top: 4px;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }

    .message-status {
      font-size: 14px;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: #fff;
      border-radius: 18px;
      width: fit-content;
      margin-bottom: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typingBounce 1.4s infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    .input-area {
      padding: 16px 24px;
      background: #f0f0f0;
      display: flex;
      gap: 12px;
      align-items: center;
      border-top: 1px solid #e0e0e0;
    }

    .attach-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      color: #5f6368;
    }

    .attach-button:hover {
      background: #e0e0e0;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 24px;
      outline: none;
      font-size: 14px;
      background: #fff;
    }

    .send-button {
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: #075e54;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.2s;
    }

    .send-button:hover:not(:disabled) {
      background: #128C7E;
      transform: scale(1.05);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .phishing-warning {
      background: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
      padding: 12px 16px;
      margin: 12px 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease;
    }

    .suspicious-link {
      background: #fce8e6;
      color: #d93025;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 8px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
    }

    .message-action-btn {
      padding: 10px 24px;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .message-action-btn.block {
      background: #fce8e6;
      color: #d93025;
    }

    .message-action-btn.block:hover:not(:disabled) {
      background: #fad2cf;
    }

    .message-action-btn.report {
      background: #fff3cd;
      color: #856404;
    }

    .message-action-btn.safe {
      background: #e6f4ea;
      color: #137333;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 5000);

    return () => clearInterval(typingInterval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Thanks for your message. Can you help me with...",
        sender: 'contact',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <>
      <style>{messageStyles}</style>
      <BaseLevel levelType="message">
        {({ level, onAction, locked }) => (
          <div className="messenger-container">
            <div className="messenger-header">
              <button className="back-button">←</button>
              <div className="chat-avatar">
                {level.contact_name?.[0] || 'C'}
              </div>
              <div className="chat-info">
                <div className="chat-name">{level.contact_name || 'Contact Name'}</div>
                <div className="chat-status">
                  <span className="status-online"></span>
                  <span>Online • {level.status || 'Active now'}</span>
                </div>
              </div>
              <div className="header-actions">
                <span className="header-action">📞</span>
                <span className="header-action">📹</span>
                <span className="header-action">⋮</span>
              </div>
            </div>

            {level.show_warning && (
              <div className="phishing-warning">
                <span>⚠️</span>
                <div>
                  <strong>Suspicious Message Detected</strong>
                  <p>This conversation contains potential phishing attempts</p>
                </div>
              </div>
            )}

            <div className="messages-area">
              {level.messages?.map((msg, idx) => (
                <div key={idx} className={`message-wrapper ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                  <div className="message-bubble">
                    {msg.sender !== 'user' && (
                      <div className="message-sender">{msg.sender_name || level.contact_name}</div>
                    )}
                    <div className="message-text">
                      {msg.text}
                      {msg.has_link && (
                        <span className="suspicious-link">⚠️ Suspicious link</span>
                      )}
                    </div>
                    <div className="message-time">
                      {msg.timestamp || '10:30 AM'}
                      <span className="message-status">
                        {msg.status === 'sent' && '✓'}
                        {msg.status === 'delivered' && '✓✓'}
                        {msg.status === 'read' && '✓✓'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message-wrapper received">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <button className="attach-button">📎</button>
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={locked}
              />
              <button 
                className="send-button" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || locked}
              >
                ➤
              </button>
            </div>

            <div className="action-buttons">
              <button
                className="message-action-btn block"
                disabled={locked}
                onClick={() => onAction('block', { 
                  contact: level.contact_name,
                  reason: 'phishing'
                })}
              >
                🚫 Block Contact
              </button>
              <button
                className="message-action-btn report"
                disabled={locked}
                onClick={() => onAction('report', { 
                  contact: level.contact_name,
                  messages: level.messages
                })}
              >
                ⚠️ Report
              </button>
              <button
                className="message-action-btn safe"
                disabled={locked}
                onClick={() => onAction('safe', { 
                  contact: level.contact_name 
                })}
              >
                ✅ Mark Safe
              </button>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}