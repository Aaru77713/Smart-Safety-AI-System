// ===============================
// LOGIN / SIGNUP MODE
// ===============================

let isSignup = false;


// ===============================
// SWITCH LOGIN / SIGNUP
// ===============================

function toggleForm() {

    isSignup = !isSignup;


    let nameGroup =
        document.getElementById("name-group");

    let phoneGroup =
        document.getElementById("phone-group");

    let ageGroup =
        document.getElementById("age-group");


    let title =
        document.getElementById("form-title");

    let smallHeading =
        document.getElementById("small-heading");

    let description =
        document.getElementById("form-description");

    let buttonText =
        document.getElementById("button-text");

    let switchText =
        document.getElementById("switch-text");

    let switchButton =
        document.getElementById("switch-button");

    let message =
        document.getElementById("message");


    // Clear old message

    message.innerText = "";


    // ===============================
    // SIGNUP MODE
    // ===============================

    if (isSignup) {

        nameGroup.classList.remove("hidden");

        phoneGroup.classList.remove("hidden");

        ageGroup.classList.remove("hidden");


        smallHeading.innerText =
            "WELCOME TO SAATHI";

        title.innerText =
            "Create your account";

        description.innerText =
            "Tell us a little about yourself.";

        buttonText.innerText =
            "Create Account";

        switchText.innerText =
            "Already have an account?";

        switchButton.innerText =
            "Login";

    }


    // ===============================
    // LOGIN MODE
    // ===============================

    else {

        nameGroup.classList.add("hidden");

        phoneGroup.classList.add("hidden");

        ageGroup.classList.add("hidden");


        smallHeading.innerText =
            "WELCOME BACK";

        title.innerText =
            "Login to Saathi";

        description.innerText =
            "Enter your details to continue.";

        buttonText.innerText =
            "Login";

        switchText.innerText =
            "Don't have an account?";

        switchButton.innerText =
            "Create Account";
    }
}



// ===============================
// LOGIN / SIGNUP
// ===============================

function handleAuth() {


    // Get email

    let email =
        document.getElementById("email")
            .value
            .trim();


    // Get password

    let password =
        document.getElementById("password")
            .value
            .trim();


    // Message element

    let message =
        document.getElementById("message");


    // ===============================
    // BASIC VALIDATION
    // ===============================

    if (
        email === "" ||
        password === ""
    ) {

        message.style.color =
            "#ff6262";

        message.innerText =
            "Please enter your email and password.";

        return;
    }


    // ===============================
    // SIGNUP
    // ===============================

    if (isSignup) {


        let name =
            document.getElementById("name")
                .value
                .trim();


        let phone =
            document.getElementById("phone")
                .value
                .trim();


        let age =
            document.getElementById("age")
                .value
                .trim();


        // Check all fields

        if (
            name === "" ||
            phone === "" ||
            age === ""
        ) {

            message.style.color =
                "#ff6262";

            message.innerText =
                "Please fill all the details.";

            return;
        }


        // Get existing users

        let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];


        // Check duplicate email

        let existingUser =
            users.find(function (user) {

                return user.email === email;

            });


        if (existingUser) {

            message.style.color =
                "#ff6262";

            message.innerText =
                "An account with this email already exists.";

            return;
        }


        // Create new user

        let newUser = {

            name: name,

            email: email,

            phone: phone,

            age: age,

            password: password
        };


        // Add user

        users.push(newUser);


        // Save users

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // Remember logged-in user

        localStorage.setItem(
            "currentUser",
            email
        );


        message.style.color =
            "#42d392";

        message.innerText =
            "Account created successfully!";


        // Go to dashboard

        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 500);

    }


    // ===============================
    // LOGIN
    // ===============================

    else {


        // Get users

        let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];


        // Find user

        let user =
            users.find(function (user) {

                return user.email === email;

            });


        // ===============================
        // EMAIL NOT FOUND
        // ===============================

        if (!user) {

            message.style.color =
                "#ff6262";

            message.innerText =
                "Email not found. Please create an account.";

            return;
        }


        // ===============================
        // WRONG PASSWORD
        // ===============================

        if (user.password !== password) {

            message.style.color =
                "#ff6262";

            message.innerText =
                "Incorrect password. Please try again.";

            return;
        }


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        localStorage.setItem(
            "currentUser",
            email
        );


        message.style.color =
            "#42d392";

        message.innerText =
            "Login successful!";


        // Open dashboard

        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 500);
    }
}