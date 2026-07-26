const API_URL = 'http://localhost:3000'; // Kama uko kwa render weka link hapo

// REGISTER
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerText = '';

    if(password.length < 6){
      errorMsg.innerText = 'Password must be at least 6 characters';
      return;
    }

    try{
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, phone, password})
      });
      
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('beaconUser', JSON.stringify(data.user));
        alert('Account created successfully!');
        window.location = 'dashboard.html';
      } else {
        errorMsg.innerText = data.message;
      }
    }catch(err){
      errorMsg.innerText = 'Server not running. Start node server.js';
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerText = '';

    try{
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phone, password})
      });
      
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('beaconUser', JSON.stringify(data.user));
        window.location = 'dashboard.html';
      } else {
        errorMsg.innerText = data.message;
      }
    }catch(err){
      errorMsg.innerText = 'Server not running. Start node server.js';
    }
  });
}

// LOGOUT FUNCTION - weka kwa dashboard.js
function logout(){
  localStorage.removeItem('beaconUser');
  window.location = 'login.html';
}
