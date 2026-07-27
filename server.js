const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express(); // <-- hii ilikuwa inakosa
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // serve html files

// DARAJA CREDENTIALS - CHANGE THESE
const CONSUMER_KEY = '2qTxytQR4zYEOLpwocJfZAKwg99ekHAc55NkgRi9GdIDI3My';
const CONSUMER_SECRET = '3l1RbRLNvH9vRdGu16AVE3GXtPK7VJvhkeWuq8dmuB7HCsJxAJPlWPlifW9cif5q';
const SHORTCODE = '174379'; // weka your till/paybill hapa
const PASSKEY = 'YOUR_PASSKEY'; // weka your passkey from Daraja portal

// DEPOSIT API
app.post('/api/deposit', async (req, res) => {
  const {userId, phone, amount} = req.body;
  if(amount < 750) return res.json({success:false, message:'Min 750'});

  try{
    // 1. GET ACCESS TOKEN YA DARAJA
    const auth = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      auth: {username: CONSUMER_KEY, password: CONSUMER_SECRET}
    });
    const token = auth.data.access_token;

    // 2. SEND STK PUSH
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
    const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString('base64');

    const stkResponse = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      "BusinessShortCode": SHORTCODE,
      "Password": password,
      "Timestamp": timestamp,
      "TransactionType": "CustomerPayBillOnline",
      "Amount": amount,
      "PartyA": phone.replace('0', '254'), // 07... to 2547...
      "PartyB": SHORTCODE,
      "PhoneNumber": phone.replace('0', '254'),
      "CallBackURL": "https://yourdomain.com/api/mpesa/callback", // change to your domain later
      "AccountReference": "BEACONS",
      "TransactionDesc": "Beacons Deposit"
    }, {headers: {Authorization: `Bearer ${token}`}});

    res.json({success:true, checkoutId: stkResponse.data.CheckoutRequestID, message:'STK Sent'});

  }catch(err){
    console.log(err.response?.data);
    res.json({success:false, message:'Failed to send STK'});
  }
});

// SERVE PAGES
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// START SERVER
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
