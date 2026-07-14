// import "./Navbar.css";

// import {
//   FaSearch,
//   FaBell,
//   FaMoon,
//   FaUserCircle,
//   FaMapMarkedAlt
// } from "react-icons/fa";

// function Navbar() {
//   return (
//     <header className="navbar">

//       <div className="navbar-logo">

//         <FaMapMarkedAlt className="logo-icon"/>

//         <div>

//           <h2>Navigation AI</h2>

//           <span>Google Navigation Simulator</span>

//         </div>

//       </div>

//       <div className="navbar-search">

//         <FaSearch className="search-icon"/>

//         <input
//           type="text"
//           placeholder="Search places, routes..."
//         />

//       </div>

//       <div className="navbar-right">

//         <button>

//           <FaBell/>

//         </button>

//         <button>

//           <FaMoon/>

//         </button>

//         <button className="profile-btn">

//           <FaUserCircle/>

//         </button>

//       </div>

//     </header>
//   );
// }

// export default Navbar;
import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="global-navbar">
      <div className="navbar-search-field">
        <input type="text" placeholder="Search for location, places, or routes..." className="nav-input-node" />
      </div>
      <div className="navbar-user-controls">
        <button className="btn-theme-switch">🌙 Dark Mode</button>
        <div className="user-profile-meta">
          <span className="user-display-name">John Singh</span>
          <span className="chevron-icon">▼</span>
        </div>
      </div>
    </header>
  );
}