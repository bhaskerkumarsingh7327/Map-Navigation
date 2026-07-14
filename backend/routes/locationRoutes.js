const express = require("express");
const router = express.Router();

const {
    getAllLocations,
    addLocation,
    getLocationById,
    updateLocation,
    deleteLocation,
     searchLocations
} = require("../controllers/locationController");
const validateLocation = require("../validations/locationValidation");
const validationMiddleware = require("../middleware/validationMiddleware");

router.get("/", getAllLocations);
router.post(
    "/",
    validateLocation,
    validationMiddleware,
    addLocation
);
router.get("/search/:keyword", searchLocations);
router.get("/:id", getLocationById);
router.put(
    "/:id",
    validateLocation,
    validationMiddleware,
    updateLocation
);
router.delete("/:id", deleteLocation);

module.exports = router;