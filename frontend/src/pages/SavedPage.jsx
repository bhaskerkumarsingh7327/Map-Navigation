// src/pages/Saved/SavedPage.jsx
import React from 'react';
import './SavedPage.css';

export default function SavedPage() {
  const bookmarks = [
    { id: 1, label: 'Home Node to Campus', from: 'Patna, Bihar', to: 'Amity University', type: 'Fastest Route', bound: '12.4 KM' },
    { id: 2, label: 'Weekend Excursion Vector', from: 'Patna Junction', to: 'Nalanda', type: 'Eco Friendly', bound: '88.4 KM' }
  ];

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Saved Navigation Vectors</h1>
        <p>Quickly deploy frequently optimized graph configuration structures directly to the viewport layer.</p>
      </div>

      <div className="bookmarks-responsive-grid">
        {bookmarks.map((b) => (
          <div key={b.id} className="bookmark-premium-box">
            <div className="bookmark-top-header">
              <span className="pulse-indicator-dot"></span>
              <h3>{b.label}</h3>
            </div>
            <div className="bookmark-content-card">
              <p><span>Origin:</span> {b.from}</p>
              <div className="dashed-connector-bar"></div>
              <p><span>Target:</span> {b.to}</p>
            </div>
            <div className="bookmark-footer-row">
              <span className="preference-badge-pill">{b.type}</span>
              <strong>{b.bound}</strong>
            </div>
            <button className="btn-deploy-vector-action">Deploy Path Structure</button>
          </div>
        ))}
      </div>
    </div>
  );
}