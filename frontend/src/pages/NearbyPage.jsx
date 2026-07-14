// src/pages/Nearby/NearbyPage.jsx
import React, { useState } from 'react';
import './NearbyPage.css';

export default function NearbyPage() {
  const [filterMode, setFilterMode] = useState('All');
  const filters = ['All', 'Restaurants', 'Hospitals', 'Gas Stations'];
  
  const nodes = [
    { id: 1, name: 'Maurya Lok Complex', category: 'Restaurants', radius: '1.2 KM', status: 'Active Node' },
    { id: 2, name: 'AIIMS Patna', category: 'Hospitals', radius: '4.5 KM', status: '24x7 Verified' }
  ];

  const processedItems = filterMode === 'All' ? nodes : nodes.filter(n => n.category === filterMode);

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Points of Interest Matrix</h1>
        <p>Discover surrounding coordinate positions metrics classified by operational category indexes.</p>
      </div>

      <div className="pill-scroll-track">
        {filters.map(f => (
          <button 
            key={f}
            className={`enterprise-filter-pill-node ${filterMode === f ? 'pill-is-selected' : ''}`}
            onClick={() => setFilterMode(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="poi-cards-layout-matrix">
        {processedItems.map(poi => (
          <div key={poi.id} className="poi-native-card-cell">
            <div className="poi-cell-top-flex">
              <h4>{poi.name}</h4>
              <span className="poi-active-status-tag">{poi.status}</span>
            </div>
            <div className="poi-cell-bottom-flex">
              <span className="poi-type-label-text">{poi.category}</span>
              <strong>{poi.radius}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}