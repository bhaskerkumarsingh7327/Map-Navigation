const { body } = require("express-validator");

const validateLocation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Location name is required"),

    body("latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    body("longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180")
];

module.exports = validateLocation;