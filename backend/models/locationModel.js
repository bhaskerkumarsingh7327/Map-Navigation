// // const db = require("../config/db");

// // const getAllLocations = (callback) => {
// //     const sql = "SELECT * FROM locations";

// //     db.query(sql, (err, result) => {
// //         callback(err, result);
// //     });
// // };

// // module.exports = {
// //     getAllLocations
// // };
// // const addLocation = (locationData, callback) => {
// //     const sql = `
// //         INSERT INTO locations (name, latitude, longitude)
// //         VALUES (?, ?, ?)
// //     `;

// //     db.query(
// //         sql,
// //         [
// //             locationData.name,
// //             locationData.latitude,
// //             locationData.longitude
// //         ],
// //         callback
// //     );
// // };

// // module.exports = {
// //     getAllLocations,
// //     addLocation
// // };
// // const getLocationById = (id, callback) => {
// //     const sql = "SELECT * FROM locations WHERE id = ?";

// //     db.query(sql, [id], (err, result) => {
// //         callback(err, result);
// //     });
// // };
// // const updateLocation = (id, locationData, callback) => {
// //     const sql = `
// //         UPDATE locations 
// //         SET name = ?, latitude = ?, longitude = ?
// //         WHERE id = ?
// //     `;

// //     db.query(
// //         sql,
// //         [
// //             locationData.name,
// //             locationData.latitude,
// //             locationData.longitude,
// //             id
// //         ],
// //         callback
// //     );
// // };
// // const deleteLocation = (id, callback) => {
// //     const sql = "DELETE FROM locations WHERE id = ?";

// //     db.query(sql, [id], (err, result) => {
// //          if (err) {
// //             console.log("🔥 MYSQL ERROR:", err); 
// //         }
// //         callback(err, result);
// //     });
// // };
// // module.exports = {
// //     getAllLocations,
// //     addLocation,
// //     getLocationById,
// //     updateLocation,
// //     deleteLocation
// // };
// const db = require("../config/db");

// // Get All Locations
// const getAllLocations = async () => {
//     const sql = "SELECT * FROM locations";
//     const [rows] = await db.query(sql);
//     return rows;
// };

// // Add Location
// const addLocation = async (locationData) => {
//     const sql = `
//         INSERT INTO locations (name, latitude, longitude)
//         VALUES (?, ?, ?)
//     `;

//     const [result] = await db.query(sql, [
//         locationData.name,
//         locationData.latitude,
//         locationData.longitude
//     ]);

//     return result;
// };

// // Get Location By ID
// const getLocationById = async (id) => {
//     const sql = "SELECT * FROM locations WHERE id = ?";
//     const [rows] = await db.query(sql, [id]);
//     return rows;
// };

// // Update Location
// const updateLocation = async (id, locationData) => {
//     const sql = `
//         UPDATE locations
//         SET name = ?, latitude = ?, longitude = ?
//         WHERE id = ?
//     `;

//     const [result] = await db.query(sql, [
//         locationData.name,
//         locationData.latitude,
//         locationData.longitude,
//         id
//     ]);

//     return result;
// };

// // Delete Location
// const deleteLocation = async (id) => {
//     const sql = "DELETE FROM locations WHERE id = ?";
//     const [result] = await db.query(sql, [id]);
//     return result;
// };
// const searchLocations = async (keyword) => {

//     const sql = `
//         SELECT *
//         FROM locations
//         WHERE name LIKE ?
//     `;

//     const [rows] = await db.query(sql, [`%${keyword}%`]);

//     return rows;
// };

// module.exports = {
//     getAllLocations,
//     addLocation,
//     getLocationById,
//     updateLocation,
//     deleteLocation,
//     searchLocations
// };

const db = require("../config/db");

// Get All Locations
const getAllLocations = async () => {
    const sql = "SELECT * FROM locations";
    const [rows] = await db.query(sql);
    return rows;
};

// Add Location
const addLocation = async (locationData) => {
    const sql = `
        INSERT INTO locations (name, latitude, longitude)
        VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        locationData.name,
        locationData.latitude,
        locationData.longitude
    ]);

    return result;
};

// Get Location By ID
const getLocationById = async (id) => {
    const sql = "SELECT * FROM locations WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows;
};

// Get Location ID By Name
const getLocationIdByName = async (name) => {

    // "Patna, Bihar, India" -> "Patna"
    const city = name.split(",")[0].trim();

    const sql = `
        SELECT id, name, latitude, longitude
        FROM locations
        WHERE LOWER(name) LIKE LOWER(?)
        LIMIT 1
    `;

    const [rows] = await db.query(sql, [`%${city}%`]);

    return rows;
};

// Update Location
const updateLocation = async (id, locationData) => {
    const sql = `
        UPDATE locations
        SET name = ?, latitude = ?, longitude = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        locationData.name,
        locationData.latitude,
        locationData.longitude,
        id
    ]);

    return result;
};

// Delete Location
const deleteLocation = async (id) => {
    const sql = "DELETE FROM locations WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
};

// Search Locations
const searchLocations = async (keyword) => {

    const sql = `
        SELECT *
        FROM locations
        WHERE name LIKE ?
    `;

    const [rows] = await db.query(sql, [`%${keyword}%`]);

    return rows;
};

module.exports = {
    getAllLocations,
    addLocation,
    getLocationById,
    getLocationIdByName,
    updateLocation,
    deleteLocation,
    searchLocations
};