// const express = require("express");
// const router = express.Router();

// const graphService = require("../services/graphService");

// // shortest path API
// router.post("/shortest-path", (req, res) => {
//     const { source, destination } = req.body;

//     graphService.getShortestPath(source, destination, (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: "C++ engine error"
//             });
//         }

//         res.json({
//             success: true,
//             data: result
//         });
//     });
// });

// module.exports = router;
const express = require("express");

const router = express.Router();

const {
    getShortestPath
} = require("../controllers/graphController");

router.post(
    "/shortest-path",
    getShortestPath
);

module.exports = router;