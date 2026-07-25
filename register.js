// register.js

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.querySelector('input[name="fullname"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

    if (!fullname || !email || !phone || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Account created successfully!");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Registration failed.");
        }

    } catch (error) {
        alert("Unable to connect to the server.");
        console.error(error);
    }
});
