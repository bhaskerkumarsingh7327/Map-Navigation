// import "./Dashboard.css";

// import Navbar from "../Navbar/Navbar";
// import Sidebar from "../Sidebar/Sidebar";
// import Map from "../Map/Map";
// import SearchPanel from "../SearchPanel/SearchPanel";
// import RoutePanel from "../RoutePanel/RoutePanel";
// import MapControls from "../MapControls/MapControls";

// function Dashboard() {
//   return (
//     <>
//       <Navbar />

//       <div className="dashboard">

//         <Sidebar />

//         <main className="dashboard-main">

//           <Map />

//           {/* <MapControls /> */}

//           <SearchPanel />

//           <RoutePanel />

//         </main>

//       </div>
//     </>
//   );
// }

// export default Dashboard;
import "./Dashboard.css";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import Map from "../Map/Map";
import SearchPanel from "../SearchPanel/SearchPanel";
import RoutePanel from "../RoutePanel/RoutePanel";

import TrafficWidget from "../Widgets/TrafficWidget/TrafficWidget";
import NearbyWidget from "../Widgets/NearbyWidget/NearbyWidget";
import WeatherWidget from "../Widgets/WeatherWidget/WeatherWidget";

import FloatingControls from "../FloatingControls/FloatingControls";

function Dashboard() {
  return (
    <div className="dashboard">

      <Navbar />

      <div className="dashboard-body">

        <Sidebar />

        <main className="dashboard-main">

          <Map />

          <FloatingControls />

          <SearchPanel />

          <RoutePanel />

          <div className="dashboard-bottom">

            <TrafficWidget />

            <NearbyWidget />

            <WeatherWidget />

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;