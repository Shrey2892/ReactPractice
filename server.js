const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const connectDB = require("backend/db"); // Import the MongoDB connection function
const Users = require("./models/userModel"); // Import the User model
const dotenv = require('dotenv');
const connectDB = require('./backend/db');  // Import the MongoDB connection function

dotenv.config();  // Load environment variables



const corsOptions = {
  origin: 'http://localhost:3000', // React app URL
};



const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));


//const dbiUrl = "mongodb://localhost:27017/ReactDemo";
//app.use(cors()); // Allow frontend to access the backend

connectDB();

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



app.post("/register", async (req, res) => {
  const { email, password , confirmPassword} = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ status:0,message:'Passwords do not match'});
  }
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status:0, message: "User already exists" });
    }


    const newUser = new Users({ email, password });
    await newUser.save();
    res.status(200).json({ status:1,message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ status:0,message: "Error registering user" });
    console.log(err);
  }
});



// Login route
app.post('/logins', async (req, res) => {
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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await Users.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
