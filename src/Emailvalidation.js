import React, { useState } from "react";

const EmailValidationForm = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");

  // Regular expression to check for a valid email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Validate email on submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if email matches the regex
    if (!emailRegex.test(email)) {
      setIsValid(false);
      setError("Please enter a valid email address.");
    } else {
      setIsValid(true);
      setError("");
      // You can proceed with form submission logic here
      console.log("Form submitted with email:", email);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
        </div>

        {!isValid && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EmailValidationForm;
