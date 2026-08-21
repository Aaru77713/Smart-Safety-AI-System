// ==============================
// CURRENT USER
// ==============================

let users = JSON.parse(localStorage.getItem("users")) || [];

let currentUserEmail =
    localStorage.getItem("currentUser");

if (!currentUserEmail) {
    window.location.href = "login.html";
}

let currentUser =
    users.find(function (user) {
        return user.email === currentUserEmail;
    });

if (currentUser) {
    document.getElementById("user-name").innerText =
        currentUser.name;

    document.getElementById("profile-name").innerText =
        currentUser.name;

    document.getElementById("profile-email").innerText =
        currentUser.email;

    document.getElementById("profile-phone").innerText =
        currentUser.phone || "--";

    document.getElementById("profile-age").innerText =
        currentUser.age || "--";

    document.querySelector(".profile-circle").innerText =
        currentUser.name.charAt(0).toUpperCase();
}


// ==============================
// LOGOUT
// ==============================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}


// ==============================
// THEME
// ==============================

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    let button =
        document.getElementById("theme-button");

    if (document.body.classList.contains("light-mode")) {
        button.innerText = "🌙";
    } else {
        button.innerText = "☀️";
    }
}


// ==============================
// LANGUAGE
// ==============================

let hindiMode = false;

function changeLanguage() {

    hindiMode = !hindiMode;

    let elements =
        document.querySelectorAll("[data-en]");

    elements.forEach(function (element) {

        if (hindiMode) {
            element.innerText =
                element.getAttribute("data-hi");
        } else {
            element.innerText =
                element.getAttribute("data-en");
        }
    });

    let languageButton =
        document.getElementById("language-button");

    languageButton.innerText =
        hindiMode
            ? "हिंदी / EN"
            : "EN / हिंदी";

    let chatInput =
        document.getElementById("chat-input");

    if (chatInput) {
        chatInput.placeholder =
            hindiMode
                ? "अपना संदेश लिखें..."
                : "Type your message...";
    }
}


// ==============================
// PANEL SYSTEM
// ==============================

function closeAllPanels() {

    let panels =
        document.querySelectorAll(".side-panel");

    panels.forEach(function (panel) {
        panel.classList.remove("panel-open");
    });
}

function showDashboard() {
    closeAllPanels();
}


// ==============================
// FAMILY PANEL
// ==============================

function openFamilyPanel() {

    closeAllPanels();

    document
        .getElementById("family-panel")
        .classList.add("panel-open");
}

function closeFamilyPanel() {

    document
        .getElementById("family-panel")
        .classList.remove("panel-open");
}

function showContactForm() {

    document
        .getElementById("contact-form")
        .classList.add("show");
}

function hideContactForm() {

    document
        .getElementById("contact-form")
        .classList.remove("show");
}

function saveEmergencyContact() {

    let name =
        document.getElementById("contact-name").value.trim();

    let phone =
        document.getElementById("contact-phone").value.trim();

    let relation =
        document.getElementById("contact-relation").value;

    if (!name || !phone || !relation) {

        alert(
            hindiMode
                ? "कृपया सभी जानकारी भरें।"
                : "Please fill all contact details."
        );

        return;
    }

    alert(
        hindiMode
            ? "संपर्क बैकएंड इंटीग्रेशन के बाद सेव होगा।"
            : "Contact will be saved after backend integration."
    );
}


// ==============================
// LOCATION
// ==============================

let map = null;
let locationMarker = null;
let nearbyMarkers = [];

function openLocationPanel() {

    closeAllPanels();

    document
        .getElementById("location-panel")
        .classList.add("panel-open");

    setTimeout(function () {

        if (map) {
            map.invalidateSize();
        }

    }, 450);
}

function closeLocationPanel() {

    document
        .getElementById("location-panel")
        .classList.remove("panel-open");
}

function getCurrentLocation() {

    let status =
        document.getElementById("location-status");

    if (!navigator.geolocation) {

        status.innerText =
            hindiMode
                ? "यह ब्राउज़र स्थान का समर्थन नहीं करता।"
                : "Location is not supported.";

        return;
    }

    status.innerText =
        hindiMode
            ? "स्थान प्राप्त किया जा रहा है..."
            : "Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            let latitude =
                position.coords.latitude;

            let longitude =
                position.coords.longitude;

            document.getElementById("latitude").innerText =
                latitude.toFixed(6);

            document.getElementById("longitude").innerText =
                longitude.toFixed(6);

            status.innerText =
                hindiMode
                    ? "स्थान सफलतापूर्वक प्राप्त हुआ"
                    : "Location detected successfully";

            let emergencyStatus =
                document.getElementById(
                    "emergency-location-status"
                );

            if (emergencyStatus) {
                emergencyStatus.innerText =
                    hindiMode
                        ? "स्थान उपलब्ध है"
                        : "Location available";
            }

            showLocationOnMap(
                latitude,
                longitude
            );

            findNearbyServices(
                latitude,
                longitude
            );
        },

        function (error) {

            if (error.code === 1) {

                status.innerText =
                    hindiMode
                        ? "स्थान की अनुमति नहीं दी गई।"
                        : "Location permission denied.";

            } else if (error.code === 2) {

                status.innerText =
                    hindiMode
                        ? "स्थान उपलब्ध नहीं है।"
                        : "Location unavailable.";

            } else if (error.code === 3) {

                status.innerText =
                    hindiMode
                        ? "स्थान अनुरोध का समय समाप्त हो गया।"
                        : "Location request timed out.";

            } else {

                status.innerText =
                    hindiMode
                        ? "स्थान प्राप्त नहीं हो सका।"
                        : "Unable to get location.";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function showLocationOnMap(latitude, longitude) {

    if (!map) {

        map =
            L.map("map").setView(
                [latitude, longitude],
                16
            );

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);
    }

    if (locationMarker) {

        locationMarker.setLatLng(
            [latitude, longitude]
        );

    } else {

        locationMarker =
            L.marker(
                [latitude, longitude]
            ).addTo(map);
    }

    locationMarker
        .bindPopup(
            hindiMode
                ? "📍 आपका वर्तमान स्थान"
                : "📍 Your Current Location"
        )
        .openPopup();

    map.setView(
        [latitude, longitude],
        16
    );

    setTimeout(function () {
        map.invalidateSize();
    }, 100);
}


// ==============================
// NEARBY HOSPITALS + POLICE
// ==============================

async function findNearbyServices(
    latitude,
    longitude
) {

    let nearbyBox =
        document.getElementById(
            "nearby-services"
        );

    if (!nearbyBox) {
        return;
    }

    nearbyBox.innerHTML =
        hindiMode
            ? "<p>नज़दीकी आपातकालीन सेवाएँ खोजी जा रही हैं...</p>"
            : "<p>Finding nearby emergency services...</p>";

    nearbyMarkers.forEach(function (marker) {

        if (map) {
            map.removeLayer(marker);
        }
    });

    nearbyMarkers = [];

    let query = `
        [out:json][timeout:25];
        (
            nwr["amenity"="hospital"](around:5000,${latitude},${longitude});
            nwr["amenity"="police"](around:5000,${latitude},${longitude});
        );
        out center;
    `;

    let url =
        "https://overpass-api.de/api/interpreter?data=" +
        encodeURIComponent(query);

    try {

        let response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Overpass error: " +
                response.status
            );
        }

        let data =
            await response.json();

        nearbyBox.innerHTML = "";

        if (!data.elements || data.elements.length === 0) {

            nearbyBox.innerHTML =
                hindiMode
                    ? "<p>5 किलोमीटर के अंदर कोई सेवा नहीं मिली।</p>"
                    : "<p>No emergency services found within 5 km.</p>";

            return;
        }

        data.elements.forEach(function (place) {

            let tags =
                place.tags || {};

            let type =
                tags.amenity;

            let name =
                tags.name ||
                (
                    type === "hospital"
                        ? "Unnamed Hospital"
                        : "Unnamed Police Station"
                );

            let placeLat =
                place.lat ||
                (
                    place.center
                        ? place.center.lat
                        : null
                );

            let placeLon =
                place.lon ||
                (
                    place.center
                        ? place.center.lon
                        : null
                );

            if (
                placeLat === null ||
                placeLon === null
            ) {
                return;
            }

            let card =
                document.createElement("div");

            card.className =
                "nearby-card";

            let title =
                document.createElement("h4");

            let desc =
                document.createElement("p");

            if (type === "hospital") {

                title.innerText =
                    "🏥 " + name;

                desc.innerText =
                    hindiMode
                        ? "अस्पताल"
                        : "Hospital";

            } else {

                title.innerText =
                    "🚓 " + name;

                desc.innerText =
                    hindiMode
                        ? "पुलिस स्टेशन"
                        : "Police Station";
            }

            card.appendChild(title);
            card.appendChild(desc);

            nearbyBox.appendChild(card);

            if (map) {

                let marker =
                    L.marker([
                        placeLat,
                        placeLon
                    ])
                    .addTo(map)
                    .bindPopup(
                        (
                            type === "hospital"
                                ? "🏥 "
                                : "🚓 "
                        ) + name
                    );

                nearbyMarkers.push(marker);
            }
        });

    } catch (error) {

        console.error(
            "Nearby services error:",
            error
        );

        nearbyBox.innerHTML =
            hindiMode
                ? "<p>नज़दीकी सेवाएँ अभी लोड नहीं हो सकीं।</p>"
                : "<p>Unable to load nearby emergency services.</p>";
    }
}


// ==============================
// ALERTS
// ==============================

function openAlertsPanel() {

    closeAllPanels();

    document
        .getElementById("alerts-panel")
        .classList.add("panel-open");
}

function closeAlertsPanel() {

    document
        .getElementById("alerts-panel")
        .classList.remove("panel-open");
}

function loadSOSHistory() {

    alert(
        hindiMode
            ? "SOS इतिहास बैकएंड API से लोड किया जाएगा।"
            : "SOS history will be loaded from the backend API."
    );
}


// ==============================
// EMERGENCY PANEL
// ==============================

function openEmergencyPanel() {

    closeAllPanels();

    document
        .getElementById("emergency-panel")
        .classList.add("panel-open");
}

function closeEmergencyPanel() {

    document
        .getElementById("emergency-panel")
        .classList.remove("panel-open");
}


// ==============================
// DIGITAL TWIN
// ==============================

function openDigitalTwinPanel() {

    closeAllPanels();

    document
        .getElementById(
            "digital-twin-panel"
        )
        .classList.add("panel-open");
}

function closeDigitalTwinPanel() {

    document
        .getElementById(
            "digital-twin-panel"
        )
        .classList.remove("panel-open");
}


// ==============================
// EMERGENCY SIREN
// ==============================

let audioContext = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

function playAlarmSound() {

    stopAlarmSound();

    try {

        let AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        audioContext =
            new AudioContextClass();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        sirenOscillator =
            audioContext.createOscillator();

        sirenGain =
            audioContext.createGain();

        sirenOscillator.type =
            "sawtooth";

        sirenGain.gain.value =
            0.12;

        sirenOscillator.connect(
            sirenGain
        );

        sirenGain.connect(
            audioContext.destination
        );

        sirenOscillator.frequency.value =
            700;

        sirenOscillator.start();

        let highTone = false;

        sirenInterval =
            setInterval(function () {

                if (
                    !audioContext ||
                    !sirenOscillator
                ) {
                    return;
                }

                let target =
                    highTone
                        ? 700
                        : 1100;

                sirenOscillator.frequency
                    .cancelScheduledValues(
                        audioContext.currentTime
                    );

                sirenOscillator.frequency
                    .linearRampToValueAtTime(
                        target,
                        audioContext.currentTime + 0.35
                    );

                highTone = !highTone;

            }, 400);

    } catch (error) {

        console.error(
            "Siren error:",
            error
        );
    }
}

function stopAlarmSound() {

    if (sirenInterval) {

        clearInterval(
            sirenInterval
        );

        sirenInterval = null;
    }

    if (sirenOscillator) {

        try {
            sirenOscillator.stop();
        } catch (error) {}

        sirenOscillator = null;
    }

    if (audioContext) {

        try {
            audioContext.close();
        } catch (error) {}

        audioContext = null;
    }

    sirenGain = null;
}


// ==============================
// EMERGENCY FLOW
// ==============================

let countdownInterval = null;
let emergencySeconds = 10;
let currentEmergencyType = "";

function sendSOS() {
    startEmergency("sos");
}

function simulateFall() {
    startEmergency("fall");
}

function startEmergency(type) {

    currentEmergencyType =
        type;

    emergencySeconds =
        10;

    let popup =
        document.getElementById(
            "emergency-popup"
        );

    let title =
        document.getElementById(
            "emergency-title"
        );

    let countdown =
        document.getElementById(
            "countdown"
        );

    if (
        !popup ||
        !title ||
        !countdown
    ) {

        console.error(
            "Emergency popup elements missing."
        );

        return;
    }

    if (type === "fall") {

        title.innerText =
            hindiMode
                ? "⚠️ गिरने का पता चला!"
                : "⚠️ Fall Detected!";

    } else {

        title.innerText =
            hindiMode
                ? "🚨 SOS सक्रिय हुआ!"
                : "🚨 SOS Activated!";
    }

    countdown.innerText =
        emergencySeconds;

    popup.style.display =
        "flex";

    playAlarmSound();

    if (countdownInterval) {

        clearInterval(
            countdownInterval
        );

        countdownInterval = null;
    }

    countdownInterval =
        setInterval(function () {

            emergencySeconds--;

            countdown.innerText =
                emergencySeconds;

            console.log(
                "Countdown:",
                emergencySeconds
            );

            if (
                emergencySeconds <= 0
            ) {

                clearInterval(
                    countdownInterval
                );

                countdownInterval =
                    null;

                callEmergencyContacts(
                    true
                );
            }

        }, 1000);
}

function userIsOkay() {

    if (countdownInterval) {

        clearInterval(
            countdownInterval
        );

        countdownInterval =
            null;
    }

    stopAlarmSound();

    document.getElementById(
        "emergency-popup"
    ).style.display =
        "none";

    alert(
        hindiMode
            ? "आपातकालीन अनुरोध रद्द कर दिया गया।"
            : "Emergency request cancelled."
    );
}

function callEmergencyContacts(
    automatic = false
) {

    if (countdownInterval) {

        clearInterval(
            countdownInterval
        );

        countdownInterval =
            null;
    }

    stopAlarmSound();

    document.getElementById(
        "emergency-popup"
    ).style.display =
        "none";

    if (!navigator.geolocation) {

        sendEmergencyToBackend(
            null,
            null,
            automatic
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            sendEmergencyToBackend(
                position.coords.latitude,
                position.coords.longitude,
                automatic
            );
        },

        function () {

            sendEmergencyToBackend(
                null,
                null,
                automatic
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

function sendEmergencyToBackend(
    latitude,
    longitude,
    automatic
) {

    console.log(
        "Emergency Type:",
        currentEmergencyType
    );

    console.log(
        "Latitude:",
        latitude
    );

    console.log(
        "Longitude:",
        longitude
    );

    console.log(
        "Automatic:",
        automatic
    );

    alert(
        automatic
            ? (
                hindiMode
                    ? "10 सेकंड में कोई प्रतिक्रिया नहीं मिली। आपातकाल आगे बढ़ाया गया।"
                    : "No response within 10 seconds. Emergency escalated."
            )
            : (
                hindiMode
                    ? "आपातकालीन अनुरोध शुरू किया गया।"
                    : "Emergency request initiated."
            )
    );
}


// ==============================
// CHATBOT
// ==============================


// ==============================
// CHATBOT
// ==============================

function openChatbot() {

    let chatbot =
        document.getElementById("chatbot-container");

    if (chatbot) {
        chatbot.style.display = "flex";
    }
}


function closeChatbot() {

    let chatbot =
        document.getElementById("chatbot-container");

    if (chatbot) {
        chatbot.style.display = "none";
    }
}


function toggleChatbot() {

    let chatbot =
        document.getElementById("chatbot-container");

    if (!chatbot) {
        return;
    }

    if (chatbot.style.display === "flex") {
        closeChatbot();
    } else {
        openChatbot();
    }
}