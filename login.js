// login.js

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Login successful!");

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Invalid email or password.");
        }

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
});
