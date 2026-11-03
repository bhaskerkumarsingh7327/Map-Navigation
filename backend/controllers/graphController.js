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

        let sourceId = null;
        let destId = null;

        // If source is already a number
        if (!isNaN(source)) {
            sourceId = Number(source);
        } else {
            const sourceLocation = await locationModel.getLocationIdByName(source);
            if (sourceLocation && sourceLocation.length > 0) {
                sourceId = sourceLocation[0].id;
            } else {
                // Auto create temporary location node
                const created = await locationModel.addLocation({
                    name: source,
                    latitude: 25.6110 + (Math.random() - 0.5) * 0.1,
                    longitude: 85.1440 + (Math.random() - 0.5) * 0.1
                });
                sourceId = created.insertId || 1;
            }
        }

        // If destination is already a number
        if (!isNaN(destination)) {
            destId = Number(destination);
        } else {
            const destLocation = await locationModel.getLocationIdByName(destination);
            if (destLocation && destLocation.length > 0) {
                destId = destLocation[0].id;
            } else {
                // Auto create temporary location node
                const created = await locationModel.addLocation({
                    name: destination,
                    latitude: 25.1350 + (Math.random() - 0.5) * 0.1,
                    longitude: 85.4540 + (Math.random() - 0.5) * 0.1
                });
                destId = created.insertId || 8;
            }
        }

        graphService.getShortestPath(sourceId, destId, (err, result) => {
            if (err) {
                console.error("C++ Engine Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Routing Engine Error",
                    error: err.message
                });
            }

            return res.status(200).json({
                success: true,
                data: result
            });
        });
    } catch (error) {
        console.error("Error in getShortestPath controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getShortestPath
};
