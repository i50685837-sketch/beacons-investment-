const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/register
router.post('/register', (req, res) => {
  const {name, phone, password} = req.body;
  
  if(User.findByPhone(phone)){
    return res.status(400).json({message: 'Phone already registered'});
  }
  
  const user = User.create({name, phone, password});
  res.json({message: 'Account created', user});
});

// @route   POST /api/login
router.post('/login', (req, res) => {
  const {phone, password} = req.body;
  const user = User.findByPhone(phone);
  
  if(!user || user.password !== password){
    return res.status(400).json({message: 'Invalid phone or password'});
  }
  
  res.json({message: 'Login successful', user});
});

module.exports = router;
