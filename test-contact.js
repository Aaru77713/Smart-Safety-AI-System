console.log("test contact file started ");
const http = require("http");

const data = JSON.stringify({
    userId: "user01",
    name: "Parent",
    phone: "9876543210",
    relation: "Father"
});

const options = {
    hostname: "127.0.0.1",
    port: 5000,
    path: "/api/emergency-contacts",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const request = http.request(options, (response) => {
    let result = "";

    response.on("data", (chunk) => {
        result += chunk;
    });

    response.on("end", () => {
        console.log("Response:", result);
    });
});

request.on("error", (error) => {
    console.log("Error:", error.message);
});

request.write(data);
request.end();