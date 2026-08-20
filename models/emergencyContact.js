const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    relation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);