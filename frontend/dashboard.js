// ==========================================
// 1. CURRENT USER
// ==========================================

let users =
    JSON.parse(localStorage.getItem("users")) || [];

let currentUserEmail =
    localStorage.getItem("currentUser");


// Agar login nahi hai to login page par bhejo
if (!currentUserEmail) {
    window.location.href = "login.html";
}

// Logged-in user find karo
let currentUser = users.find(function (user) {
    return user.email === currentUserEmail;
});


// User ki information dashboard par show karo
if (currentUser) {

    document.getElementById("user-name").innerText =
        currentUser.name;

    document.getElementById("profile-name").innerText =
        currentUser.name;

    document.getElementById("profile-email").innerText =
        currentUser.email;

    document.getElementById("profile-phone").innerText =
        currentUser.phone;

    document.getElementById("profile-age").innerText =
        currentUser.age;

    document.querySelector(".profile-circle").innerText =
        currentUser.name.charAt(0).toUpperCase();
}



// ==========================================
// 2. LOGOUT
// ==========================================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}


// ==========================================
// 3. DARK / LIGHT MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    let themeButton =
        document.getElementById("theme-button");


    if (document.body.classList.contains("light-mode")) {

        themeButton.innerText = "🌙";

    } else {

        themeButton.innerText = "☀️";
    }
}



// ==========================================
// 4. LANGUAGE
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

        languageButton.innerText = "हिंदी / EN";

        document.getElementById("chat-input").placeholder =
            "अपना संदेश लिखें...";

    } else {

        languageButton.innerText = "EN / हिंदी";

        document.getElementById("chat-input").placeholder =
            "Type your message...";
    }
}



// ==========================================
// 5. COMMON SIDE PANEL SYSTEM
// ==========================================

function closeAllPanels() {

    let panels =
        document.querySelectorAll(".side-panel");


    panels.forEach(function (panel) {

        panel.classList.remove("panel-open");

    });
}



// Dashboard click hone par panels close
function showDashboard() {

    closeAllPanels();
}



// ==========================================
// 6. FAMILY PANEL
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
// 7. CONTACT FORM
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
// 8. SAVE EMERGENCY CONTACT
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


    // Check empty fields
    if (
        name === "" ||
        phone === "" ||
        relation === ""
    ) {

        if (hindiMode) {

            alert("कृपया सभी जानकारी भरें।");

        } else {

            alert("Please fill all contact details.");
        }

        return;
    }


    /*
       IMPORTANT:

       LocalStorage use nahi kar rahe.

       Tanishka ki POST Emergency Contact API
       yahan connect hogi.

       Future:

       fetch("TANISHKA_API_URL", {
           method: "POST",

           headers: {
               "Content-Type": "application/json"
           },

           body: JSON.stringify({
               userId: ...,
               name: name,
               phone: phone,
               relation: relation
           })
       })

    */


    if (hindiMode) {

        alert(
            "फॉर्म तैयार है।\nबैकएंड API इंटीग्रेशन बाकी है।"
        );

    } else {

        alert(
            "Contact form is ready.\nBackend API integration is pending."
        );
    }
}



// ==========================================
// 9. LOCATION PANEL
// ==========================================

let map = null;

let locationMarker = null;


function openLocationPanel() {

    closeAllPanels();


    document
        .getElementById("location-panel")
        .classList.add("panel-open");


    // Hidden panel se map open hone par
    // Leaflet ko correct size batana hota hai.

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
// 10. GET CURRENT LOCATION
// ==========================================

function getCurrentLocation() {

    let status =
        document.getElementById("location-status");


    // Browser geolocation support check
    if (!navigator.geolocation) {

        if (hindiMode) {

            status.innerText =
                "यह ब्राउज़र स्थान का समर्थन नहीं करता।";

        } else {

            status.innerText =
                "Location is not supported.";
        }

        return;
    }


    if (hindiMode) {

        status.innerText =
            "स्थान प्राप्त किया जा रहा है...";

    } else {

        status.innerText =
            "Getting your location...";
    }


    navigator.geolocation.getCurrentPosition(

        // SUCCESS
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


            if (hindiMode) {

                status.innerText =
                    "स्थान सफलतापूर्वक प्राप्त हुआ";

            } else {

                status.innerText =
                    "Location detected successfully";
            }


            // Emergency center ka status bhi update
            document.getElementById(
                "emergency-location-status"
            ).innerText =
                hindiMode
                    ? "स्थान उपलब्ध है"
                    : "Location available";


            showLocationOnMap(
                latitude,
                longitude
            );
        },


        // ERROR
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
        }
    );
}



// ==========================================
// 11. SHOW LOCATION ON MAP
// ==========================================

function showLocationOnMap(latitude, longitude) {

    // First time map create hoga
    if (!map) {

        map =
            L.map("map").setView(
                [latitude, longitude],
                16
            );


        // OpenStreetMap tiles
        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);
    }


    // Marker already hai
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
// 12. ALERTS PANEL
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
// 13. LOAD SOS HISTORY
// ==========================================

function loadSOSHistory() {

    /*
       Tanishka ki GET SOS History API
       yahan connect hogi.

       MongoDB ke actual records
       yahan se load honge.

       Fake localStorage history
       use nahi kar rahe.
    */


    if (hindiMode) {

        alert(
            "SOS History backend API से connect की जाएगी।"
        );

    } else {

        alert(
            "SOS History will be connected to the backend API."
        );
    }
}



// ==========================================
// 14. EMERGENCY PANEL
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
// DIGITAL TWIN PANEL
// ==========================================

function openDigitalTwinPanel() {

    closeAllPanels();

    document
        .getElementById("digital-twin-panel")
        .classList.add("panel-open");
}


function closeDigitalTwinPanel() {

    document
        .getElementById("digital-twin-panel")
        .classList.remove("panel-open");
}


// ==========================================
// 16. EMERGENCY ALARM
// ==========================================

let audioContext = null;

let alarmInterval = null;


// Ek short warning beep
function createAlarmBeep() {

    if (!audioContext) {
        return;
    }


    let oscillator =
        audioContext.createOscillator();

    let gain =
        audioContext.createGain();


    // Normal electronic alarm tone
    oscillator.type = "sine";


    oscillator.frequency.setValueAtTime(
        620,
        audioContext.currentTime
    );


    oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime + 0.18
    );


    gain.gain.setValueAtTime(
        0.18,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.35
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.35
    );
}



// Alarm start
function playAlarmSound() {

    stopAlarmSound();


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    createAlarmBeep();


    alarmInterval =
        setInterval(function () {

            createAlarmBeep();

        }, 700);
}



// Alarm stop
function stopAlarmSound() {

    if (alarmInterval) {

        clearInterval(alarmInterval);

        alarmInterval = null;
    }


    if (audioContext) {

        audioContext.close();

        audioContext = null;
    }
}



// ==========================================
// 17. SOS + FALL DETECTION
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
// 18. START EMERGENCY
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


    // Correct title
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


    // Popup show
    popup.style.display = "flex";


    // Alarm start
    playAlarmSound();


    // Agar old timer chal raha ho
    if (countdownInterval) {

        clearInterval(countdownInterval);
    }


    countdownInterval =
        setInterval(function () {

            emergencySeconds--;


            countdown.innerText =
                emergencySeconds;


            // 10 seconds complete
            if (emergencySeconds <= 0) {

                clearInterval(
                    countdownInterval
                );

                countdownInterval = null;


                // Automatically emergency escalate
                callEmergencyContacts(true);
            }

        }, 1000);
}



// ==========================================
// 19. USER IS OKAY
// ==========================================

function userIsOkay() {

    if (countdownInterval) {

        clearInterval(
            countdownInterval
        );

        countdownInterval = null;
    }


    stopAlarmSound();


    document.getElementById(
        "emergency-popup"
    ).style.display = "none";


    if (hindiMode) {

        alert(
            "आपातकालीन अनुरोध रद्द कर दिया गया।"
        );

    } else {

        alert(
            "Emergency request cancelled."
        );
    }
}



// ==========================================
// 20. CALL EMERGENCY CONTACTS
// ==========================================

function callEmergencyContacts(automatic = false) {

    // Timer stop
    if (countdownInterval) {

        clearInterval(
            countdownInterval
        );

        countdownInterval = null;
    }


    // Alarm stop
    stopAlarmSound();


    // Popup close
    document.getElementById(
        "emergency-popup"
    ).style.display = "none";


    /*
       Ab current location lene ki koshish karenge.

       Location mil gayi:
       Backend ko latitude + longitude bhejenge.

       Location nahi mili:
       Emergency fir bhi backend ko bhejni hai.
    */


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

            let latitude =
                position.coords.latitude;

            let longitude =
                position.coords.longitude;


            sendEmergencyToBackend(
                latitude,
                longitude,
                automatic
            );
        },


        function () {

            // Location fail hui,
            // emergency cancel nahi hogi.

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



// ==========================================
// 21. SEND EMERGENCY TO BACKEND
// ==========================================

function sendEmergencyToBackend(
    latitude,
    longitude,
    automatic
) {

    /*
       YAHAN TANISHKA KI SOS POST API AAYEGI.

       Example future data:

       {
           userId: ...,

           location: {
               latitude: latitude,
               longitude: longitude
           },

           emergencyMessage:
               currentEmergencyType === "fall"
               ? "Fall Detected"
               : "SOS Activated"
       }


       IMPORTANT:

       Actual endpoint aur exact field names
       Tanishka se lene ke baad hi fetch()
       add karenge.
    */


    if (automatic) {

        if (hindiMode) {

            alert(
                "10 सेकंड में कोई प्रतिक्रिया नहीं मिली।\n\nआपातकाल स्वचालित रूप से आगे बढ़ाया गया।"
            );

        } else {

            alert(
                "No response received within 10 seconds.\n\nEmergency automatically escalated."
            );
        }

    } else {

        if (hindiMode) {

            alert(
                "आपातकालीन अनुरोध शुरू किया गया।"
            );

        } else {

            alert(
                "Emergency request initiated."
            );
        }
    }


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
}



// ==========================================
// 22. SAATHI AI CHATBOT
// ==========================================

function openChatbot() {

    closeAllPanels();


    document.getElementById(
        "chatbot-container"
    ).style.display = "flex";
}



function closeChatbot() {

    document.getElementById(
        "chatbot-container"
    ).style.display = "none";
}



function toggleChatbot() {

    let chatbot =
        document.getElementById(
            "chatbot-container"
        );


    if (chatbot.style.display === "flex") {

        closeChatbot();

    } else {

        openChatbot();
    }
}



// ==========================================
// 23. SEND CHAT MESSAGE
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


    // Input clear
    input.value = "";


    /*
       Gemini API ko frontend se directly
       call nahi karenge.

       Future flow:

       Frontend
          ↓
       Tanishka Backend
          ↓
       Gemini API
          ↓
       Backend
          ↓
       Frontend

       Isse API key frontend me expose
       nahi hogi.
    */


    setTimeout(function () {

        if (hindiMode) {

            addBotMessage(
                "मैं अभी डेमो मोड में हूँ। Gemini AI इंटीग्रेशन जल्द जोड़ा जाएगा।"
            );

        } else {

            addBotMessage(
                "I'm currently in demo mode. Gemini AI integration will be added through the backend."
            );
        }

    }, 500);
}



// ==========================================
// 24. ADD USER MESSAGE
// ==========================================

function addUserMessage(message) {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    let messageDiv =
        document.createElement("div");


    messageDiv.className =
        "user-message";


    let bubble =
        document.createElement("div");


    bubble.className =
        "message-bubble";


    let text =
        document.createElement("p");


    text.innerText =
        message;


    bubble.appendChild(text);

    messageDiv.appendChild(bubble);

    chatMessages.appendChild(messageDiv);


    scrollChatToBottom();
}



// ==========================================
// 25. ADD BOT MESSAGE
// ==========================================

function addBotMessage(message) {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    let messageDiv =
        document.createElement("div");


    messageDiv.className =
        "bot-message";


    let avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";

    avatar.innerText =
        "🤖";


    let bubble =
        document.createElement("div");


    bubble.className =
        "message-bubble";


    let text =
        document.createElement("p");


    text.innerText =
        message;


    bubble.appendChild(text);

    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

    chatMessages.appendChild(messageDiv);


    scrollChatToBottom();
}



// ==========================================
// 26. ENTER KEY IN CHAT
// ==========================================

function handleChatEnter(event) {

    if (event.key === "Enter") {

        sendChatMessage();
    }
}



// ==========================================
// 27. CHAT AUTO SCROLL
// ==========================================

function scrollChatToBottom() {

    let chatMessages =
        document.getElementById(
            "chat-messages"
        );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}