// const graphService = require("../services/graphService");

// const getShortestPath = async (req, res) => {

//     try {

//         const { source, destination } = req.body;

//         if (!source || !destination) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Source and Destination are required"
//             });

//         }

//         graphService.getShortestPath(
//             source,
//             destination,
//             (err, result) => {

//                 if (err) {

//                     return res.status(500).json({
//                         success: false,
//                         message: "C++ Engine Error"
//                     });

//                 }

//                 return res.status(200).json({
//                     success: true,
//                     data: result
//                 });

//             }
//         );

//     }

//     catch (error) {

//         console.log(error);

//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });

//     }

// };

// module.exports = {
//     getShortestPath
// };

const graphService = require("../services/graphService");
const locationModel = require("../models/locationModel");

const getShortestPath = async (req, res) => {

    try {

        const { source, destination } = req.body;

        if (!source || !destination) {

            return res.status(400).json({
                success: false,
                message: "Source and Destination are required"
            });

        }

        // Find Source ID
        const sourceLocation =
            await locationModel.getLocationIdByName(source);

        // Find Destination ID
        const destinationLocation =
            await locationModel.getLocationIdByName(destination);

        if (
            sourceLocation.length === 0 ||
            destinationLocation.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Location not found in database"
            });

        }

        const sourceId = sourceLocation[0].id;
        const destinationId = destinationLocation[0].id;

        graphService.getShortestPath(
            sourceId,
            destinationId,
            (err, result) => {

                if (err) {

                    console.log("========= C++ ERROR =========");
                    console.log(err);
                    console.log("=============================");

                    return res.status(500).json({
                        success: false,
                        message: "C++ Engine Error",
                        error: err.message
                    });

                }

                return res.status(200).json({
                    success: true,
                    data: result
                });

            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getShortestPath
};