// import Dashboard from "../components/Layout/Dashboard";

// function Home() {
//   return <Dashboard />;
// }

// export default Home;
// src/pages/Home.jsx
// src/pages/Home.jsx
// import React from 'react';
// import Sidebar from '../components/Sidebar/Sidebar';
// import Navbar from '../components/Navbar/Navbar';
// import MapView from '../components/Map/MapView';
// import SearchPanel from '../components/SearchPanel/SearchPanel';
// import RoutePanel from '../components/RoutePanel/RoutePanel';
// import BottomCards from '../components/BottomCards/BottomCards';
// import { useNavigation } from '../context/NavigationContext';
// import './Home.css';

// export default function Home() {
//   const { routeCoordinates } = useNavigation();

//   return (
//     <div className="system-root-layout">
//       {/* 1. System Navigation Core */}
//       <Sidebar />

//       {/* 2. Workspace Pipeline */}
//       <div className="workspace-pipeline">
//         <Navbar />

//         {/* Grid System */}
//         <div className="core-grid-view">
          
//           {/* Main Map Box Context Area */}
//           <div className="map-wrapper-context">
//             <MapView routeCoordinates={routeCoordinates} />
//             <SearchPanel />
//           </div>

//           {/* Right Metrics Engine */}
//           <div className="right-panel-column">
//             <RoutePanel />
//           </div>

//           {/* Bottom Diagnostics Layer */}
//           <BottomCards />

//         </div>

//         {/* App Footer Standard Context */}
//         <footer className="workspace-footer">
//           <span>© 2026 Google Navigation Simulator | Made with ❤️ by Bhasker Kumar Singh</span>
//           <div className="footer-meta-links">
//             <span>Privacy Policy</span>
//             <span>Terms of Service</span>
//             <span>Support</span>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }


// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import MapView from '../components/Map/MapView';
import SearchPanel from '../components/SearchPanel/SearchPanel';
import RoutePanel from '../components/RoutePanel/RoutePanel';
import BottomCards from '../components/BottomCards/BottomCards';

// Scoped Subpages Modules Direct Imports
import NavigationPage from './NavigationPage';
import HistoryPage from './HistoryPage';
import TrafficPage from './TrafficPage';
import SavedPage from './SavedPage';
import NearbyPage from './NearbyPage';
import SettingsPage from './SettingsPage';

import { useNavigation } from '../context/NavigationContext';
import './Home.css'; 

export default function Home() {
  const { routeCoordinates } = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');
  
  // Real-time notification display framework state
  const [notification, setNotification] = useState(null);

  // Listen to the custom event dispatched from Sidebar initialization action
  useEffect(() => {
    const handleSystemInit = (e) => {
      setNotification({
        message: "DSA Optimization Engine Synced",
        time: e.detail.timestamp,
        status: "Active"
      });

      // Automatically auto-dismiss notification after 4 seconds smoothly
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    };

    window.addEventListener('systemInitTriggered', handleSystemInit);
    return () => window.removeEventListener('systemInitTriggered', handleSystemInit);
  }, []);

  return (
    <div className="enterprise-root-view">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="workspace-pipeline">
        <Navbar />

        <div className="viewport-grid-canvas">
          {activeTab === 'Home' && (
            <>
              <div className="map-canvas-container">
                <MapView routeCoordinates={routeCoordinates} />
                <SearchPanel />
              </div>
              <div className="analytics-sidebar-region">
                <RoutePanel />
              </div>
              <BottomCards />
            </>
          )}

          {activeTab === 'Navigation' && <div className="full-width-subpage-cell"><NavigationPage /></div>}
          {activeTab === 'History' && <div className="full-width-subpage-cell"><HistoryPage /></div>}
          {activeTab === 'Traffic' && <div className="full-width-subpage-cell"><TrafficPage /></div>}
          {activeTab === 'Saved' && <div className="full-width-subpage-cell"><SavedPage /></div>}
          {activeTab === 'Nearby' && <div className="full-width-subpage-cell"><NearbyPage /></div>}
          {activeTab === 'Settings' && <div className="full-width-subpage-cell"><SettingsPage /></div>}
          
          {activeTab === 'About' && (
            <div className="full-width-subpage-cell">
              <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
                <div className="module-intro-meta">
                  <h1>System Architecture Specifications</h1>
                  <p>Enterprise layout configurations for the optimization core dashboard.</p>
                </div>
                
                <div className="interactive-runtime-console" style={{ marginTop: '20px' }}>
                  <div className="console-control-row">
                    <div className="window-action-buttons"><span></span><span></span><span></span></div>
                    <span>PLATFORM_METRICS_LOG</span>
                  </div>
                  <div className="console-output-stream" style={{ padding: '28px' }}>
                    <p><span className="token-blue">[APPLICATION]:</span> Google Navigation Simulator Engine v1.0.0 Stable</p>
                    <p><span className="token-blue">[FRONTEND]:</span> React 18+ Layout System initialized with CSS Isolation Modules.</p>
                    <p><span className="token-blue">[BACKEND]:</span> Express.js Wrapper Core via Node.js Execution Context Hooks.</p>
                    <p><span className="token-green">[ALGORITHMS]:</span> Native C++ Matrix Engine compiled with MySQL Persistence.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            🚀 PREMIUM: Floating Toast Alert System View
           ========================================== */}
        {notification && (
          <div className="apple-toast-alert-card premium-fade-in">
            <div className="toast-pulse-green"></div>
            <div className="toast-text-content">
              <h4>{notification.message}</h4>
              <p>Core status initialized at {notification.time} successfully.</p>
            </div>
          </div>
        )}

        <footer className="global-system-footer">
          <span>&copy; 2026 Maps Engine Simulator Framework</span>
        </footer>
      </div>
    </div>
  );
}