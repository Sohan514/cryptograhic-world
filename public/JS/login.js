function validateSignup() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("new-password").value.trim();
    let confirmPassword = document.getElementById("confirm-password").value.trim();

    let isValid = true;

    if (!name) {
        document.getElementById("name-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("name-error").style.display = "none";
    }

    if (!email) {
        document.getElementById("email-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("email-error").style.display = "none";
    }

    if (!password) {
        document.getElementById("password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("password-error").style.display = "none";
    }

    if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("confirm-password-error").style.display = "none";
    }

    return isValid; // Form submits only if true
}

function validateLogin(event) {
    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value.trim();
    
    document.getElementById("login-error").innerText = email && password ? "" : "Both fields are required!";

    if (!email || !password) {
        event.preventDefault();
        return false;
    }
    return true;
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        // Check if the corresponding error element exists before hiding it
        let errorElement = document.getElementById(input.id + "-error");
        if (errorElement) {
            errorElement.style.display = "none";
        }

        // Hide the server-side error message if it exists
        let serverError = document.getElementById("server-error");
        if (serverError) {
            serverError.style.display = "none";
        }
    });
});
