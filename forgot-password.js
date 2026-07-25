// forgot-password.js

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value.trim();

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    try {
        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            alert("Password reset link sent to your email.");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Unable to send reset link.");
        }

    } catch (error) {
        console.error(error);
        alert("Server connection failed. Please try again later.");
    }
});
