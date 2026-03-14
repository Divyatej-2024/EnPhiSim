import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard1.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || 'anonymous');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Fetching dashboard data for session:', sessionId);

      const [analyticsResult, metricsResult] = await Promise.allSettled([
        api.getAnalytics(sessionId, timeRange),
        api.getModelMetrics(),
      ]);

      // ✅ FIX: Handle analytics response correctly
      if (analyticsResult.status === 'fulfilled') {
        console.log('📊 Analytics raw response:', analyticsResult.value);
        
        // Check if response has data wrapper
        const analyticsData = analyticsResult.value?.data || analyticsResult.value;
        setAnalytics(analyticsData);
        
        console.log('📊 Analytics data set:', analyticsData);
      } else {
        console.error('❌ Analytics failed:', analyticsResult.reason);
        throw analyticsResult.reason;
      }

      // Handle metrics response
      if (metricsResult.status === 'fulfilled') {
        const metricsData = metricsResult.value?.data || metricsResult.value;
        setModelMetrics(metricsData);
      } else {
        console.log('⚠️ Model metrics unavailable');
        setModelMetrics(null);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sessionId, timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const goToLevels = () => {
    navigate('/game');
  };

  const endGame = () => {
    navigate('/thankyou');
  };

  const toTitleCase = (value) =>
    String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const formatMetricValue = (key, value) => {
    if (typeof value === 'number') {
      const lowerKey = key.toLowerCase();
      const looksLikePercentMetric =
        ['accuracy', 'precision', 'recall', 'f1', 'rate', 'auc'].some((k) => lowerKey.includes(k));

      if (looksLikePercentMetric && value <= 1) {
        return `${(value * 100).toFixed(1)}%`;
      }
      if (Number.isInteger(value)) {
        return value.toLocaleString();
      }
      return value.toFixed(2);
    }

    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }

    return String(value);
  };

  const flattenMetrics = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object') {
      return [];
    }

    return Object.entries(obj).flatMap(([key, value]) => {
      const composedKey = prefix ? `${prefix}.${key}` : key;

      if (value === null) {
        return [];
      }

      if (Array.isArray(value)) {
        return value.flatMap((item, index) => {
          const arrayKey = `${composedKey}[${index}]`;
          if (item !== null && typeof item === 'object') {
            return flattenMetrics(item, arrayKey);
          }
          return [[arrayKey, item]];
        });
      }

      if (typeof value === 'object') {
        return flattenMetrics(value, composedKey);
      }

      return [[composedKey, value]];
    });
  };

  if (loading) {
    return <div className="loading-screen">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
        <button onClick={goToLevels} style={{ marginLeft: '10px' }}>Back to Levels</button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="empty-dashboard">
        <h2>No Data Yet</h2>
        <p>Complete some phishing scenarios to see your analytics.</p>
        <button onClick={goToLevels}>
          Go to Game
        </button>
        <button onClick={goToLevels} style={{ marginLeft: '10px' }}>
          Back to Levels
        </button>
      </div>
    );
  }

  // ✅ FIX: Calculate metrics properly
  const totalActions = analytics.total_actions || 0;
  const correctActions = analytics.correct_actions || 0;
  const incorrectActions = totalActions - correctActions;
  const accuracy = totalActions > 0 ? (correctActions / totalActions) * 100 : 0;

  const userMetrics = [
    ['total_actions', totalActions],
    ['correct_actions', correctActions],
    ['incorrect_actions', incorrectActions],
    ['accuracy', accuracy],
  ];

  const modelMetricEntries = flattenMetrics(modelMetrics);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Progress</h1>
        <div className="dashboard-top-actions">
          <button className="dashboard-action-button secondary" onClick={goToLevels}>
            <span>← Back to Levels</span>
          </button>
          <button className="dashboard-action-button primary" onClick={endGame}>
            <span className="dashboard-action-pulse" aria-hidden="true" />
            <span>End Game</span>
          </button>
        </div>
      </div>

      <div className="time-range-selector">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <h2 className="section-title">Your Performance</h2>
      <div className="stats-grid">
        {userMetrics.map(([key, value]) => (
          <div key={key} className={`stat-card ${key}`}>
            <h3>{toTitleCase(key)}</h3>
            <p>{formatMetricValue(key, value)}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">ML Model Performance</h2>
      {modelMetrics ? (
        <div className="stats-grid">
          {modelMetricEntries.map(([key, value]) => (
            <div key={key} className="stat-card">
              <h3>{toTitleCase(key)}</h3>
              <p>{formatMetricValue(key, value)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-note">Model metrics are currently unavailable.</p>
      )}

      <div className="actions-list">
        <h3>Recent Activity</h3>
        {(analytics.recent_actions || []).map((action, i) => (
          <div key={i} className={`action-item ${action.is_correct ? 'correct' : 'incorrect'}`}>
            <span>{action.title || 'Unknown Scenario'}</span>
            <span>You: {action.user_action}</span>
            <span>{action.is_correct ? '✓ Correct' : '✗ Incorrect'}</span>
          </div>
        ))}
        {(analytics.recent_actions || []).length === 0 && (
          <div className="muted-note">No recent activity for this time range.</div>
        )}
      </div>
    </div>
  );
}
