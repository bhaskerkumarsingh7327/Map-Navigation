// const db = require("../config/db");
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // Database se graph build
// async function buildGraph() {
//     const [roads] = await db.query("SELECT * FROM roads");

//     let graphData = "";

//     roads.forEach((road) => {
//         graphData += `${road.source_location_id} ${road.destination_location_id} ${road.distance}\n`;
//     });

//     const filePath = path.join(__dirname, "../algorithms/graph.txt");

//     fs.writeFileSync(filePath, graphData);

//     console.log("✅ graph.txt created successfully");

//     return roads;
// }

// // C++ Engine
// function getShortestPath(source, destination, callback) {
//     const command =
// `cd algorithms && ./graph ${source} ${destination}`;
//     exec(command, (error, stdout, stderr) => {
//         if (error) {
//             console.log("C++ Error:", error);
//             return callback(error, null);
//         }

//         if (stderr) {
//             console.log(stderr);
//         }

//         callback(null, stdout);
//     });
// }

// module.exports = {
//     buildGraph,
//     getShortestPath
// };

// const db = require("../config/db");
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // =========================
// // Build Graph.txt from Database
// // =========================
// async function buildGraph() {

//     const [roads] = await db.query(
//         "SELECT * FROM roads"
//     );

//     let graphData = "";

//     roads.forEach((road) => {

//         graphData += `${road.source_location_id} ${road.destination_location_id} ${road.distance}\n`;

//     });

//     const filePath = path.join(
//         __dirname,
//         "../algorithms/graph.txt"
//     );

//     fs.writeFileSync(filePath, graphData);

//     console.log("✅ graph.txt created successfully");

//     return roads;

// }

// // =========================
// // Run C++ Dijkstra
// // =========================
// async function getShortestPath(source, destination, callback) {

//     const command = `cd algorithms && ./graph ${source} ${destination}`;

//     exec(command, async (error, stdout, stderr) => {

//         if (error) {

//             console.log(error);

//             return callback(error, null);

//         }

//         if (stderr) {

//             console.log(stderr);

//         }

//         try {

//             // C++ output JSON parse
//             const cppResult = JSON.parse(stdout);

//             const pathIds = cppResult.path;

//             // Database se coordinates nikalo
//             const [locations] = await db.query(

//                 `SELECT
//                     id,
//                     latitude,
//                     longitude,
//                     name
//                  FROM locations
//                  WHERE id IN (?)`,

//                 [pathIds]

//             );

//             // Order maintain karna
//             const coordinates = [];

//             pathIds.forEach((id) => {

//                 const location = locations.find(
//                     (loc) => loc.id == id
//                 );

//                 if (location) {

//                     coordinates.push([
//                         Number(location.latitude),
//                         Number(location.longitude)
//                     ]);

//                 }

//             });

//             callback(null, {

//                 distance: cppResult.distance,

//                 path: pathIds,

//                 coordinates

//             });

//         }

//         catch (err) {

//             console.log("JSON Parse Error");

//             console.log(stdout);

//             callback(err, null);

//         }

//     });

// }

// module.exports = {

//     buildGraph,

//     getShortestPath

// };

// before test

// const db = require("../config/db");
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // ==========================
// // Build graph.txt from Database
// // ==========================
// async function buildGraph() {

//     const [roads] = await db.query(
//         "SELECT source_location_id, destination_location_id, distance FROM roads"
//     );

//     let graphData = "";

//     roads.forEach((road) => {

//         graphData += `${road.source_location_id} ${road.destination_location_id} ${road.distance}\n`;

//     });

//     const graphFile = path.join(
//         __dirname,
//         "../algorithms/graph.txt"
//     );

//     fs.writeFileSync(graphFile, graphData);

//     console.log("✅ graph.txt updated");

// }

// // ==========================
// // Run Dijkstra Algorithm
// // ==========================
// async function getShortestPath(source, destination, callback) {

//     try {

//         // Always update graph before executing algorithm
//         await buildGraph();

//         const executable = path.join(
//             __dirname,
//             "../algorithms/graph"
//         );

//         const command = `"${executable}" ${source} ${destination}`;

//         exec(command, async (error, stdout, stderr) => {

//             if (error) {

//                 console.log("❌ C++ Execution Error");
//                 console.log(error);

//                 return callback(error, null);

//             }

//             if (stderr) {

//                 console.log(stderr);

//             }

//             try {

//                 const cppResult = JSON.parse(stdout);

//                 const pathIds = cppResult.path;

//                 const [locations] = await db.query(
//                     `
//                     SELECT
//                         id,
//                         name,
//                         latitude,
//                         longitude
//                     FROM locations
//                     WHERE id IN (?)
//                     `,
//                     [pathIds]
//                 );

//                 const coordinates = [];
//                 const locationNames = [];

//                 pathIds.forEach((id) => {

//                     const location = locations.find(
//                         (item) => item.id == id
//                     );

//                     if (location) {

//                         coordinates.push([
//                             Number(location.latitude),
//                             Number(location.longitude)
//                         ]);

//                         locationNames.push(location.name);

//                     }

//                 });

//                 callback(null, {

//                     distance: cppResult.distance,

//                     path: pathIds,

//                     locations: locationNames,

//                     coordinates

//                 });

//             }

//             catch (err) {

//                 console.log("❌ JSON Parse Error");
//                 console.log(stdout);

//                 callback(err, null);

//             }

//         });

//     }

//     catch (err) {

//         callback(err, null);

//     }

// }

// module.exports = {

//     buildGraph,

//     getShortestPath

// };


// after

const db = require("../config/db");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

// ==========================
// Build graph.txt from Database
// ==========================
async function buildGraph() {

    const [roads] = await db.query(
        "SELECT source_location_id, destination_location_id, distance FROM roads"
    );

    let graphData = "";

    roads.forEach((road) => {

        graphData += `${road.source_location_id} ${road.destination_location_id} ${road.distance}\n`;

    });

    const graphFile = path.join(
        __dirname,
        "../algorithms/graph.txt"
    );

    fs.writeFileSync(graphFile, graphData);

    console.log("✅ graph.txt updated");

}

// ==========================
// Run Dijkstra Algorithm
// ==========================
async function getShortestPath(source, destination, callback) {

    try {

        await buildGraph();

        const executable = path.join(
            __dirname,
            "../algorithms/graph"
        );

        console.log("Executable =>", executable);
        console.log("Source =>", source);
        console.log("Destination =>", destination);

        execFile(

            executable,

            [String(source), String(destination)],

            {
                cwd: path.join(__dirname, "../")
            },

            async (error, stdout, stderr) => {

                console.log("STDOUT =>", stdout);
                console.log("STDERR =>", stderr);

                if (error) {

                    console.log("========= C++ ERROR =========");
                    console.log(error);
                    console.log("=============================");

                    return callback(error, null);

                }

                try {

                    const cppResult = JSON.parse(stdout);

                    const pathIds = cppResult.path;

                    const [locations] = await db.query(

                        `
                        SELECT
                            id,
                            name,
                            latitude,
                            longitude
                        FROM locations
                        WHERE id IN (?)
                        `,

                        [pathIds]

                    );

                    const coordinates = [];
                    const locationNames = [];

                    pathIds.forEach((id) => {

                        const location = locations.find(
                            (item) => item.id == id
                        );

                        if (location) {

                            coordinates.push([
                                Number(location.latitude),
                                Number(location.longitude)
                            ]);

                            locationNames.push(location.name);

                        }

                    });

                    callback(null, {

                        success: true,

                        distance: cppResult.distance,

                        path: pathIds,

                        locations: locationNames,

                        coordinates

                    });

                }

                catch (err) {

                    console.log("JSON Parse Error");
                    console.log(stdout);

                    callback(err, null);

                }

            }

        );

    }

    catch (err) {

        callback(err, null);

    }

}

module.exports = {

    buildGraph,

    getShortestPath

};