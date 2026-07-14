// src/pages/Settings/SettingsPage.jsx
import React, { useState } from 'react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [matrixCache, setMatrixCache] = useState(true);

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Simulator Environment Settings</h1>
        <p>Configure interface options parameters and state variables preferences.</p>
      </div>

      <div className="settings-split-column-frame">
        <div className="settings-card-group-wrapper">
          <h3>Simulation Parameters</h3>
          <div className="switch-flex-row-item">
            <div>
              <strong>Matrix Pre-Caching Loop</strong>
              <p>Store Floyd-Warshall pre-calculations blocks inside local cache arrays variables.</p>
            </div>
            <div className={`switch-toggle-track ${matrixCache ? 'track-is-on' : ''}`} onClick={() => setMatrixCache(!matrixCache)}>
              <div className="switch-toggle-thumb-node"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}