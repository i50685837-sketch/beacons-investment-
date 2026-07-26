// HAMBURGER
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
hamburger.onclick = () => {sidebar.classList.toggle('open'); overlay.classList.toggle('show');}
overlay.onclick = () => {sidebar.classList.remove('open'); overlay.classList.remove('show');}

// LOAD USER DATA
function loadProfile(){
  // Sasa tunasoma kutoka localStorage. Kama hakuna inabaki blank
  const user = {
    name: localStorage.getItem('beaconName') || 'Guest User',
    phone: localStorage.getItem('beaconPhone') || 'Not Set',
    invested: parseInt(localStorage.getItem('beaconInvested')) || 0,
    earned: parseInt(localStorage.getItem('beaconEarned')) || 0,
    active: JSON.parse(localStorage.getItem('beaconActive')) || 0
  };

  document.getElementById('profileName').innerText = user.name;
  document.getElementById('profilePhone').innerText = user.phone;
  document.getElementById('avatar').innerText = user.name.charAt(0).toUpperCase();
  document.getElementById('fullName').value = user.name === 'Guest User' ? '' : user.name;
  document.getElementById('phone').value = user.phone === 'Not Set' ? '' : user.phone;
  document.getElementById('totalInvested').innerText = `Ksh ${user.invested.toLocaleString()}`;
  document.getElementById('totalEarned').innerText = `Ksh ${user.earned.toLocaleString()}`;
  document.getElementById('activePlans').innerText = user.active;
}

// SAVE PROFILE
document.getElementById('profileForm').onsubmit = (e) => {
  e.preventDefault();
  const newName = document.getElementById('fullName').value;
  const newPass = document.getElementById('newPassword').value;
  
  if(!newName){alert('Please enter your name'); return;}
  
  localStorage.setItem('beaconName', newName);
  
  if(newPass){
    localStorage.setItem('beaconPass', newPass);
  }
  
  document.getElementById('successMsg').innerText = 'Profile Updated Successfully!';
  document.getElementById('profileName').innerText = newName;
  document.getElementById('avatar').innerText = newName.charAt(0).toUpperCase();
  
  setTimeout(() => document.getElementById('successMsg').innerText = '', 3000);
}

loadProfile();
