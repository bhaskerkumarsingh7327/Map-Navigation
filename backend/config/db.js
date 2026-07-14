// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) {
//         console.log("❌ Database Connection Failed");
//         console.log(err);
//         return;
//     }

//     console.log("✅ MySQL Connected Successfully");
// });

// module.exports = connection;
require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
        return;
    }

    console.log("✅ MySQL Connected Successfully");
    connection.release();
});

module.exports = pool.promise();