const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const locationRoutes = require("./routes/locationRoutes");
const graphRoutes = require("./routes/graphRoutes");
const { buildGraph } = require("./services/graphService");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/locations", locationRoutes);
app.use("/api/graph", graphRoutes);

// Traffic API
app.get("/api/traffic", async (req, res) => {
    try {
        const [traffic] = await db.query("SELECT * FROM traffic");
        const [roads] = await db.query("SELECT * FROM roads");
        res.json({
            success: true,
            totalMonitoredRoads: roads.length,
            trafficSummary: {
                optimal: roads.filter((_, i) => i % 3 === 0).length,
                moderate: roads.filter((_, i) => i % 3 === 1).length,
                congested: roads.filter((_, i) => i % 3 === 2).length
            },
            data: traffic
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Traffic service error" });
    }
});

// Nearby POI API
app.get("/api/nearby", async (req, res) => {
    const category = (req.query.category || "All").toLowerCase();
    const mockPOIs = [
        { id: 1, name: "Maurya Lok Food Court", category: "Restaurants", rating: 4.5, lat: 25.6175, lng: 85.1380, address: "Dak Bungalow Rd, Patna", status: "Open Now" },
        { id: 2, name: "Barbeque Nation Patna", category: "Restaurants", rating: 4.6, lat: 25.6120, lng: 85.1425, address: "Fraser Road, Patna", status: "Open Now" },
        { id: 3, name: "AIIMS Patna Emergency", category: "Hospitals", rating: 4.8, lat: 25.5601, lng: 85.0450, address: "Phulwari Sharif, Patna", status: "24x7 Open" },
        { id: 4, name: "Paras HMRI Hospital", category: "Hospitals", rating: 4.7, lat: 25.6080, lng: 85.0870, address: "Bailey Road, Raja Bazar, Patna", status: "24x7 Open" },
        { id: 5, name: "Indian Oil Petrol Pump", category: "Gas Stations", rating: 4.3, lat: 25.6140, lng: 85.1220, address: "Boring Canal Rd, Patna", status: "24x7 Open" },
        { id: 6, name: "HP Auto Fuel & EV Station", category: "Gas Stations", rating: 4.4, lat: 25.6015, lng: 85.1150, address: "Bailey Road, Patna", status: "24x7 Open" },
        { id: 7, name: "Hotel Maurya Patna", category: "Hotels", rating: 4.5, lat: 25.6180, lng: 85.1410, address: "South Gandhi Maidan, Patna", status: "Available" },
        { id: 8, name: "State Bank of India ATM", category: "ATMs", rating: 4.2, lat: 25.6150, lng: 85.1300, address: "Boring Road Crossing, Patna", status: "24x7 Active" }
    ];

    const filtered = category === "all" ? mockPOIs : mockPOIs.filter(p => p.category.toLowerCase().includes(category));
    res.json({ success: true, count: filtered.length, data: filtered });
});

// Test Graph Route
app.get("/test-graph", async (req, res) => {
    const roads = await buildGraph();
    res.json({
        success: true,
        message: "Graph Built Successfully",
        totalEdges: roads.length
    });
});

// Root Route
app.get("/", (req, res) => {
    res.send("Google Maps Navigation Simulator Backend Running 🚀");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
