const currentUser = JSON.parse(localStorage.getItem('beaconUser'));

if(!currentUser){
  alert('Please login first');
  window.location = 'login.html';
}

let BALANCE = currentUser.balance;
let investments = []; // Baadaye tutasave kwa server pia

document.getElementById('balance').innerText = `Ksh ${BALANCE.toLocaleString()}`;

// CONFIG
let BALANCE = 0; // Real balance starts at 0
const MIN_INVEST = 750;
const MAX_INVEST = 20000;
const PROFIT_RATE = 0.28; // 28% every 3 hours
let investments = [];

// DOM ELEMENTS
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const investBtn = document.getElementById('investBtn');
const investModal = document.getElementById('investModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const amountInput = document.getElementById('amountInput');
const errorMsg = document.getElementById('errorMsg');
const balanceEl = document.getElementById('balance');
const historyBody = document.getElementById('historyBody');

// 1. HAMBURGER TOGGLE
hamburger.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

function toggleSidebar(){
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

// 2. GENERATE INVESTMENT TABLE
function loadPlans(){
  const amounts = [750, 950, 1500, 3000, 5000, 7500, 10000, 15000, 20000];
  const tbody = document.querySelector('#plansTable tbody');
  
  amounts.forEach(amount => {
    const profit3hr = Math.round(amount * PROFIT_RATE);
    const totalReturn = amount + (profit3hr * 8); // 8 cycles in 24hrs
    
    tbody.innerHTML += `
      <tr>
        <td>Ksh ${amount.toLocaleString()}</td>
        <td>24 Hours</td>
        <td class="profit">Ksh ${profit3hr.toLocaleString()}</td>
        <td class="profit">Ksh ${totalReturn.toLocaleString()}</td>
      </tr>
    `;
  });
}

// 3. MODAL FUNCTIONS
investBtn.addEventListener('click', () => investModal.style.display = 'flex');
cancelBtn.addEventListener('click', closeModal);

function closeModal(){
  investModal.style.display = 'none';
  errorMsg.innerText = '';
  amountInput.value = '';
}

// 4. CONFIRM INVESTMENT
confirmBtn.addEventListener('click', () => {
  const amount = parseInt(amountInput.value);
  
  if(!amount || amount < MIN_INVEST){
    errorMsg.innerText = `Minimum investment is Ksh ${MIN_INVEST}`;
    return;
  }
  if(amount > MAX_INVEST){
    errorMsg.innerText = `Maximum investment is Ksh ${MAX_INVEST}`;
    return;
  }
  if(amount > BALANCE){
    errorMsg.innerText = 'Insufficient Balance. Please Deposit First';
    return;
  }
  
  // Deduct balance
  BALANCE -= amount;
  updateBalance();
  
  // Add to history
  const profit3hr = Math.round(amount * PROFIT_RATE);
  const newInvestment = {
    amount: amount,
    profit3hr: profit3hr,
    startDate: new Date().toLocaleString(),
    nextPayout: new Date(Date.now() + 3*60*60*1000).toLocaleTimeString()
  };
  
  investments.unshift(newInvestment); // add to top
  updateHistory();
  
  alert(`Investment Successful!\nAmount: Ksh ${amount.toLocaleString()}\nProfit Every 3Hrs: Ksh ${profit3hr.toLocaleString()}`);
  closeModal();
});

// 5. UPDATE UI FUNCTIONS
function updateBalance(){
  balanceEl.innerText = `Ksh ${BALANCE.toLocaleString()}`;
}

function updateHistory(){
  if(investments.length === 0){
    historyBody.innerHTML = `<tr><td colspan="5" class="empty">No active investments yet</td></tr>`;
    return;
  }
  
  historyBody.innerHTML = '';
  investments.forEach(inv => {
    historyBody.innerHTML += `
      <tr>
        <td>Ksh ${inv.amount.toLocaleString()}</td>
        <td>${inv.startDate}</td>
        <td>${inv.nextPayout}</td>
        <td class="profit">Ksh ${inv.profit3hr.toLocaleString()}</td>
        <td><span class="status active">Active</span></td>
      </tr>
    `;
  });
}

// INIT
loadPlans();
updateBalance();
