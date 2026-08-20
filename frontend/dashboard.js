// ==========================================
// CURRENT USER
// ==========================================

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


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// ==========================================
// DARK / LIGHT MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    let themeButton =
        document.getElementById("theme-button");


    if (
        document.body.classList.contains("light-mode")
    ) {

        themeButton.innerText = "🌙";

    } else {

        themeButton.innerText = "☀️";
    }
}


// ==========================================
// LANGUAGE
// ==========================================

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


    if (hindiMode) {

        languageButton.innerText =
            "हिंदी / EN";

        document.getElementById(
            "chat-input"
        ).placeholder =
            "अपना संदेश लिखें...";

    } else {

        languageButton.innerText =
            "EN / हिंदी";

        document.getElementById(
            "chat-input"
        ).placeholder =
            "Type your message...";
    }
}


// ==========================================
// COMMON PANEL SYSTEM
// ==========================================

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


// ==========================================
// FAMILY PANEL
// ==========================================

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


// ==========================================
// CONTACT FORM
// ==========================================

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


// ==========================================
// SAVE EMERGENCY CONTACT
// ==========================================

function saveEmergencyContact() {

    let name =
        document.getElementById("contact-name")
            .value.trim();

    let phone =
        document.getElementById("contact-phone")
            .value.trim();

    let relation =
        document.getElementById("contact-relation")
            .value;


    if (
        name === "" ||
        phone === "" ||
        relation === ""
    ) {

        alert(
            hindiMode
                ? "कृपया सभी जानकारी भरें।"
                : "Please fill all contact details."
        );

        return;
    }


    alert(
        hindiMode
            ? "बैकएंड इंटीग्रेशन के बाद संपर्क सेव होगा।"
            : "Contact will be saved after backend integration."
    );
}


// ==========================================
// LOCATION
// ==========================================

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


// ==========================================
// GET CURRENT LOCATION
// ==========================================

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


            document.getElementById(
                "latitude"
            ).innerText =
                latitude.toFixed(6);


            document.getElementById(
                "longitude"
            ).innerText =
                longitude.toFixed(6);


            status.innerText =
                hindiMode
                    ? "स्थान सफलतापूर्वक प्राप्त हुआ"
                    : "Location detected successfully";


            let emergencyLocationStatus =
                document.getElementById(
                    "emergency-location-status"
                );


            if (emergencyLocationStatus) {

                emergencyLocationStatus.innerText =
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


// ==========================================
// SHOW CURRENT LOCATION ON MAP
// ==========================================

function showLocationOnMap(
    latitude,
    longitude
) {

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


// ==========================================
// FIND NEARBY HOSPITALS AND POLICE
// ==========================================

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


    // Old nearby markers clear karo
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


        if (
            !data.elements ||
            data.elements.length === 0
        ) {

            nearbyBox.innerHTML =
                hindiMode
                    ? "<p>5 किलोमीटर के अंदर कोई सेवा नहीं मिली।</p>"
                    : "<p>No emergency services found within 5 km.</p>";

            return;
        }


        let visibleCount = 0;


        data.elements.forEach(
            function (place) {

                let tags =
                    place.tags || {};


                let name =
                    tags.name ||
                    (
                        tags.amenity === "hospital"
                            ? "Unnamed Hospital"
                            : "Unnamed Police Station"
                    );


                let type =
                    tags.amenity;


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


                visibleCount++;


                let card =
                    document.createElement("div");


                card.className =
                    "nearby-card";


                let heading =
                    document.createElement("h4");


                let description =
                    document.createElement("p");


                if (type === "hospital") {

                    heading.innerText =
                        "🏥 " + name;

                    description.innerText =
                        hindiMode
                            ? "अस्पताल"
                            : "Hospital";

                } else {

                    heading.innerText =
                        "🚓 " + name;

                    description.innerText =
                        hindiMode
                            ? "पुलिस स्टेशन"
                            : "Police Station";
                }


                card.appendChild(heading);

                card.appendChild(description);

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
                            ) +
                            name
                        );


                    nearbyMarkers.push(marker);
                }
            }
        );


        if (visibleCount === 0) {

            nearbyBox.innerHTML =
                hindiMode
                    ? "<p>नज़दीकी सेवाओं का स्थान उपलब्ध नहीं मिला।</p>"
                    : "<p>No nearby services with location data were found.</p>";
        }

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


// ==========================================
// ALERTS PANEL
// ==========================================

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


// ==========================================
// SOS HISTORY
// ==========================================

function loadSOSHistory() {

    alert(
        hindiMode
            ? "SOS इतिहास बैकएंड API से लोड किया जाएगा।"
            : "SOS history will be loaded from the backend API."
    );
}


// ==========================================
// EMERGENCY PANEL
// ==========================================

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


// ==========================================
// DIGITAL TWIN
// ==========================================

function openDigitalTwinPanel() {

    closeAllPanels();

    document
        .getElementById(
            "digital-twin-panel"
        )
        .classList.add(
            "panel-open"
        );
}


function closeDigitalTwinPanel() {

    document
        .getElementById(
            "digital-twin-panel"
        )
        .classList.remove(
            "panel-open"
        );
}


// ==========================================
// EMERGENCY ALARM
// ==========================================

let audioContext = null;

let alarmInterval = null;


function createAlarmBeep() {

    if (!audioContext) {
        return;
    }

    let oscillator =
        audioContext.createOscillator();

    let gain =
        audioContext.createGain();


    oscillator.type = "sawtooth";


    oscillator.frequency.setValueAtTime(
        700,
        audioContext.currentTime
    );


    oscillator.frequency.linearRampToValueAtTime(
        1100,
        audioContext.currentTime + 0.45
    );


    oscillator.frequency.linearRampToValueAtTime(
        700,
        audioContext.currentTime + 0.9
    );


    gain.gain.setValueAtTime(
        0.22,
        audioContext.currentTime
    );


    gain.gain.linearRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.9
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.9
    );
}


    createAlarmBeep();


    alarmInterval =
    setInterval(function () {

        createAlarmBeep();

    }, 950);



function stopAlarmSound() {

    if (alarmInterval) {

        clearInterval(
            alarmInterval
        );

        alarmInterval = null;
    }


    if (audioContext) {

        audioContext.close();

        audioContext = null;
    }
}


// ==========================================
// SOS + FALL DETECTION
// ==========================================

let countdownInterval = null;

let emergencySeconds = 10;

let currentEmergencyType = "";


function sendSOS() {

    startEmergency("sos");
}


function simulateFall() {

    startEmergency("fall");
}


// ==========================================
// START EMERGENCY
// ==========================================

function startEmergency(type) {

    currentEmergencyType = type;

    emergencySeconds = 10;


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
    }


    countdownInterval =
        setInterval(function () {

            emergencySeconds--;


            countdown.innerText =
                emergencySeconds;


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


// ==========================================
// USER IS OKAY
// ==========================================

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


// ==========================================
// CALL EMERGENCY CONTACTS
// ==========================================

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


    navigator.geolocation
        .getCurrentPosition(

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
                enableHighAccuracy:
                    true,

                timeout:
                    5000,

                maximumAge:
                    0
            }
        );
}


// ==========================================
// BACKEND EMERGENCY PLACEHOLDER
// ==========================================

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


// ==========================================
// CHATBOT
// ==========================================

function openChatbot() {

    closeAllPanels();


    document.getElementById(
        "chatbot-container"
    ).style.display =
        "flex";
}


function closeChatbot() {

    document.getElementById(
        "chatbot-container"
    ).style.display =
        "none";
}


function toggleChatbot() {

    let chatbot =
        document.getElementById(
            "chatbot-container"
        );


    if (
        chatbot.style.display ===
        "flex"
    ) {

        closeChatbot();

    } else {

        openChatbot();
    }
}


// ==========================================
// SEND CHAT MESSAGE
// ==========================================

function sendChatMessage() {

    let input =
        document.getElementById(
            "chat-input"
        );


    let message =
        input.value.trim();


    if (message === "") {
        return;
    }


    addUserMessage(message);


    input.value = "";


    setTimeout(function () {

        addBotMessage(

            hindiMode
                ? "मैं अभी डेमो मोड में हूँ। Gemini इंटीग्रेशन बैकएंड से किया जाएगा।"
                : "I'm currently in demo mode. Gemini will be connected through the backend."

        );

    }, 500);
}


// ==========================================
// USER CHAT MESSAGE
// ==========================================

function addUserMessage(message) {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    let messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.className =
        "user-message";


    let bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    let text =
        document.createElement(
            "p"
        );


    text.innerText =
        message;


    bubble.appendChild(
        text
    );


    messageDiv.appendChild(
        bubble
    );


    chatMessages.appendChild(
        messageDiv
    );


    scrollChatToBottom();
}


// ==========================================
// BOT CHAT MESSAGE
// ==========================================

function addBotMessage(message) {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    let messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.className =
        "bot-message";


    let avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.innerText =
        "🤖";


    let bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    let text =
        document.createElement(
            "p"
        );


    text.innerText =
        message;


    bubble.appendChild(
        text
    );


    messageDiv.appendChild(
        avatar
    );


    messageDiv.appendChild(
        bubble
    );


    chatMessages.appendChild(
        messageDiv
    );


    scrollChatToBottom();
}


// ==========================================
// ENTER KEY
// ==========================================

function handleChatEnter(event) {

    if (event.key === "Enter") {

        sendChatMessage();
    }
}


// ==========================================
// CHAT AUTO SCROLL
// ==========================================

function scrollChatToBottom() {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}