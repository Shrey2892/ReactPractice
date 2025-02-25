const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const corsOptions = {
  origin: 'http://localhost:3000', // React app URL
};



const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));
//app.use(cors()); // Allow frontend to access the backend

let otpstorage = {};

// Nodemailer Transporter Setup (Example: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: "nairshreya227@gmail.com", // Your email
    pass: "rrbv iyea hqim swvt",  // Your email password (use environment variables for security)
  },
});


const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
// Send email route
app.post("/send-email", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  otpstorage[email] = {otp, expiresAt:Date.now()+ 10 * 60 * 1000};

  const mailOptions = {
    from: "nairshreya227@gmail.com", // Your email
    to: email,
    subject: " React Demo Email Validation",
    text: `Hello,\n\nYour OTP Code is : ${otp}\n\nThis OTP is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email.");
    }
    res.status(200).send("Email sent successfully!");
  });
});

// /verify-otp route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  console.log(email);
  console.log(otp);

  // Check if OTP exists and is valid
  if (!otpstorage[email]) {
    return res.status(400).send("OTP not sent or expired.");
  }

  const storedOtp = otpstorage[email];
  console.log(storedOtp.otp);

  // Verify if OTP matches and is not expired
  if (storedOtp.otp === otp && Date.now() < storedOtp.expiresAt) {
    // OTP verified successfully
    delete otpstorage[email]; // Clear OTP after verification
    return res.status(200).send("OTP verified successfully!");
  } else {
    return res.status(400).send("Invalid or expired OTP.");
  }
});


let users = []; // This will act as our "database" for now.



// Register route
app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ status:0,message: 'Passwords do not match' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(200).json({ status:0,message: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  // Send success response
  res.status(200).json({ status:1,message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ status:0,message: 'Invalid credentials' });
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ status:0,message: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ email: user.email }, 'secretKey', { expiresIn: '1h' });

  // Send success response
  res.status(200).json({status:1, message: 'Login successful', token });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
