// function BottomCards() {
//   return (
//     <div>
//       Bottom Cards
//     </div>
//   );
// }

// export default BottomCards;
import React from 'react';
import './BottomCards.css';

export default function BottomCards() {
  return (
    <div className="premium-bottom-dashboard-grid">
      <div className="dashboard-widget-card-node">
        <div className="card-header-flex">
          <h4>Live Traffic</h4>
          <span className="live-badge-pulse">● Live</span>
        </div>
        <div className="mock-sparkline-graph">
          <div className="spark-bar" style={{height: '40%'}}></div>
          <div className="spark-bar" style={{height: '60%'}}></div>
          <div className="spark-bar" style={{height: '35%'}}></div>
          <div className="spark-bar red-spark" style={{height: '80%'}}></div>
          <div className="spark-bar" style={{height: '50%'}}></div>
        </div>
      </div>
      
      <div className="dashboard-widget-card-node">
        <h4>Nearby Places</h4>
        <div className="poi-chips-scroller">
          <button className="poi-chip-interactive">Restaurants</button>
          <button className="poi-chip-interactive">Hotels</button>
          <button className="poi-chip-interactive">Fuel Stations</button>
        </div>
      </div>

      <div className="dashboard-widget-card-node">
        <h4>Weather Today</h4>
        <div className="weather-split-data">
          <span className="weather-temp-num">28°C</span>
          <div className="weather-location-text">
            <strong>Patna</strong>
            <p>Partly Cloudy</p>
          </div>
        </div>
      </div>
    </div>
  );
}