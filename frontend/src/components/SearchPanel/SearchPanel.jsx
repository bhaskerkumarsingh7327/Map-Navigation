
// import "./SearchPanel.css";

// import {
//   FaMicrophone,
//   FaExchangeAlt,
//   FaSearch,
//   FaCar,
//   FaWalking,
//   FaBicycle,
//   FaBus,
//   FaHome,
//   FaBriefcase,
//   FaUniversity
// } from "react-icons/fa";

// function SearchPanel() {
//   return (
//     <div className="search-panel">

//       <h2>Plan Your Journey</h2>

//       <div className="search-field">

//         <label>Current Location</label>

//         <div className="input-box">

//           <input
//             type="text"
//             placeholder="Enter current location"
//           />

//         </div>

//       </div>

//       <div className="swap-btn">

//         <FaExchangeAlt />

//       </div>

//       <div className="search-field">

//         <label>Destination</label>

//         <div className="input-box">

//           <input
//             type="text"
//             placeholder="Search destination"
//           />

//           <button>

//             <FaMicrophone />

//           </button>

//         </div>

//       </div>

//       <div className="travel-mode">

//         <button className="active">
//           <FaCar />
//         </button>

//         <button>
//           <FaWalking />
//         </button>

//         <button>
//           <FaBicycle />
//         </button>

//         <button>
//           <FaBus />
//         </button>

//       </div>

//       <div className="quick-title">

//         Quick Places

//       </div>

//       <div className="quick-places">

//         <button>
//           <FaHome />
//           Home
//         </button>

//         <button>
//           <FaBriefcase />
//           Office
//         </button>

//         <button>
//           <FaUniversity />
//           College
//         </button>

//       </div>

//       <button className="route-btn">

//         <FaSearch />

//         Find Route

//       </button>

//     </div>
//   );
// }

// export default SearchPanel;
// import React from 'react';
// import { useNavigation } from '../../context/NavigationContext';
// import './SearchPanel.css';

// export default function SearchPanel() {
//   const { source, setSource, destination, setDestination, routePreference, setRoutePreference } = useNavigation();

//   return (
//     <div className="premium-search-overlay-card">
//       <div className="custom-input-group-wrapper">
//         <div className="input-node-block">
//           <div className="node-indicator source-indicator-dot"></div>
//           <div className="input-inner-content">
//             <span className="input-subtext-label">Your Location</span>
//             <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
//           </div>
//         </div>

//         <div className="input-node-block">
//           <div className="node-indicator dest-indicator-dot"></div>
//           <div className="input-inner-content">
//             <span className="input-subtext-label">Destination</span>
//             <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
//           </div>
//         </div>
//       </div>

//       <div className="preference-select-row">
//         <label>Route Preference</label>
//         <select value={routePreference} onChange={(e) => setRoutePreference(e.target.value)} className="pref-native-select">
//           <option>Fastest Route</option>
//           <option>Shortest Route</option>
//           <option>Eco Friendly</option>
//         </select>
//       </div>

//       <button className="primary-engine-submit-btn">Find Shortest Route</button>

//       <div className="quick-access-pills-row">
//         <button className="pill-action-node">Home</button>
//         <button className="pill-action-node">Work</button>
//         <button className="pill-action-node">College</button>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { useNavigation } from "../../context/NavigationContext";
import { getShortestPath } from "../../services/api";
import "./SearchPanel.css";

export default function SearchPanel() {
  const {
    source,
    setSource,
    destination,
    setDestination,
    routePreference,
    setRoutePreference,

    // Backend States
    setRouteData,
    setRouteInfo,
    setRouteCoordinates,
    setLoading,
    setError,

  } = useNavigation();

  // Backend Connection
  const handleFindRoute = async () => {

    try {

      if (!source || !destination) {
        alert("Please enter Source and Destination");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await getShortestPath(
        source,
        destination
      );

      console.log("✅ Backend Response:", response);

      if (response.success) {

        // Save complete backend response
        setRouteData(response.data);

        // Update Map Coordinates
        if (response.data.coordinates) {
          setRouteCoordinates(
            response.data.coordinates
          );
        }

        // Update Route Panel
        setRouteInfo({

          distance:
            (response.data.distance || 0) + " KM",

          estimatedTime:
            response.data.estimatedTime ||
            "Calculating...",

          trafficCondition:
            response.data.trafficCondition ||
            "Checking...",

          roadType:
            routePreference,

        });

      }

      else {

        setError(
          "Unable to calculate shortest path"
        );

      }

    }

    catch (error) {

      console.error("❌ Backend Error:", error);

      setError("Backend Connection Failed");

      alert("Backend Connection Failed");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="premium-search-overlay-card">

      <div className="custom-input-group-wrapper">

        <div className="input-node-block">

          <div className="node-indicator source-indicator-dot"></div>

          <div className="input-inner-content">

            <span className="input-subtext-label">

              Your Location

            </span>

            <input
              type="text"
              value={source}
              onChange={(e) =>
                setSource(e.target.value)
              }
            />

          </div>

        </div>

        <div className="input-node-block">

          <div className="node-indicator dest-indicator-dot"></div>

          <div className="input-inner-content">

            <span className="input-subtext-label">

              Destination

            </span>

            <input
              type="text"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            />

          </div>

        </div>

      </div>

      <div className="preference-select-row">

        <label>

          Route Preference

        </label>

        <select
          value={routePreference}
          onChange={(e) =>
            setRoutePreference(e.target.value)
          }
          className="pref-native-select"
        >

          <option>

            Fastest Route

          </option>

          <option>

            Shortest Route

          </option>

          <option>

            Eco Friendly

          </option>

        </select>

      </div>

      <button
        className="primary-engine-submit-btn"
        onClick={handleFindRoute}
      >

        Find Shortest Route

      </button>

      <div className="quick-access-pills-row">

        <button className="pill-action-node">

          Home

        </button>

        <button className="pill-action-node">

          Work

        </button>

        <button className="pill-action-node">

          College

        </button>

      </div>

    </div>

  );
}