const API_URL = "http://localhost:3000/api/auth/register";


document.getElementById("registerForm").addEventListener("submit", async (e)=>{

    e.preventDefault();


    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;


    const button = document.querySelector("button");

    button.innerText = "Creating account...";
    button.disabled = true;



    try{


        const response = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                fullname,
                email,
                phone,
                password

            })

        });



        const data = await response.json();



        if(!response.ok){

            alert(data.message || "Registration failed");

            button.innerText="Register";
            button.disabled=false;

            return;

        }




        // Save login session if backend returns token

        if(data.token){

            localStorage.setItem(
                "token",
                data.token
            );

        }



        if(data.user){

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

        }



        alert("Account created successfully ❤️");


        window.location.href="dashboard.html";




    }catch(error){


        console.log(error);


        alert(
            "Server connection failed. Check server.js."
        );


        button.innerText="Register";
        button.disabled=false;

    }


});
