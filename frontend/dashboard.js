// =====================================================
// SAATHI DASHBOARD JAVASCRIPT
// =====================================================


// =====================================================
// 1. CHATBOT URL
// =====================================================

// Agar Streamlit kisi aur port par chal raha hai,
// sirf yahan URL change karna.

const CHATBOT_URL = "http://localhost:8506";


// =====================================================
// 2. CURRENT USER
// =====================================================

let users =
    JSON.parse(localStorage.getItem("users")) || [];

let currentUserEmail =
    localStorage.getItem("currentUser");


// Login nahi hai
if (!currentUserEmail) {

    window.location.href =
        "login.html";
}


// Current user find karo
let currentUser =
    users.find(function (user) {

        return user.email === currentUserEmail;
    });


// Dashboard par user data show karo
if (currentUser) {

    let userName =
        document.getElementById("user-name");

    let profileName =
        document.getElementById("profile-name");

    let profileEmail =
        document.getElementById("profile-email");

    let profilePhone =
        document.getElementById("profile-phone");

    let profileAge =
        document.getElementById("profile-age");

    let profileCircle =
        document.querySelector(".profile-circle");


    if (userName) {
        userName.innerText =
            currentUser.name;
    }


    if (profileName) {
        profileName.innerText =
            currentUser.name;
    }


    if (profileEmail) {
        profileEmail.innerText =
            currentUser.email;
    }


    if (profilePhone) {
        profilePhone.innerText =
            currentUser.phone || "--";
    }


    if (profileAge) {
        profileAge.innerText =
            currentUser.age || "--";
    }


    if (
        profileCircle &&
        currentUser.name
    ) {

        profileCircle.innerText =
            currentUser.name
                .charAt(0)
                .toUpperCase();
    }
}


// =====================================================
// 3. LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "login.html";
}


// =====================================================
// 4. DARK / LIGHT MODE
// =====================================================

function toggleTheme() {

    document.body
        .classList
        .toggle("light-mode");


    let themeButton =
        document.getElementById(
            "theme-button"
        );


    if (!themeButton) {
        return;
    }


    if (
        document.body
            .classList
            .contains("light-mode")
    ) {

        themeButton.innerText =
            "🌙";

    } else {

        themeButton.innerText =
            "☀️";
    }
}


// =====================================================
// 5. LANGUAGE
// =====================================================

let hindiMode = false;


function changeLanguage() {

    hindiMode =
        !hindiMode;


    let elements =
        document.querySelectorAll(
            "[data-en]"
        );


    elements.forEach(
        function (element) {

            if (hindiMode) {

                element.innerText =
                    element.getAttribute(
                        "data-hi"
                    );

            } else {

                element.innerText =
                    element.getAttribute(
                        "data-en"
                    );
            }
        }
    );


    let languageButton =
        document.getElementById(
            "language-button"
        );


    if (languageButton) {

        languageButton.innerText =
            hindiMode
                ? "हिंदी / EN"
                : "EN / हिंदी";
    }
}


// =====================================================
// 6. CLOSE ALL SIDE PANELS
// =====================================================

function closeAllPanels() {

    let panels =
        document.querySelectorAll(
            ".side-panel"
        );


    panels.forEach(
        function (panel) {

            panel.classList.remove(
                "panel-open"
            );
        }
    );
}


// Dashboard par wapas
function showDashboard() {

    closeAllPanels();
}


// =====================================================
// 7. FAMILY PANEL
// =====================================================

function openFamilyPanel() {

    closeAllPanels();


    let panel =
        document.getElementById(
            "family-panel"
        );


    if (panel) {

        panel.classList.add(
            "panel-open"
        );
    }
}


function closeFamilyPanel() {

    let panel =
        document.getElementById(
            "family-panel"
        );


    if (panel) {

        panel.classList.remove(
            "panel-open"
        );
    }
}


// =====================================================
// 8. CONTACT FORM
// =====================================================

function showContactForm() {

    let form =
        document.getElementById(
            "contact-form"
        );


    if (form) {

        form.classList.add(
            "show"
        );
    }
}


function hideContactForm() {

    let form =
        document.getElementById(
            "contact-form"
        );


    if (form) {

        form.classList.remove(
            "show"
        );
    }
}


// =====================================================
// 9. SAVE EMERGENCY CONTACT
// =====================================================

function saveEmergencyContact() {

    let nameElement =
        document.getElementById(
            "contact-name"
        );

    let phoneElement =
        document.getElementById(
            "contact-phone"
        );

    let relationElement =
        document.getElementById(
            "contact-relation"
        );


    if (
        !nameElement ||
        !phoneElement ||
        !relationElement
    ) {

        return;
    }


    let name =
        nameElement.value.trim();

    let phone =
        phoneElement.value.trim();

    let relation =
        relationElement.value;


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


    // Backend integration ke time
    // yahan POST API lagegi.

    alert(
        hindiMode
            ? "संपर्क बैकएंड इंटीग्रेशन के बाद सेव होगा।"
            : "Contact will be saved after backend integration."
    );
}


// =====================================================
// 10. LOCATION VARIABLES
// =====================================================

let map = null;

let locationMarker = null;

let nearbyMarkers = [];


// =====================================================
// 11. LOCATION PANEL
// =====================================================

function openLocationPanel() {

    closeAllPanels();


    let panel =
        document.getElementById(
            "location-panel"
        );


    if (panel) {

        panel.classList.add(
            "panel-open"
        );
    }


    setTimeout(
        function () {

            if (map) {

                map.invalidateSize();
            }

        },
        450
    );
}


function closeLocationPanel() {

    let panel =
        document.getElementById(
            "location-panel"
        );


    if (panel) {

        panel.classList.remove(
            "panel-open"
        );
    }
}


// =====================================================
// 12. GET CURRENT LOCATION
// =====================================================

function getCurrentLocation() {

    let status =
        document.getElementById(
            "location-status"
        );


    if (
        !navigator.geolocation
    ) {

        if (status) {

            status.innerText =
                hindiMode
                    ? "यह ब्राउज़र स्थान का समर्थन नहीं करता।"
                    : "Location is not supported.";
        }

        return;
    }


    if (status) {

        status.innerText =
            hindiMode
                ? "स्थान प्राप्त किया जा रहा है..."
                : "Getting your location...";
    }


    navigator.geolocation
        .getCurrentPosition(

            // SUCCESS
            function (position) {

                let latitude =
                    position.coords.latitude;

                let longitude =
                    position.coords.longitude;


                let latitudeElement =
                    document.getElementById(
                        "latitude"
                    );

                let longitudeElement =
                    document.getElementById(
                        "longitude"
                    );


                if (latitudeElement) {

                    latitudeElement.innerText =
                        latitude.toFixed(6);
                }


                if (longitudeElement) {

                    longitudeElement.innerText =
                        longitude.toFixed(6);
                }


                if (status) {

                    status.innerText =
                        hindiMode
                            ? "स्थान सफलतापूर्वक प्राप्त हुआ"
                            : "Location detected successfully";
                }


                let emergencyLocationStatus =
                    document.getElementById(
                        "emergency-location-status"
                    );


                if (
                    emergencyLocationStatus
                ) {

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


            // ERROR
            function (error) {

                if (!status) {
                    return;
                }


                if (error.code === 1) {

                    status.innerText =
                        hindiMode
                            ? "स्थान की अनुमति नहीं दी गई।"
                            : "Location permission denied.";

                } else if (
                    error.code === 2
                ) {

                    status.innerText =
                        hindiMode
                            ? "स्थान उपलब्ध नहीं है।"
                            : "Location unavailable.";

                } else if (
                    error.code === 3
                ) {

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
                enableHighAccuracy:
                    true,

                timeout:
                    10000,

                maximumAge:
                    0
            }
        );
}


// =====================================================
// 13. SHOW LOCATION ON MAP
// =====================================================

function showLocationOnMap(
    latitude,
    longitude
) {

    if (
        typeof L === "undefined"
    ) {

        console.log(
            "Leaflet is not loaded."
        );

        return;
    }


    if (!map) {

        map =
            L.map("map")
                .setView(
                    [
                        latitude,
                        longitude
                    ],
                    16
                );


        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        )
        .addTo(map);
    }


    if (locationMarker) {

        locationMarker
            .setLatLng(
                [
                    latitude,
                    longitude
                ]
            );

    } else {

        locationMarker =
            L.marker(
                [
                    latitude,
                    longitude
                ]
            )
            .addTo(map);
    }


    locationMarker
        .bindPopup(
            hindiMode
                ? "📍 आपका वर्तमान स्थान"
                : "📍 Your Current Location"
        )
        .openPopup();


    map.setView(
        [
            latitude,
            longitude
        ],
        16
    );


    setTimeout(
        function () {

            map.invalidateSize();

        },
        100
    );
}


// =====================================================
// 14. FIND NEARBY HOSPITALS + POLICE
// =====================================================

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


    // Old markers remove
    nearbyMarkers.forEach(
        function (marker) {

            if (map) {

                map.removeLayer(
                    marker
                );
            }
        }
    );


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
        encodeURIComponent(
            query
        );


    try {

        let response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "Nearby service error: " +
                response.status
            );
        }


        let data =
            await response.json();


        nearbyBox.innerHTML =
            "";


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


        data.elements.forEach(
            function (place) {

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


                // Card
                let card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "nearby-card";


                let heading =
                    document.createElement(
                        "h4"
                    );


                let description =
                    document.createElement(
                        "p"
                    );


                if (
                    type === "hospital"
                ) {

                    heading.innerText =
                        "🏥 " +
                        name;


                    description.innerText =
                        hindiMode
                            ? "अस्पताल"
                            : "Hospital";

                } else {

                    heading.innerText =
                        "🚓 " +
                        name;


                    description.innerText =
                        hindiMode
                            ? "पुलिस स्टेशन"
                            : "Police Station";
                }


                card.appendChild(
                    heading
                );


                card.appendChild(
                    description
                );


                nearbyBox.appendChild(
                    card
                );


                // Marker
                if (map) {

                    let marker =
                        L.marker(
                            [
                                placeLat,
                                placeLon
                            ]
                        )
                        .addTo(map)
                        .bindPopup(
                            (
                                type === "hospital"
                                    ? "🏥 "
                                    : "🚓 "
                            ) +
                            name
                        );


                    nearbyMarkers.push(
                        marker
                    );
                }
            }
        );

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


// =====================================================
// 15. ALERTS PANEL
// =====================================================

function openAlertsPanel() {

    closeAllPanels();


    let panel =
        document.getElementById(
            "alerts-panel"
        );


    if (panel) {

        panel.classList.add(
            "panel-open"
        );
    }
}


function closeAlertsPanel() {

    let panel =
        document.getElementById(
            "alerts-panel"
        );


    if (panel) {

        panel.classList.remove(
            "panel-open"
        );
    }
}


// =====================================================
// 16. SOS HISTORY
// =====================================================

function loadSOSHistory() {

    alert(
        hindiMode
            ? "SOS इतिहास बैकएंड API से लोड किया जाएगा।"
            : "SOS history will be loaded from the backend API."
    );
}


// =====================================================
// 17. EMERGENCY PANEL
// =====================================================

function openEmergencyPanel() {

    closeAllPanels();


    let panel =
        document.getElementById(
            "emergency-panel"
        );


    if (panel) {

        panel.classList.add(
            "panel-open"
        );
    }
}