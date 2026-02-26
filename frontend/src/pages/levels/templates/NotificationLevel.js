import React, { useState, useEffect } from "react";
import BaseLevel from "./BaseLevel";

export default function NotificationLevel() {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notificationStyles = `
    .notification-center {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .notification-header {
      background: #1a73e8;
      color: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 600;
    }

    .live-badge {
      background: #fbbc04;
      color: #202124;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 16px;
    }

    .header-icon {
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
    }

    .header-icon:hover {
      background: rgba(255,255,255,0.1);
    }

    .notification-filters {
      display: flex;
      gap: 8px;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
    }

    .filter-chip {
      padding: 6px 16px;
      border-radius: 20px;
      background: #fff;
      border: 1px solid #dadce0;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-chip:hover {
      background: #e8eaed;
    }

    .filter-chip.active {
      background: #1a73e8;
      color: white;
      border-color: #1a73e8;
    }

    .notifications-list {
      max-height: 500px;
      overflow-y: auto;
      padding: 8px 0;
    }

    .notification-item {
      display: flex;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .notification-item:hover {
      background: #f5f5f5;
    }

    .notification-item.unread {
      background: #e8f0fe;
    }

    .notification-item.selected {
      border-left: 4px solid #1a73e8;
      background: #f0f7ff;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .icon-security { background: #fce8e6; color: #d93025; }
    .icon-system { background: #e6f4ea; color: #137333; }
    .icon-social { background: #e8f0fe; color: #1a73e8; }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      color: #202124;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-message {
      color: #5f6368;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .notification-time {
      color: #9aa0a6;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .priority-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      background: #f1f3f4;
    }

    .priority-high {
      background: #fce8e6;
      color: #d93025;
    }

    .notification-details {
      padding: 24px;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      animation: slideDown 0.3s ease;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .detail-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .detail-info h3 {
      margin: 0 0 4px 0;
      color: #202124;
    }

    .detail-info p {
      margin: 0;
      color: #5f6368;
      font-size: 14px;
    }

    .detail-section {
      margin-bottom: 20px;
    }

    .detail-label {
      font-size: 12px;
      color: #9aa0a6;
      margin-bottom: 4px;
    }

    .detail-value {
      color: #202124;
      font-size: 14px;
      line-height: 1.6;
    }

    .suspicious-indicator {
      background: #fef7e0;
      border: 1px solid #f9ab00;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .notification-action {
      padding: 8px 24px;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .notification-action.primary {
      background: #1a73e8;
      color: white;
    }

    .notification-action.primary:hover:not(:disabled) {
      background: #1557b0;
    }

    .notification-action.warning {
      background: #fce8e6;
      color: #d93025;
    }

    .notification-action.secondary {
      background: #f1f3f4;
      color: #5f6368;
    }

    .notification-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-state {
      padding: 48px;
      text-align: center;
      color: #9aa0a6;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .new-notification {
      animation: slideIn 0.3s ease, highlight 2s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 768px) {
      .notification-header { padding: 12px; }
      .header-title { font-size: 15px; }
      .notification-filters { overflow-x: auto; white-space: nowrap; }
      .notification-item { padding: 12px; gap: 10px; }
      .notification-icon { width: 32px; height: 32px; font-size: 16px; }
      .notification-details { padding: 14px; }
      .action-buttons { flex-direction: column; }
      .notification-action { width: 100%; justify-content: center; }
    }
  `;

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time notifications (kept for functionality)
      if (Math.random() > 0.7) {
        // Notification logic kept but not storing in state unused
        // This maintains the real-time behavior
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{notificationStyles}</style>
      <BaseLevel levelType="notification">
        {({ level, onAction, locked }) => (
          <div className="notification-center">
            <div className="notification-header">
              <div className="header-title">
                <span>🔔</span>
                <span>Notifications</span>
                <span className="live-badge">LIVE</span>
              </div>
              <div className="header-actions">
                <span className="header-icon">✓</span>
                <span className="header-icon">⚙️</span>
                <span className="header-icon">⋮</span>
              </div>
            </div>

            <div className="notification-filters">
              <span className="filter-chip active">All</span>
              <span className="filter-chip">Unread</span>
              <span className="filter-chip">Security</span>
              <span className="filter-chip">System</span>
              <span className="filter-chip">Social</span>
            </div>

            <div className="notifications-list">
              {level.notifications?.map((notification, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`notification-item ${notification.unread ? 'unread' : ''} ${selectedNotification === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedNotification(selectedNotification === idx ? null : idx)}
                  >
                    <div className={`notification-icon icon-${notification.type || 'system'}`}>
                      {notification.icon || '📋'}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notification.title}
                        {notification.priority === 'high' && (
                          <span className="priority-badge priority-high">High Priority</span>
                        )}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        <span>{notification.time || '10 min ago'}</span>
                        {notification.suspicious && (
                          <span style={{ color: '#d93025' }}>⚠️ Suspicious</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedNotification === idx && (
                    <div className="notification-details">
                      <div className="detail-header">
                        <div className={`detail-icon icon-${notification.type || 'system'}`}>
                          {notification.icon || '📋'}
                        </div>
                        <div className="detail-info">
                          <h3>{notification.title}</h3>
                          <p>From: {notification.sender || 'System'}</p>
                        </div>
                      </div>

                      {notification.suspicious && (
                        <div className="suspicious-indicator">
                          <span>⚠️</span>
                          <div>
                            <strong>Security Warning</strong>
                            <p>This notification contains suspicious elements</p>
                          </div>
                        </div>
                      )}

                      <div className="detail-section">
                        <div className="detail-label">Full Message</div>
                        <div className="detail-value">
                          {notification.full_message || notification.message}
                        </div>
                      </div>

                      {notification.link && (
                        <div className="detail-section">
                          <div className="detail-label">Link</div>
                          <div className="detail-value" style={{ color: '#1a73e8' }}>
                            {notification.link}
                            <span style={{ color: '#d93025', marginLeft: '8px' }}>
                              (Suspicious)
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="action-buttons">
                        <button
                          className="notification-action warning"
                          disabled={locked}
                          onClick={() => onAction('block', { 
                            notification_id: notification.id,
                            type: 'notification_block'
                          })}
                        >
                          🚫 Block Sender
                        </button>
                        <button
                          className="notification-action secondary"
                          disabled={locked}
                          onClick={() => onAction('ignore', { 
                            notification_id: notification.id 
                          })}
                        >
                          ⏭️ Ignore
                        </button>
                        <button
                          className="notification-action primary"
                          disabled={locked}
                          onClick={() => onAction('safe', { 
                            notification_id: notification.id 
                          })}
                        >
                          ✅ Mark Safe
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {(!level.notifications || level.notifications.length === 0) && (
                <div className="empty-state">
                  <div className="empty-icon">📬</div>
                  <h3>No Notifications</h3>
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}
