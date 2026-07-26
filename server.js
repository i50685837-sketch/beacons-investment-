const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'users.json';

// Read users
function getUsers(){
  if(!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save users
function saveUsers(users){
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// REGISTER
app.post('/register', (req, res) => {
  const {name, phone, password} = req.body;
  let users = getUsers();
  
  if(users.find(u => u.phone === phone)){
    return res.status(400).json({message: 'Phone already registered'});
  }
  
  const newUser = {
    id: Date.now(),
    name, phone, password, // In real app we hash password
    balance: 0,
    invested: 0,
    earned: 0,
    active: 0
  };
  
  users.push(newUser);
  saveUsers(users);
  res.json({message: 'Account created', user: newUser});
});

// LOGIN
app.post('/login', (req, res) => {
  const {phone, password} = req.body;
  let users = getUsers();
  
  const user = users.find(u => u.phone === phone && u.password === password);
  if(!user){
    return res.status(400).json({message: 'Invalid phone or password'});
  }
  
  res.json({message: 'Login successful', user});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
