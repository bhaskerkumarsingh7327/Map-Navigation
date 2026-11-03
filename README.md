# 🗺️ Google Navigation Simulator v2.0 (Google Maps Clone)

An enterprise-grade, full-featured **Google Maps Navigation Web Application** built with **React 19**, **Leaflet**, **Express.js**, and an ultra-fast **C++17 Dijkstra Graph Algorithm Engine**.

---

## 🚀 Key Features (Google Map जैसा संपूर्ण अनुभव)

### 1. 🛣️ Real-Time Turn-by-Turn Road Routing
- **Dual Routing Engine**:
  - **Live Road Engine (OSRM)**: Real-world road curvature geometries, turn maneuvers ("Turn left onto Bailey Road", "Take 2nd exit at roundabout"), live distance & ETA calculation.
  - **DSA C++ Dijkstra Engine**: Native compiled Clang C++17 binary computing shortest path across custom topological graph adjacency matrices.
- **Multiple Travel Modes**:
  - 🚗 Driving (Car)
  - 🏍️ Two-Wheeler (Motorcycle/Scooter)
  - 🚌 Public Transit
  - 🚶 Walking
  - 🚲 Cycling
- **Alternative Routes**: Compare primary route vs secondary paths (e.g. "+13m slower via NH 20") with 1-click on-map switching!

### 2. 🧭 In-Car GPS Live Navigation HUD Mode
- Click **"Start Navigation"** to enter true in-car Google Maps HUD:
  - **Top Maneuver Card**: Big green Google navigation banner (`#0F9D58`) with directional turn icons (left, right, roundabout, straight), distance countdown ("In 350 m"), and upcoming street names.
  - **3D Animated Vehicle Marker**: A navigation arrow marker that moves smoothly along the route path with dynamic road bearing rotation.
  - **Voice Guidance**: Speaks directions aloud using browser Web Speech API (Text-to-Speech) with mute/unmute control.
  - **Bottom Status Drawer**: Live countdown of remaining distance, remaining travel time, ETA arrival time, and speed indicator (km/h).

### 3. 🔍 Real-Time Search & Autocomplete
- Search any location, landmark, or address in India & globally (e.g. *Patna, Nalanda, Delhi, AIIMS Patna, Boring Road, Airport, Connaught Place*).
- Instant debounce autocomplete dropdown with location type badges (airport, transit, hospital, city).
- **"Use Current Location"** button using HTML5 GPS Geolocation with reverse geocoding.
- Instant Origin/Destination Swap button (↕).

### 4. 🗺️ Interactive Map & Layer Switcher
- **Multiple Map Layers**:
  - **Standard**: Google/Carto Clean Light Street Map
  - **Satellite**: High-resolution Esri World Imagery + Hybrid place labels
  - **Dark Mode**: Carto Dark Matter (Night navigation view)
  - **Terrain**: OpenTopoMap topographic contours
- **Traffic Layer Overlay**: Visual green/orange/red congestion polylines directly on the road.
- **Draggable Pins**: Drag Starting Point (A) or Destination (B) anywhere on the map to automatically recalculate the road route.
- **Map Click Inspector**: Click anywhere to drop a pin, view reverse-geocoded coordinates, and choose "Directions from here", "Directions to here", or "Save Place".
- **Floating Controls**: Zoom In/Out, Locate Me, Reset North/Compass, Layers Picker, and Fullscreen toggle.

### 5. 📍 Discover Nearby Points of Interest (POIs)
- 1-click filter pills for:
  - ⛽ Petrol Pumps & EV Stations
  - 🍽️ Restaurants & Dining
  - 🏥 Hospitals & Emergency Centers
  - 🏨 Hotels & Lodging
  - 🏧 ATMs & Cash
- Displays POI markers on the map with rating, address, opening status, and 1-click "Directions" button.

### 6. ⭐ Saved Places & Collections
- Save favorites, Home, Work, and customized routes.
- Fully persistent in browser `localStorage`.
- Add custom locations and launch instant 1-click directions.

### 7. 🕒 Trip History & Recents
- Automatically logs all calculated routes with timestamp, mode, distance, and duration.
- 1-click "Re-Route" action to instantly load any past journey.

### 8. 🚦 Live Traffic Density Simulator
- Modify matrix edge weights dynamically to simulate Rush Hour Gridlocks (+28 min delay) vs Low Night Flow (-15 min).
- Real-time impact reflected in RoutePanel and map polyline colors.

### 9. ⚡ DSA Algorithm Core Lab
- Interactive benchmark comparison between:
  - **Dijkstra** (`O(E + V log V)`)
  - **A* Search** (`O(b^d)`)
  - **Bellman-Ford** (`O(VE)`)
  - **Floyd-Warshall** (`O(V³)`)
- Live simulated terminal monitor with C++ binary status.

---

## 🛠️ Project Architecture

```
GOOGLE NAVIGATION/
├── backend/
│   ├── algorithms/
│   │   ├── dijkstra.cpp      # C++ Dijkstra implementation
│   │   ├── graph.cpp         # C++ Graph adjacency list
│   │   ├── main.cpp          # CLI entrypoint for C++ engine
│   │   ├── graph.txt         # Topological road network weights
│   │   └── graph             # Compiled native C++ binary
│   ├── config/
│   │   └── db.js             # Resilient database connector (MySQL + In-Memory fallback)
│   ├── controllers/
│   │   ├── graphController.js
│   │   └── locationController.js
│   ├── models/
│   │   └── locationModel.js
│   ├── routes/
│   │   ├── graphRoutes.js
│   │   └── locationRoutes.js
│   └── server.js             # Express.js REST API
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/          # Leaflet map, layers, custom pins
│   │   │   ├── NavigationHUD/# Full in-car GPS turn-by-turn navigation HUD
│   │   │   ├── SearchPanel/  # Google floating search & travel mode picker
│   │   │   ├── RoutePanel/   # Route overview, steps accordion, start button
│   │   │   ├── Navbar/       # Global search, theme toggle, time
│   │   │   ├── Sidebar/      # Navigation drawer
│   │   │   └── BottomCards/  # Quick traffic, nearby, weather widgets
│   │   ├── context/
│   │   │   └── NavigationContext.jsx # Central state & audio voice engine
│   │   ├── pages/            # Home, Nearby, Saved, History, Traffic, Settings
│   │   └── services/
│   │       └── api.js        # Universal routing & geocoding client
└── package.json              # Root build & run scripts
```

---

## 💻 How to Run (Kaise Chalayein)

### 1. Compile C++ Graph Engine (Optional / One-time)
```bash
npm run build:cpp
```

### 2. Start Frontend
```bash
npm run dev:frontend
# OR
cd frontend && npm run dev
```
Open your browser at: **`http://localhost:5175`**

### 3. Start Backend (Optional)
```bash
npm run dev:backend
# OR
cd backend && npm start
```
Runs at: **`http://localhost:3000`**

*(Note: Even if the backend or MySQL is not running, the application smoothly runs with the built-in resilient in-memory database and real-time road routing!)*

