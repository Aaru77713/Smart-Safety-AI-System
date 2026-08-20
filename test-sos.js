const http = require("http");

const data = JSON.stringify({
    userId: "user123",
    location: "Noida",
    message: "Emergency SOS pressed"
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/emergency/sos",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        console.log("Response from server:");
        console.log(body);
    });
});

req.on("error", (error) => {
    console.log("Error:", error.message);
});

req.write(data);
req.end();