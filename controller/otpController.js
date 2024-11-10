let otpStore = {}; // A simple in-memory store for OTPs (for production, use a database)

// Route to generate OTP
module.exports.sendOtpSMS =  (req, res) => {
    try {
 const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  otpStore[phoneNumber] = otp;
  // Send OTP to user's mobile phone here, e.g., via Twilio
  sendOtpSMS(phoneNumber, otp);

  res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        return res.status(500).josn({
            message:error.message
        })
    }
  
};

// Route to verify OTP
module.exports.verifyOtp =  (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
  
        if (otpStore[phoneNumber] == otp) {
          delete otpStore[phoneNumber]; // Clear OTP after successful verification
          res.status(200).json({ message: 'OTP verified successfully' });
        } else {
          res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
   
  }


  // Function to send SMS
const sendOtpSMS = (phoneNumber, otp) => {
    // Twilio example (replace with your SMS provider's code)
    const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      })
      .then(message => console.log(`OTP sent: ${message.sid}`))
      .catch(error => console.error(error));
  };