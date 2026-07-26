const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// HII LINE NI MUHIMU - INASERVE HTML, CSS, JS ZAKO ZOTE
app.use(express.static(__dirname)); 

const DB_FILE = 'users.json';
function getUsers(){ if(!fs.existsSync(DB_FILE)) return []; return JSON.parse(fs.readFileSync(DB_FILE)); }
function saveUsers(users){ fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2)); }

app.post('/register', (req, res) => {
  const {name, phone, password} = req.body;
  let users = getUsers();
  if(users.find(u => u.phone === phone)){ return res.status(400).json({message: 'Phone already registered'}); }
  const newUser = {id: Date.now(), name, phone, password, balance: 0, invested: 0, earned: 0, active: 0};
  users.push(newUser); saveUsers(users);
  res.json({message: 'Account created', user: newUser});
});

app.post('/login', (req, res) => {
  const {phone, password} = req.body;
  let users = getUsers();
  const user = users.find(u => u.phone === phone && u.password === password);
  if(!user){ return res.status(400).json({message: 'Invalid phone or password'}); }
  res.json({message: 'Login successful', user});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
