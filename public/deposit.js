const MIN_DEPOSIT = 750;
let checkInterval;

document.addEventListener('DOMContentLoaded', () => {
  loadDepositHistory();
  const user = JSON.parse(localStorage.getItem('user'));
  if(user && user.phone) document.getElementById('phone').value = user.phone;

  document.getElementById('depositForm').addEventListener('submit', handleDepositSubmit);
});

// HANDLE DEPOSIT FORM SUBMIT
async function handleDepositSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  const amount = parseInt(document.getElementById('amount').value);
  const errorEl = document.getElementById('depositError');
  const successEl = document.getElementById('depositSuccess');
  const btn = document.getElementById('depositBtn');
  const loader = document.getElementById('loader');
  errorEl.innerText = '';
  successEl.innerText = '';

  // VALIDATE INPUT
  if(!phone.match(/^0[17]\d{8}$/)){
    errorEl.innerText = 'Please enter a valid Safaricom or Airtel number';
    return;
  }
  if(amount < MIN_DEPOSIT){
    errorEl.innerText = `Minimum deposit amount is Ksh ${MIN_DEPOSIT}`;
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  if(!user){
    errorEl.innerText = 'Please login first';
    window.location.href = 'login.html';
    return;
  }

  btn.disabled = true;
  loader.style.display = 'block';
  btn.innerText = 'Sending STK Push...';

  try{
    // SEND STK PUSH REQUEST TO BACKEND
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userId: user.id, phone, amount})
    });
    const data = await res.json();

    if(data.success){
      successEl.innerText = `STK Push sent to ${phone}. Please enter your MPESA PIN`;
      saveDepositLocally(user.id, phone, amount, data.checkoutId);

      // START CHECKING PAYMENT STATUS EVERY 3 SECONDS
      checkInterval = setInterval(() => checkPaymentStatus(data.checkoutId, user.id, amount), 3000);

    } else {
      throw new Error(data.message || 'Failed to send STK Push');
    }
  }catch(err){
    errorEl.innerText = err.message;
    resetDepositButton();
  }
}

// CHECK PAYMENT STATUS
async function checkPaymentStatus(checkoutId, userId, amount){
  try{
    const res = await fetch('/api/deposit/status/' + checkoutId);
    const data = await res.json();

    if(data.status === 'Success'){
      clearInterval(checkInterval);
      document.getElementById('depositSuccess').innerText = `Success! Ksh ${amount.toLocaleString()} deposited to your account`;
      updateUserBalance(amount);
      updateDepositStatus(checkoutId, 'Success');
      loadDepositHistory();
      resetDepositButton();
    }

    if(data.status === 'Failed' || data.status === 'Cancelled'){
      clearInterval(checkInterval);
      document.getElementById('depositError').innerText = 'Payment failed or was cancelled';
      updateDepositStatus(checkoutId, 'Failed');
      loadDepositHistory();
      resetDepositButton();
    }
  }catch(err){
    console.log('Still checking payment status...');
  }
}

// RESET DEPOSIT BUTTON
function resetDepositButton(){
  document.getElementById('depositBtn').disabled = false;
  document.getElementById('loader').style.display = 'none';
  document.getElementById('depositBtn').innerText = 'Deposit Now';
}

// UPDATE USER BALANCE IN LOCALSTORAGE
function updateUserBalance(amount){
  let user = JSON.parse(localStorage.getItem('user'));
  user.balance += amount;
  localStorage.setItem('user', JSON.stringify(user));

  // UPDATE BALANCE ON PAGE IF IT EXISTS
  const balanceEl = document.getElementById('balance');
  if(balanceEl){
    balanceEl.innerText = `Ksh ${user.balance.toLocaleString()}`;
  }
}

// SAVE DEPOSIT TO LOCALSTORAGE
function saveDepositLocally(userId, phone, amount, checkoutId){
  let deposits = JSON.parse(localStorage.getItem('deposits')) || [];
  deposits.push({
    checkoutId,
    userId,
    phone,
    amount,
    status: 'Pending',
    date: new Date().toISOString()
  });
  localStorage.setItem('deposits', JSON.stringify(deposits));
  loadDepositHistory();
}

// UPDATE DEPOSIT STATUS IN LOCALSTORAGE
function updateDepositStatus(checkoutId, status){
  let deposits = JSON.parse(localStorage.getItem('deposits')) || [];
  let deposit = deposits.find(d => d.checkoutId === checkoutId);
  if(deposit) deposit.status = status;
  localStorage.setItem('deposits', JSON.stringify(deposits));
}

// LOAD DEPOSIT HISTORY
async function loadDepositHistory(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user) return;

  const tbody = document.getElementById('depositHistory');
  tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">Loading transactions...</td></tr>`;

  try{
    // TRY TO GET FROM API FIRST
    const res = await fetch('/api/deposits/' + user.id);
    const deposits = await res.json();
    renderDepositHistory(deposits);
  }catch(err){
    // FALLBACK TO LOCALSTORAGE
    let deposits = JSON.parse(localStorage.getItem('deposits')) || [];
    deposits = deposits.filter(d => d.userId === user.id).reverse().slice(0, 10);
    renderDepositHistory(deposits);
  }
}

function renderDepositHistory(deposits){
  const tbody = document.getElementById('depositHistory');
  if(deposits.length === 0){
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">No deposit transactions yet</td></tr>`;
    return;
  }
  tbody.innerHTML = deposits.map(d => `
    <tr>
      <td>${new Date(d.date).toLocaleString()}</td>
      <td>${d.phone}</td>
      <td style="color:var(--green)">+Ksh ${d.amount.toLocaleString()}</td>
      <td><span class="badge ${d.status.toLowerCase()}">${d.status}</span></td>
    </tr>
  `).join('');
        }
