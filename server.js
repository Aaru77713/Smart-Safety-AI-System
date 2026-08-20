const express = require("express");
const mongoose = require("mongoose");

const Emergency = require("./models/Emergency");
const EmergencyContact = require("./models/EmergencyContact");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/smartSafety")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.send("Smart Safety Backend is running!");
});


// ===============================
// SOS EMERGENCY API
// ===============================

app.post("/api/emergency/sos", async (req, res) => {
    try {
        const { userId, location, message } = req.body;

        console.log("SOS EMERGENCY RECEIVED");
        console.log("User ID:", userId);
        console.log("Location:", location);
        console.log("Message:", message);

        // Save SOS in MongoDB
        const emergency = new Emergency({
            userId: userId,
            location: location,
            message: message,
            status: "ACTIVE"
        });

        await emergency.save();

        res.json({
            success: true,
            message: "SOS received successfully",
            emergency: {
                id: emergency._id,
                userId: emergency.userId,
                location: emergency.location,
                message: emergency.message,
                status: emergency.status,
                createdAt: emergency.createdAt
            }
        });

    } catch (error) {
        console.log("Error saving SOS:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save SOS",
            error: error.message
        });
    }
});


// ===============================
// EMERGENCY CONTACT API
// ===============================

app.post("/api/emergency-contacts", async (req, res) => {
    try {
        const { userId, name, phone, relation } = req.body;

        const contact = new EmergencyContact({
            userId: userId,
            name: name,
            phone: phone,
            relation: relation
        });

        await contact.save();

        console.log("Emergency contact saved");
        console.log("User ID:", userId);
        console.log("Name:", name);
        console.log("Phone:", phone);
        console.log("Relation:", relation);

        res.json({
            success: true,
            message: "Emergency contact saved successfully",
            contact: contact
        });

    } catch (error) {
        console.log("Error saving contact:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save emergency contact",
            error: error.message
        });
    }
});


// ===============================
// GET EMERGENCY CONTACTS
// ===============================

app.get("/api/emergency-contacts/:userId", async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({
            userId: req.params.userId
        });

        res.json({
            success: true,
            contacts: contacts
        });

    } catch (error) {
        console.log("Error fetching contacts:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch emergency contacts"
        });
    }
});


// ===============================
// GET SOS HISTORY
// ===============================

app.get("/api/emergency/sos/:userId", async (req, res) => {
    try {
        const emergencies = await Emergency.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            emergencies: emergencies
        });

    } catch (error) {
        console.log("Error fetching SOS history:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SOS history"
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});