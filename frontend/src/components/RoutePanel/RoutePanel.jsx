// import "./RoutePanel.css";

// import {
//   FaClock,
//   FaRoad,
//   FaGasPump,
//   FaTrafficLight,
//   FaRoute,
//   FaLeaf
// } from "react-icons/fa";

// function RoutePanel() {
//   return (
//     <div className="route-card">

//       <h2>Route Overview</h2>

//       <div className="route-stats">

//         <div className="stat">
//           <FaRoad />
//           <div>
//             <span>Distance</span>
//             <h3>82 km</h3>
//           </div>
//         </div>

//         <div className="stat">
//           <FaClock />
//           <div>
//             <span>ETA</span>
//             <h3>1 hr 42 min</h3>
//           </div>
//         </div>

//       </div>

//       <div className="route-type">

//         <div className="option active">
//           <FaRoute />
//           <div>
//             <h4>Fastest</h4>
//             <p>1h 42m</p>
//           </div>
//         </div>

//         <div className="option">
//           <FaLeaf />
//           <div>
//             <h4>Eco</h4>
//             <p>1h 55m</p>
//           </div>
//         </div>

//       </div>

//       <div className="info-box">

//         <div>
//           <FaTrafficLight />
//           <span>Traffic</span>
//           <strong>Moderate</strong>
//         </div>

//         <div>
//           <FaGasPump />
//           <span>Fuel</span>
//           <strong>≈ 5.8 L</strong>
//         </div>

//       </div>

//       <button className="navigate-btn">

//         Start Navigation

//       </button>

//     </div>
//   );
// }

// export default RoutePanel;

// import React from 'react';
// import { useNavigation } from '../../context/NavigationContext';
// import './RoutePanel.css';

// export default function RoutePanel() {
//   const { routeInfo } = useNavigation();

//   return (
//     <div className="premium-analytics-sidebar-card">
//       <div className="panel-header-section">
//         <h3>Route Information</h3>
//       </div>

//       <div className="metrics-grid-stack">
//         <div className="metric-row-item">
//           <span className="lbl-node">Distance</span>
//           <span className="val-node">{routeInfo.distance}</span>
//         </div>
//         <div className="metric-row-item">
//           <span className="lbl-node">Estimated Time</span>
//           <span className="val-node-highlight">{routeInfo.estimatedTime}</span>
//         </div>
//         <div className="metric-row-item">
//           <span className="lbl-node">Traffic Condition</span>
//           <span className="val-node status-warning-pill">{routeInfo.trafficCondition}</span>
//         </div>
//         <div className="metric-row-item">
//           <span className="lbl-node">Road Type</span>
//           <span className="val-node">Highway</span>
//         </div>
//       </div>

//       <hr className="divider-soft" />

//       <div className="route-comparison-module">
//         <h4>Route Overview</h4>
//         <div className="progress-gradient-track">
//           <div className="fill-chunk fill-red" style={{ width: '60%' }}></div>
//           <div className="fill-chunk fill-blue" style={{ width: '40%' }}></div>
//         </div>

//         <div className="comparison-flex-box">
//           <div className="comp-block active-comp">
//             <span className="comp-title">Fastest</span>
//             <span className="comp-meta text-green">1 hr 45 min</span>
//           </div>
//           <div className="comp-block">
//             <span className="comp-title">Shortest</span>
//             <span className="comp-meta">95.2 KM</span>
//           </div>
//         </div>
//       </div>

//       <div className="alternative-routes-section">
//         <h4>Alternative Routes</h4>
//         <div className="alt-route-list-node">
//           <span className="alt-route-title">Via NH 31</span>
//           <span className="alt-route-time">1 hr 55 min</span>
//         </div>
//         <div className="alt-route-list-node">
//           <span className="alt-route-title">Via NH 20</span>
//           <span className="alt-route-time">2 hr 05 min</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigation } from "../../context/NavigationContext";
import "./RoutePanel.css";

export default function RoutePanel() {

  const {
    routeInfo,
    routeData,
    loading,
    error,
  } = useNavigation();

  return (
    <div className="premium-analytics-sidebar-card">

      <div className="panel-header-section">
        <h3>Route Information</h3>
      </div>

      {loading && (
        <p style={{ marginBottom: "12px" }}>
          Calculating Route...
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "12px",
          }}
        >
          {error}
        </p>
      )}

      <div className="metrics-grid-stack">

        <div className="metric-row-item">
          <span className="lbl-node">
            Distance
          </span>

          <span className="val-node">
            {routeInfo.distance}
          </span>
        </div>

        <div className="metric-row-item">

          <span className="lbl-node">
            Estimated Time
          </span>

          <span className="val-node-highlight">
            {routeInfo.estimatedTime}
          </span>

        </div>

        <div className="metric-row-item">

          <span className="lbl-node">
            Traffic Condition
          </span>

          <span className="val-node status-warning-pill">
            {routeInfo.trafficCondition}
          </span>

        </div>

        <div className="metric-row-item">

          <span className="lbl-node">
            Road Type
          </span>

          <span className="val-node">
            {routeInfo.roadType}
          </span>

        </div>

      </div>

      <hr className="divider-soft" />

      <div className="route-comparison-module">

        <h4>
          Route Overview
        </h4>

        <div className="progress-gradient-track">

          <div
            className="fill-chunk fill-red"
            style={{ width: "60%" }}
          ></div>

          <div
            className="fill-chunk fill-blue"
            style={{ width: "40%" }}
          ></div>

        </div>

        <div className="comparison-flex-box">

          <div className="comp-block active-comp">

            <span className="comp-title">
              Fastest
            </span>

            <span className="comp-meta text-green">
              {routeInfo.estimatedTime}
            </span>

          </div>

          <div className="comp-block">

            <span className="comp-title">
              Shortest
            </span>

            <span className="comp-meta">
              {routeInfo.distance}
            </span>

          </div>

        </div>

      </div>

      <div className="alternative-routes-section">

        <h4>
          Alternative Routes
        </h4>

        <div className="alt-route-list-node">

          <span className="alt-route-title">
            Via NH 31
          </span>

          <span className="alt-route-time">
            {routeInfo.estimatedTime}
          </span>

        </div>

        <div className="alt-route-list-node">

          <span className="alt-route-title">
            Via NH 20
          </span>

          <span className="alt-route-time">

            {routeData
              ? "Available"
              : "Pending"}

          </span>

        </div>

      </div>

    </div>
  );

}