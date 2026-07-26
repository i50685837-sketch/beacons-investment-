const API_URL = 'http://localhost:3000'; // Server yetu

// REGISTER
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, phone, password})
    });
    
    const data = await res.json();
    if(res.ok){
      localStorage.setItem('beaconUser', JSON.stringify(data.user));
      window.location = 'dashboard.html';
    } else {
      errorMsg.innerText = data.message;
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

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
  });
}
