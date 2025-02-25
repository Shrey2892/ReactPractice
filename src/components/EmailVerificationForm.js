// src/components/EmailValidationForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//import "../css/styles.css"

export const EmailValidationForm = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false); // To track if the request is in progress
  const navigate = useNavigate(); // Get navigate function

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!emailRegex.test(email)) {
      setIsValid(false);
      setError("Please enter a valid email address.");
    } else {
      setIsValid(true);
      setSending(true);
      try {
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          navigate("/verify-otp", { state: { email } });
        } else {
          setError("Failed to send email.");
        }
      } catch (err) {
        setError("Error sending email: " + err.message);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header text-center">
              <h4>Email Verification</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                  />
                </div>

                {error && <p className="text-danger">{error}</p>}

                {sending ? (
                  <button type="button" className="btn btn-primary btn-block mt-3" disabled>
                    Sending...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary btn-block mt-3">
                    Submit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailValidationForm;
