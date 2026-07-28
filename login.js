const API_URL = "http://localhost:3000/api/auth/login";


document.getElementById("loginForm").addEventListener("submit", async (e)=>{

    e.preventDefault();


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const button = document.querySelector("button");
    button.innerText = "Logging in...";
    button.disabled = true;


    try {


        const response = await fetch(API_URL, {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                password

            })

        });



        const data = await response.json();



        if(!response.ok){

            alert(data.message || "Login failed");

            button.innerText="Login";
            button.disabled=false;

            return;

        }



        // Save authentication

        localStorage.setItem(
            "token",
            data.token
        );


        // Save user data

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );



        alert("Login successful ❤️");


        window.location.href="dashboard.html";



    } catch(error){


        console.log(error);


        alert(
            "Server connection failed. Check if server.js is running."
        );


        button.innerText="Login";
        button.disabled=false;

    }


});
