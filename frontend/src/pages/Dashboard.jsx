import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || 'anonymous');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh
    const interval = setInterval(fetchAnalytics, refreshInterval);
    return () => clearInterval(interval);
  }, [timeRange, sessionId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/analytics/${sessionId}?range=${timeRange}`
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your phishing training analytics...</p>
      </div>
    );
  }

  if (!analytics || analytics.total_actions === 0) {
    return (
      <div className="dashboard-empty">
        <div className="empty-icon">📊</div>
        <h2>No Data Yet</h2>
        <p>Complete some phishing scenarios to see your analytics</p>
        <button 
          className="start-training-btn"
          onClick={() => window.location.href = '/game'}
        >
          Start Training
        </button>
      </div>
    );
  }

  const accuracyColor = analytics.accuracy_percent >= 80 ? '#28a745' :
                       analytics.accuracy_percent >= 60 ? '#ffc107' : '#dc3545';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Your Phishing Training Dashboard</h1>
          <p className="session-info">Session ID: {sessionId.substring(0, 8)}...</p>
        </div>
        <div className="header-controls">
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
          <button onClick={fetchAnalytics} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <span className="card-label">Total Scenarios</span>
            <span className="card-value">{analytics.total_actions}</span>
          </div>
        </div>

        <div className="summary-card correct">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <span className="card-label">Correct Decisions</span>
            <span className="card-value">{analytics.correct_actions}</span>
          </div>
        </div>

        <div className="summary-card incorrect">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <span className="card-label">Incorrect Decisions</span>
            <span className="card-value">
              {analytics.total_actions - analytics.correct_actions}
            </span>
          </div>
        </div>

        <div className="summary-card accuracy" style={{ borderColor: accuracyColor }}>
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <span className="card-label">Accuracy</span>
            <span className="card-value" style={{ color: accuracyColor }}>
              {analytics.accuracy_percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* ML Model Comparison */}
        <div className="chart-card">
          <h3>🤖 ML Model Performance Comparison</h3>
          <div className="chart-container">
            <Bar 
              data={{
                labels: ['DistilBERT', 'CNN'],
                datasets: [
                  {
                    label: 'Correct Predictions',
                    data: [
                      analytics.ml_performance?.distilbert?.correct || 0,
                      analytics.ml_performance?.cnn?.correct || 0
                    ],
                    backgroundColor: ['#4CAF50', '#2196F3'],
                    borderRadius: 8
                  },
                  {
                    label: 'Incorrect Predictions',
                    data: [
                      analytics.ml_performance?.distilbert?.incorrect || 0,
                      analytics.ml_performance?.cnn?.incorrect || 0
                    ],
                    backgroundColor: ['#f44336', '#ff9800'],
                    borderRadius: 8
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: false }
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' } }
                }
              }}
            />
          </div>
        </div>

        {/* Action Distribution */}
        <div className="chart-card">
          <h3>📊 Action Distribution</h3>
          <div className="chart-container">
            <Doughnut 
              data={{
                labels: ['Trust & Click', 'Ignore', 'Report Phish'],
                datasets: [
                  {
                    data: [
                      analytics.action_distribution?.trust || 0,
                      analytics.action_distribution?.ignore || 0,
                      analytics.action_distribution?.report || 0
                    ],
                    backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
                    borderWidth: 0,
                    hoverOffset: 10
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: { callbacks: { label: (ctx) => `${ctx.raw} actions` } }
                },
                cutout: '65%'
              }}
            />
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="chart-card">
          <h3>📈 Accuracy Trend</h3>
          <div className="chart-container">
            <Line 
              data={{
                labels: analytics.trend?.map(t => t.date) || [],
                datasets: [
                  {
                    label: 'Your Accuracy',
                    data: analytics.trend?.map(t => t.accuracy) || [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                  },
                  {
                    label: 'Average User',
                    data: analytics.trend?.map(t => t.avg_accuracy) || [],
                    borderColor: '#9C27B0',
                    backgroundColor: 'rgba(156, 39, 176, 0.05)',
                    tension: 0.4,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#f0f0f0' },
                    title: { display: true, text: 'Accuracy %' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>📋 Recent Activity</h3>
        <div className="activity-table-container">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Phishing Type</th>
                <th>Your Action</th>
                <th>Correct Action</th>
                <th>Result</th>
                <th>ML DistilBERT</th>
                <th>ML CNN</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recent_actions?.map((action, index) => (
                <tr key={index} className={action.correct ? 'correct-row' : 'incorrect-row'}>
                  <td>{new Date(action.timestamp).toLocaleTimeString()}</td>
                  <td>
                    <span className="phishing-type-badge">
                      {action.taxonomy || 'Credential Phishing'}
                    </span>
                  </td>
                  <td>
                    <span className={`action-badge ${action.user_action.toLowerCase().replace(' ', '-')}`}>
                      {action.user_action}
                    </span>
                  </td>
                  <td>
                    <span className={`action-badge ${action.correct_action?.toLowerCase().replace(' ', '-')}`}>
                      {action.correct_action}
                    </span>
                  </td>
                  <td>
                    {action.correct ? (
                      <span className="result-badge correct">✅ Correct</span>
                    ) : (
                      <span className="result-badge incorrect">❌ Incorrect</span>
                    )}
                  </td>
                  <td>
                    <div className="ml-cell">
                      <span className={`ml-pred ${action.ml_distilbert?.prediction}`}>
                        {action.ml_distilbert?.prediction || 'N/A'}
                      </span>
                      <span className="ml-conf">
                        {action.ml_distilbert?.confidence ? 
                          `${(action.ml_distilbert.confidence * 100).toFixed(0)}%` : ''}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="ml-cell">
                      <span className={`ml-pred ${action.ml_cnn?.prediction}`}>
                        {action.ml_cnn?.prediction || 'N/A'}
                      </span>
                      <span className="ml-conf">
                        {action.ml_cnn?.confidence ? 
                          `${(action.ml_cnn.confidence * 100).toFixed(0)}%` : ''}
                      </span>
                    </div>
                  </td>
                  <td>{action.time_taken?.toFixed(1)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weakness Analysis */}
      <div className="weakness-analysis">
        <h3>🎯 Areas for Improvement</h3>
        <div className="weakness-grid">
          {analytics.weaknesses?.map((weakness, index) => (
            <div key={index} className="weakness-card">
              <h4>{weakness.type}</h4>
              <div className="weakness-stats">
                <div className="stat">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-value" style={{ 
                    color: weakness.accuracy >= 70 ? '#28a745' : '#dc3545' 
                  }}>
                    {weakness.accuracy}%
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Attempts</span>
                  <span className="stat-value">{weakness.attempts}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${weakness.accuracy}%`,
                    backgroundColor: weakness.accuracy >= 70 ? '#28a745' : '#dc3545'
                  }}
                ></div>
              </div>
              <p className="weakness-tip">{weakness.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Data */}
      <div className="export-section">
        <button className="export-btn" onClick={() => exportData()}>
          📥 Export My Data (CSV)
        </button>
        <button className="share-btn" onClick={() => shareResults()}>
          📤 Share Progress with Researcher
        </button>
      </div>
    </div>
  );
}

// Helper functions
function exportData() {
  // Implement CSV export
  alert('Export functionality coming soon!');
}

function shareResults() {
  // Generate shareable link
  const sessionId = localStorage.getItem('sessionId');
  const shareLink = `${window.location.origin}/share/${sessionId}`;
  navigator.clipboard.writeText(shareLink);
  alert('Share link copied to clipboard!');
}