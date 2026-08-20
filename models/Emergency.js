const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        default: "ACTIVE"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Emergency", emergencySchema);