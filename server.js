const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const corsOptions = {
  origin: 'http://localhost:3000', // React app URL
};



const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));
//app.use(cors()); // Allow frontend to access the backend

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

  const mailOptions = {
    from: "nairshreya227@gmail.com", // Your email
    to: email,
    subject: "Email Validation Successful",
    text: `Hello,\n\nYour OTP Code is : ${otp}\n\nThis OTP is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email.");
    }
    res.status(200).send("Email sent successfully!");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
