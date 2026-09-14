const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SERVE STATIC FILES: This tells Express to serve your HTML/CSS/JS files from your C:\Web folder
app.use(express.static('C:\\Web')); 

// Database Pool
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'bosco_k9' 
});

pool.connect((err) => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to PostgreSQL Database (bosco_k9).');
});

// ROUTE: Marketplace Purchase API with M-Pesa STK Push Integration
app.post('/api/purchase', async (req, res) => {
    const { itemId, phone } = req.body;
    console.log(`[PURCHASE] Processing request for Item: ${itemId}, Phone: ${phone}`);

    // Format phone number to 2547XXXXXXXX
    let formattedPhone = phone.replace(/^0/, '254');

    try {
        // Updated Daraja Sandbox Credentials
        const consumerKey = '09BpAyzyAGOw2GFvza8UZ8q48QwlfSamFMRtdWMML6KPwlsf';
        const consumerSecret = '1F32Aom70KyUOrGxL3gvGobUrjUvmIYAGfykBFocmdRYQAaIwYQU80ifTF4VGEje';
        const shortCode = '174379'; // Sandbox default shortcode (Paybill/Till)
        const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey

        // Generate timestamp
        const date = new Date();
        const timestamp = date.getFullYear() +
            (("0" + (date.getMonth() + 1)).slice(-2)) +
            (("0" + date.getDate()).slice(-2)) +
            (("0" + date.getHours()).slice(-2)) +
            (("0" + date.getMinutes()).slice(-2)) +
            (("0" + date.getSeconds()).slice(-2));

        const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

        // Get OAuth Access Token from Safaricom
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        const accessToken = tokenResponse.data.access_token;

        // Initiate STK Push Request to Safaricom
        const stkResponse = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: 4500, // Deposit amount for Max
            PartyA: formattedPhone,
            PartyB: shortCode,
            PhoneNumber: formattedPhone,
            CallBackURL: 'https://frosty-colonist-conch.ngrok-free.dev/api/mpesa/callback', // Your active ngrok URL
            AccountReference: 'BoscoK9',
            TransactionDesc: 'Deposit for K9 Puppy'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        console.log("STK Push Success Response:", stkResponse.data);
        
        // Return success data back to the frontend
        res.status(200).json({ 
            success: true, 
            message: "STK push sent successfully!",
            checkoutRequestId: stkResponse.data.CheckoutRequestID
        });

    } catch (error) {
        console.error("M-Pesa STK Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: "Failed to connect to M-Pesa payment server." });
    }
});

// ROUTE: M-Pesa Callback
app.post('/api/mpesa/callback', (req, res) => {
    console.log("M-Pesa Callback received:", req.body);
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
});

app.listen(PORT, () => {
    console.log(`BoscoK9 Backend Server running smoothly on http://localhost:${PORT}`);
});