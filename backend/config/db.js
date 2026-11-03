require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

let isMySQLConnected = false;
let pool = null;

// Built-in resilient in-memory database store
const inMemoryData = {
    locations: [
        { id: 1, name: "Patna", latitude: 25.6110, longitude: 85.1440 },
        { id: 2, name: "Patna Junction", latitude: 25.6025, longitude: 85.1376 },
        { id: 3, name: "Boring Road Patna", latitude: 25.6172, longitude: 85.1189 },
        { id: 4, name: "Gandhi Maidan Patna", latitude: 25.6190, longitude: 85.1438 },
        { id: 5, name: "Amity University Patna", latitude: 25.5892, longitude: 85.0592 },
        { id: 6, name: "AIIMS Patna", latitude: 25.5601, longitude: 85.0450 },
        { id: 7, name: "Patna Airport (Jay Prakash Narayan)", latitude: 25.5912, longitude: 85.0877 },
        { id: 8, name: "Nalanda", latitude: 25.1350, longitude: 85.4540 },
        { id: 9, name: "Rajgir", latitude: 25.0298, longitude: 85.4214 },
        { id: 10, name: "Gaya", latitude: 24.7955, longitude: 85.0002 },
        { id: 11, name: "Bodh Gaya", latitude: 24.6961, longitude: 84.9913 },
        { id: 12, name: "Hajipur", latitude: 25.6858, longitude: 85.2154 },
        { id: 13, name: "Muzaffarpur", latitude: 26.1209, longitude: 85.3647 },
        { id: 14, name: "Vaishali", latitude: 25.9863, longitude: 85.1274 }
    ],
    roads: [
        { id: 1, source_location_id: 1, destination_location_id: 2, distance: 3.5, travel_time: 12, road_type: "City Arterial" },
        { id: 2, source_location_id: 2, destination_location_id: 3, distance: 4.2, travel_time: 15, road_type: "Commercial Road" },
        { id: 3, source_location_id: 2, destination_location_id: 4, distance: 2.1, travel_time: 8, road_type: "City Boulevard" },
        { id: 4, source_location_id: 3, destination_location_id: 7, distance: 5.6, travel_time: 18, road_type: "Airport Road" },
        { id: 5, source_location_id: 7, destination_location_id: 5, distance: 6.8, travel_time: 20, road_type: "State Highway" },
        { id: 6, source_location_id: 5, destination_location_id: 6, distance: 4.5, travel_time: 14, road_type: "Medical Corridor" },
        { id: 7, source_location_id: 1, destination_location_id: 8, distance: 88.4, travel_time: 105, road_type: "National Highway NH 31" },
        { id: 8, source_location_id: 8, destination_location_id: 9, distance: 15.2, travel_time: 28, road_type: "State Highway 78" },
        { id: 9, source_location_id: 9, destination_location_id: 10, distance: 72.0, travel_time: 90, road_type: "National Highway NH 82" },
        { id: 10, source_location_id: 10, destination_location_id: 11, distance: 13.5, travel_time: 25, road_type: "Bodh Gaya Road" },
        { id: 11, source_location_id: 1, destination_location_id: 12, distance: 18.0, travel_time: 35, road_type: "Gandhi Setu Bridge" },
        { id: 12, source_location_id: 12, destination_location_id: 13, distance: 54.0, travel_time: 75, road_type: "National Highway NH 22" },
        { id: 13, source_location_id: 12, destination_location_id: 14, distance: 35.0, travel_time: 50, road_type: "Heritage Corridor" },
        { id: 14, source_location_id: 2, destination_location_id: 7, distance: 7.2, travel_time: 22, road_type: "Bailey Road" },
        { id: 15, source_location_id: 4, destination_location_id: 8, distance: 86.0, travel_time: 102, road_type: "National Highway NH 31" },
        { id: 16, source_location_id: 2, destination_location_id: 8, distance: 85.0, travel_time: 100, road_type: "NH 31 Express" },
        { id: 17, source_location_id: 3, destination_location_id: 4, distance: 2.8, travel_time: 10, road_type: "Frazer Road" },
        { id: 18, source_location_id: 6, destination_location_id: 8, distance: 82.0, travel_time: 98, road_type: "Bypass Expressway" },
        { id: 19, source_location_id: 5, destination_location_id: 8, distance: 84.0, travel_time: 100, road_type: "NH 31 Link" }
    ],
    traffic: [
        { id: 1, road_id: 1, traffic_level: "Medium" },
        { id: 2, road_id: 2, traffic_level: "High" },
        { id: 3, road_id: 3, traffic_level: "Medium" },
        { id: 4, road_id: 4, traffic_level: "Low" },
        { id: 5, road_id: 5, traffic_level: "Low" },
        { id: 6, road_id: 6, traffic_level: "Low" },
        { id: 7, road_id: 7, traffic_level: "Medium" },
        { id: 8, road_id: 8, traffic_level: "Low" },
        { id: 9, road_id: 9, traffic_level: "Low" },
        { id: 10, road_id: 10, traffic_level: "Low" },
        { id: 11, road_id: 11, traffic_level: "High" },
        { id: 12, road_id: 12, traffic_level: "Medium" },
        { id: 13, road_id: 13, traffic_level: "Low" },
        { id: 14, road_id: 14, traffic_level: "Medium" },
        { id: 15, road_id: 15, traffic_level: "Medium" },
        { id: 16, road_id: 16, traffic_level: "Medium" },
        { id: 17, road_id: 17, traffic_level: "High" },
        { id: 18, road_id: 18, traffic_level: "Low" },
        { id: 19, road_id: 19, traffic_level: "Low" }
    ]
};

// Sync graph.txt so C++ engine always has complete topological edges
try {
    const graphFilePath = path.join(__dirname, "../algorithms/graph.txt");
    let graphData = "";
    inMemoryData.roads.forEach(road => {
        graphData += `${road.source_location_id} ${road.destination_location_id} ${road.distance}\n`;
        // Undirected graph bidirectional edge
        graphData += `${road.destination_location_id} ${road.source_location_id} ${road.distance}\n`;
    });
    fs.writeFileSync(graphFilePath, graphData);
    console.log("⚡ Updated algorithms/graph.txt with in-memory topological graph data.");
} catch (e) {
    console.warn("Notice: could not update graph.txt automatically:", e.message);
}

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "google_maps_navigation",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.warn("⚠️ MySQL Database not reachable. Operating smoothly in Resilient In-Memory Mode.");
            isMySQLConnected = false;
            return;
        }
        console.log("✅ MySQL Connected Successfully.");
        isMySQLConnected = true;
        connection.release();
    });
} catch (err) {
    console.warn("⚠️ MySQL pool creation error, falling back to In-Memory store.");
    isMySQLConnected = false;
}

// Resilient query runner
const query = async (sql, params = []) => {
    if (isMySQLConnected && pool) {
        try {
            return await pool.promise().query(sql, params);
        } catch (err) {
            console.warn("MySQL query failed, using in-memory fallback:", err.message);
        }
    }

    // In-memory simulation of standard queries
    const lowerSql = sql.toLowerCase().trim();

    if (lowerSql.includes("select * from locations") && !lowerSql.includes("where")) {
        return [inMemoryData.locations, []];
    }

    if (lowerSql.includes("from locations") && lowerSql.includes("where") && lowerSql.includes("like")) {
        const queryTerm = (params[0] || "").replace(/%/g, "").toLowerCase();
        const matches = inMemoryData.locations.filter(loc =>
            loc.name.toLowerCase().includes(queryTerm)
        );
        return [matches, []];
    }

    if (lowerSql.includes("from locations") && lowerSql.includes("id in")) {
        const ids = Array.isArray(params[0]) ? params[0] : [params[0]];
        const matches = inMemoryData.locations.filter(loc => ids.includes(loc.id) || ids.includes(String(loc.id)));
        return [matches, []];
    }

    if (lowerSql.includes("from locations") && lowerSql.includes("id =")) {
        const id = params[0];
        const match = inMemoryData.locations.filter(loc => loc.id == id);
        return [match, []];
    }

    if (lowerSql.includes("select * from roads")) {
        if (lowerSql.includes("source_location_id=?") || lowerSql.includes("source_location_id = ?")) {
            const from = params[0];
            const to = params[1];
            const match = inMemoryData.roads.filter(r =>
                (r.source_location_id == from && r.destination_location_id == to) ||
                (r.source_location_id == to && r.destination_location_id == from)
            );
            return [match.slice(0, 1), []];
        }
        return [inMemoryData.roads, []];
    }

    if (lowerSql.includes("from traffic") && lowerSql.includes("road_id")) {
        const roadId = params[0];
        const match = inMemoryData.traffic.filter(t => t.road_id == roadId);
        return [match.slice(0, 1), []];
    }

    if (lowerSql.includes("insert into locations")) {
        const newId = inMemoryData.locations.length + 1;
        const newLoc = { id: newId, name: params[0], latitude: params[1], longitude: params[2] };
        inMemoryData.locations.push(newLoc);
        return [{ insertId: newId, affectedRows: 1 }, []];
    }

    if (lowerSql.includes("delete from locations")) {
        const id = params[0];
        inMemoryData.locations = inMemoryData.locations.filter(loc => loc.id != id);
        return [{ affectedRows: 1 }, []];
    }

    if (lowerSql.includes("update locations")) {
        const id = params[3];
        const loc = inMemoryData.locations.find(l => l.id == id);
        if (loc) {
            loc.name = params[0];
            loc.latitude = params[1];
            loc.longitude = params[2];
        }
        return [{ affectedRows: 1 }, []];
    }

    return [[], []];
};

module.exports = {
    query,
    isMySQLConnected: () => isMySQLConnected,
    inMemoryData
};
