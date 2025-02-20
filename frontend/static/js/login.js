if (localStorage.getItem("access_token")) {
    const role = localStorage.getItem("role");
    if (role === "admin") {
        window.location.href = "/admin/dashboard";
    } else {
        window.location.href = "/dashboard";
    }
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const alertContainer = document.getElementById("alert-container");

    const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alertContainer.innerHTML = "";

    if (response.ok) {
        showAlert("success", data.message);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        setTimeout(() => {
            if (data.role === "admin") {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/dashboard";
            }
        }, 1000);

    } else {
        showAlert("danger", data.message);
        setTimeout(() => {
            alertContainer.innerHTML = "";
        }, 5000);
    }
});

document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
});


function showAlert(type, message) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.getElementById("alert-container").innerHTML = alertHTML;
}