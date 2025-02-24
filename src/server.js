const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow frontend to access the backend

// Nodemailer Transporter Setup (Example: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: "your-email@gmail.com", // Your email
    pass: "your-email-password",  // Your email password (use environment variables for security)
  },
});

// Send email route
app.post("/send-email", (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: "nairshreya227@gmail.com", // Your email
    to: email,
    subject: "Email Validation Successful",
    text: `Hello,\n\nYour email (${email}) has been successfully validated!`,
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
