// src/components/OtpVerification.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/adminlte.min.css";

import "../css/adminlte.min.css";
import "../css/adminlte.min.css.map";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";



export const OtpVerification = () => {
    const location = useLocation();
    //const [otp, setOtp] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { email } = location.state || {};

    //   const handleOtpChange = (e) => {
    //     setOtp(e.target.value);
    //   };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        // If the entered value is a number and length is 1, update the OTP array
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input box
            if (index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (otp.length !== 6 || isNaN(otp)) {
    //         setError("Please enter a valid 6-digit OTP.");
    //         return;
    //     }

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        //const otpString = otp.join(""); // Combine the OTP array into a string

        const otpString = parseInt(otp.join(""), 10);
      
        if (otpString.toString().length !== 6 || isNaN(otpString)) {
          setError("Please enter a valid 6-digit OTP.");
          return;
        }

        try {
            const response = await fetch("http://localhost:5000/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp:otpString }),
            });

            if (response.ok) {
                setSuccessMessage("OTP verified successfully!");
            } else {
                setError("Invalid OTP, please try again.");
            }
        } catch (err) {
            setError("Error verifying OTP: " + err.message);
            console.log(err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-header text-center">
                            <h4>OTP Verification</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="otp">Enter OTP:</label>
                                    {/* <input
                    type="text"
                    id="otp"
                    className="form-control"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  /> */}
                                    <div className="d-flex justify-content-between">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                id={`otp-input-${index}`}
                                                className="form-control otp-box"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                maxLength="1"
                                                autoFocus={index === 0} // Auto-focus the first input
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && <p className="text-danger">{error}</p>}
                                {successMessage && <p className="text-success">{successMessage}</p>}

                                <button type="submit" className="btn btn-primary btn-block mt-3">
                                    Verify OTP
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
