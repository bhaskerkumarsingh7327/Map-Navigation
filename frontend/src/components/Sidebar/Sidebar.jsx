// import "./Sidebar.css";

// import {
//   FaCompass,
//   FaRoute,
//   FaMapMarkedAlt,
//   FaTrafficLight,
//   FaHistory,
//   FaHeart,
//   FaCog,
//   FaArrowRight
// } from "react-icons/fa";

// function Sidebar() {

//   return (

//     <aside className="sidebar">

//       <div>

//         <h5 className="sidebar-heading">
//           MAIN MENU
//         </h5>

//         <nav className="sidebar-menu">

//           <button className="active">
//             <FaCompass />
//             <span>Dashboard</span>
//           </button>

//           <button>
//             <FaMapMarkedAlt />
//             <span>Explore</span>
//           </button>

//           <button>
//             <FaRoute />
//             <span>Live Navigation</span>
//           </button>

//           <button>
//             <FaTrafficLight />
//             <span>Traffic</span>
//           </button>

//           <button>
//             <FaHistory />
//             <span>History</span>
//           </button>

//           <button>
//             <FaHeart />
//             <span>Saved Routes</span>
//           </button>

//           <button>
//             <FaCog />
//             <span>Settings</span>
//           </button>

//         </nav>

//       </div>

//       <div className="sidebar-card">

//         <h3>Navigation AI</h3>

//         <p>

//           Discover smarter routes using
//           Graph Algorithms & Real-time Navigation.

//         </p>

//         <button>

//           Start Exploring

//           <FaArrowRight />

//         </button>

//       </div>

//     </aside>

//   );

// }

// export default Sidebar;
// src/components/Sidebar/Sidebar.jsx
// src/components/Sidebar/Sidebar.jsx
// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = ['Home', 'Navigation', 'History', 'Saved', 'Traffic', 'Nearby', 'About', 'Settings'];
  
  // Real-time system state track karne ke liye premium state controller
  const [isSystemOnline, setIsSystemOnline] = useState(false);

  const handleSystemInitialization = () => {
    setIsSystemOnline(true);
    // Custom trigger parameters dispatch loops taaki main modules responsive load ho sakein
    const event = new CustomEvent('systemInitTriggered', { 
      detail: { timestamp: new Date().toLocaleTimeString() } 
    });
    window.dispatchEvent(event);
  };

  return (
    <aside className="apple-sidebar-container">
      <div className="sidebar-brand-wrapper">
        <div className="brand-vector-icon">
          <div className="inner-pulse-core"></div>
        </div>
        <h2>Maps Engine</h2>
      </div>

      <nav className="sidebar-nav-list">
        {menuItems.map((item) => (
          <button
            key={item}
            className={`sidebar-nav-btn ${activeTab === item ? 'is-active-pill' : ''}`}
            onClick={() => setActiveTab(item)}
          >
            <span className="nav-bullet-indicator"></span>
            <span className="nav-btn-text">{item}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer-cta">
        <h4>Smart Guidance</h4>
        <p>Advanced real-time DSA path optimization pipeline.</p>
        
        {/* Dynamic State Buttons Switch */}
        <button 
          className={`cta-action-trigger ${isSystemOnline ? 'system-active-glow' : ''}`}
          onClick={handleSystemInitialization}
          disabled={isSystemOnline}
        >
          {isSystemOnline ? '● System Online' : 'Initialize System'}
        </button>
      </div>
    </aside>
  );
}