import React, { useState, useEffect } from "react";
import BaseLevel from "./BaseLevel";

export default function ImageLevel() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

  const imageStyles = `
    .image-analysis-container {
      max-width: 1000px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .image-header {
      background: #202124;
      color: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .image-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .image-title h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .live-analysis-badge {
      background: #ea4335;
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      animation: pulse 2s infinite;
    }

    .image-controls {
      display: flex;
      gap: 8px;
    }

    .control-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }

    .control-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .image-workspace {
      display: grid;
      grid-template-columns: 1fr 300px;
      background: #f8f9fa;
    }

    .image-viewer {
      padding: 24px;
      background: #fff;
      border-right: 1px solid #e0e0e0;
    }

    .image-container {
      position: relative;
      background: #f1f3f4;
      border-radius: 8px;
      overflow: hidden;
      cursor: crosshair;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .suspicious-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .suspicious-area {
      position: absolute;
      border: 3px solid #ea4335;
      background: rgba(234,67,53,0.1);
      pointer-events: none;
      animation: pulse 2s infinite;
    }

    .suspicious-area:hover {
      background: rgba(234,67,53,0.2);
    }

    .area-label {
      position: absolute;
      top: -25px;
      left: 0;
      background: #ea4335;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
    }

    .image-zoom-controls {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      justify-content: center;
    }

    .zoom-btn {
      padding: 8px 16px;
      border: 1px solid #dadce0;
      background: #fff;
      border-radius: 20px;
      cursor: pointer;
    }

    .zoom-btn:hover {
      background: #f1f3f4;
    }

    .analysis-panel {
      padding: 20px;
      background: #fff;
      overflow-y: auto;
      max-height: 600px;
    }

    .analysis-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #202124;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f1f3f4;
    }

    .suspicious-element {
      background: #fce8e6;
      border: 1px solid #fad2cf;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }

    .element-title {
      font-weight: 600;
      color: #d93025;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .element-description {
      font-size: 13px;
      color: #5f6368;
    }

    .risk-meter {
      background: #f1f3f4;
      border-radius: 12px;
      height: 8px;
      margin: 12px 0;
      overflow: hidden;
    }

    .risk-fill {
      height: 100%;
      background: #ea4335;
      border-radius: 12px;
      transition: width 0.3s ease;
    }

    .risk-fill.medium {
      background: #fbbc04;
    }

    .risk-fill.low {
      background: #34a853;
    }

    .image-metadata {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      font-size: 13px;
    }

    .metadata-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed #e0e0e0;
    }

    .metadata-label {
      color: #5f6368;
    }

    .metadata-value {
      color: #202124;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .image-action {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 120px;
    }

    .image-action.warning {
      background: #fce8e6;
      color: #d93025;
    }

    .image-action.warning:hover:not(:disabled) {
      background: #fad2cf;
    }

    .image-action.success {
      background: #e6f4ea;
      color: #137333;
    }

    .image-action.secondary {
      background: #f1f3f4;
      color: #5f6368;
    }

    .image-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tooltip {
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      max-width: 200px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }
  `;

  return (
    <>
      <style>{imageStyles}</style>
      <BaseLevel levelType="image">
        {({ level, onAction, locked }) => (
          <div className="image-analysis-container">
            <div className="image-header">
              <div className="image-title">
                <span>🖼️</span>
                <h2>{level.page_title || 'Visual Analysis'}</h2>
                <span className="live-analysis-badge">AI ANALYSIS</span>
              </div>
              <div className="image-controls">
                <button className="control-btn" onClick={() => setShowAnalysis(!showAnalysis)}>
                  📊 {showAnalysis ? 'Hide' : 'Show'} Analysis
                </button>
                <button className="control-btn">
                  📥 Export
                </button>
              </div>
            </div>

            <div className="image-workspace">
              <div className="image-viewer">
                <div 
                  className="image-container"
                  style={{ transform: `scale(${zoomLevel})` }}
                  onMouseMove={(e) => {
                    // Show tooltips on hover
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    level.suspicious_areas?.forEach(area => {
                      if (x >= area.x && x <= area.x + area.width &&
                          y >= area.y && y <= area.y + area.height) {
                        setHoveredElement(area);
                      }
                    });
                  }}
                >
                  {/* Base image */}
                  <img 
                    src={level.image_url || 'https://via.placeholder.com/600x400'} 
                    alt="Analysis"
                    style={{ maxWidth: '100%', display: 'block' }}
                  />

                  {/* Suspicious areas overlay */}
                  <div className="suspicious-overlay">
                    {level.suspicious_areas?.map((area, idx) => (
                      <div
                        key={idx}
                        className="suspicious-area"
                        style={{
                          left: `${area.x}px`,
                          top: `${area.y}px`,
                          width: `${area.width}px`,
                          height: `${area.height}px`
                        }}
                      >
                        <span className="area-label">⚠️ {area.label}</span>
                      </div>
                    ))}
                  </div>

                  {hoveredElement && (
                    <div 
                      className="tooltip"
                      style={{
                        left: hoveredElement.x + hoveredElement.width / 2,
                        top: hoveredElement.y - 30
                      }}
                    >
                      <strong>{hoveredElement.label}</strong>
                      <p>{hoveredElement.description}</p>
                    </div>
                  )}
                </div>

                <div className="image-zoom-controls">
                  <button className="zoom-btn" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}>-</button>
                  <span className="zoom-btn" style={{ minWidth: '60px' }}>{Math.round(zoomLevel * 100)}%</span>
                  <button className="zoom-btn" onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}>+</button>
                </div>
              </div>

              <div className="analysis-panel">
                <div className="analysis-section">
                  <div className="section-title">AI Analysis Results</div>
                  <div className="risk-meter">
                    <div 
                      className={`risk-fill ${level.risk_level || 'high'}`}
                      style={{ width: `${level.risk_score || 85}%` }}
                    />
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '8px' }}>
                    Risk Score: {level.risk_score || 85}% - {level.risk_level || 'HIGH'}
                  </p>
                </div>

                <div className="analysis-section">
                  <div className="section-title">Suspicious Elements Found</div>
                  {level.suspicious_elements?.map((element, idx) => (
                    <div key={idx} className="suspicious-element">
                      <div className="element-title">
                        <span>⚠️</span>
                        <span>{element.type}</span>
                      </div>
                      <div className="element-description">
                        {element.description}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <small>Confidence: {element.confidence}%</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="analysis-section">
                  <div className="section-title">Image Metadata</div>
                  <div className="image-metadata">
                    <div className="metadata-row">
                      <span className="metadata-label">File Name</span>
                      <span className="metadata-value">{level.file_name || 'image_001.jpg'}</span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Dimensions</span>
                      <span className="metadata-value">{level.dimensions || '1920x1080'}</span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">File Size</span>
                      <span className="metadata-value">{level.file_size || '2.4 MB'}</span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Modified</span>
                      <span className="metadata-value">{level.modified_date || '2024-01-15'}</span>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="image-action warning"
                    disabled={locked}
                    onClick={() => onAction('report', { 
                      image_id: level.id,
                      suspicious_elements: level.suspicious_elements
                    })}
                  >
                    🚫 Report Image
                  </button>
                  <button
                    className="image-action secondary"
                    disabled={locked}
                    onClick={() => onAction('ignore', { 
                      image_id: level.id 
                    })}
                  >
                    ⏭️ Ignore
                  </button>
                  <button
                    className="image-action success"
                    disabled={locked}
                    onClick={() => onAction('safe', { 
                      image_id: level.id 
                    })}
                  >
                    ✅ Safe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}