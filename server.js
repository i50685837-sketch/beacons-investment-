const axios = require('axios');

app.post('/api/deposit', async (req, res) => {
  const {userId, phone, amount} = req.body;
  if(amount < 750) return res.json({success:false, message:'Min 750'});

  try{
    // 1. GET ACCESS TOKEN YA DARAJA
    const auth = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      auth: {username: '2qTxytQR4zYEOLpwocJfZAKwg99ekHAc55NkgRi9GdIDI3My', password: '3l1RbRLNvH9vRdGu16AVE3GXtPK7VJvhkeWuq8dmuB7HCsJxAJPlWPlifW9cif5q'}
    });
    const token = auth.data.access_token;

    // 2. SEND STK PUSH
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
    const password = Buffer.from('YOUR_SHORTCODE' + 'YOUR_PASSKEY' + timestamp).toString('base64');

    await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      "BusinessShortCode": "YOUR_SHORTCODE",
      "Password": password,
      "Timestamp": timestamp,
      "TransactionType": "CustomerPayBillOnline",
      "Amount": amount,
      "PartyA": phone.replace('0', '254'), // 07... to 2547...
      "PartyB": "YOUR_SHORTCODE",
      "PhoneNumber": phone.replace('0', '254'),
      "CallBackURL": "https://yourdomain.com/api/mpesa/callback",
      "AccountReference": "BEACONS",
      "TransactionDesc": "Beacons Deposit"
    }, {headers: {Authorization: `Bearer ${token}`}});

    res.json({success:true, message:'STK Sent'});

  }catch(err){
    res.json({success:false, message:'Failed to send STK'});
  }
});
