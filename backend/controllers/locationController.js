const locationModel = require("../models/locationModel");

   const getAllLocations = async (req, res) => {
    try {
        const result = await locationModel.getAllLocations();

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
};
const addLocation = async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;

        const result = await locationModel.addLocation({
            name,
            latitude,
            longitude
        });

        res.status(201).json({
            success: true,
            message: "Location added successfully",
            locationId: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to add location"
        });
    }
};
const getLocationById = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await locationModel.getLocationById(id);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result[0]
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching location"
        });
    }
};
const updateLocation = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, latitude, longitude } = req.body;

        await locationModel.updateLocation(id, {
            name,
            latitude,
            longitude
        });

        res.status(200).json({
            success: true,
            message: "Location updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating location"
        });
    }
};
const deleteLocation = async (req, res) => {
    try {
        const id = req.params.id;

        await locationModel.deleteLocation(id);

        res.status(200).json({
            success: true,
            message: "Location deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
};
const searchLocations = async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const result = await locationModel.searchLocations(keyword);

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Search failed"
        });
    }
};
module.exports = {
    getAllLocations,
    addLocation,
    getLocationById,
    updateLocation,
    deleteLocation,
    searchLocations
};