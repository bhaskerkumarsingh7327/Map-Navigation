const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const locationRoutes = require("./routes/locationRoutes");
const { buildGraph } = require("./services/graphService");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/locations", locationRoutes);
const graphRoutes = require("./routes/graphRoutes");
app.use("/api/graph", graphRoutes);
app.get("/test-graph", async (req, res) => {

    const graph = await buildGraph();

    res.json({
        success: true,
        message: "Graph Built Successfully"
    });

});
app.get("/test-db-graph", async (req, res) => {
    try {
        const roads = await buildGraph();

        res.json({
            success: true,
            totalRoads: roads.length,
            data: roads
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Google Maps Navigation Simulator Backend Running 🚀");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});