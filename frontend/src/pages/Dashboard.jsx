// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import api from '../services/api';
import './Dashboard1.css';

export default function Dashboard() {
  const navigate = useNavigate(); // Add navigation hook
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || 'anonymous');

 const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAnalytics(sessionId, timeRange);
      setAnalytics(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
 },[sessionId, timeRange]);

 
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  
  // Handler for levels button
  const goToLevels = () => {
    navigate('/game'); // or '/levels' depending on your route
  };

  if (loading) {
    return <div className="loading-screen">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={fetchAnalytics}>Retry</button>
        <button onClick={goToLevels} style={{ marginLeft: '10px' }}>Back to Levels</button>
      </div>
    );
  }

  if (!analytics || analytics.total_actions === 0) {
    return (
      <div className="empty-dashboard">
        <h2>No Data Yet</h2>
        <p>Complete some phishing scenarios to see your analytics.</p>
        <button onClick={() => window.location.href = '/game'}>
          Go to Game
        </button>
        <button onClick={goToLevels} style={{ marginLeft: '10px' }}>
          Back to Levels
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with title and levels button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>Your Progress</h1>
        <button 
          onClick={goToLevels}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 5px 15px rgba(102,126,234,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 20px rgba(102,126,234,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 5px 15px rgba(102,126,234,0.3)';
          }}
        >
          <span>🎮</span> Back to Levels
        </button>
      </div>

      {/* Time range selector */}
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '8px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Scenarios</h3>
          <p>{analytics.total_actions}</p>
        </div>
        <div className="stat-card">
          <h3>Correct</h3>
          <p>{analytics.correct_actions}</p>
        </div>
        <div className="stat-card">
          <h3>Accuracy</h3>
          <p>{analytics.accuracy_percent}%</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="actions-list">
        <h3>Recent Activity</h3>
        {analytics.recent_actions.map((action, i) => (
          <div key={i} className={`action-item ${action.is_correct ? 'correct' : 'incorrect'}`}>
            <span>{action.taxonomy || 'Unknown Type'}</span>
            <span>You: {action.user_action}</span>
            <span>{action.is_correct ? '✅' : '❌'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}