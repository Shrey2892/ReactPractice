
import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import "../css/styles.css"; // Make sure to create a corresponding CSS file for styling

const SlidingForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state
  const [responseMessage, setResponseMessage] = useState(""); // To store the API response message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Make sure to mark handleSubmit as async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state before making a request
    setResponseMessage(""); // Clear previous response message

    if (isLogin) {
      // Login
      try {
        const response = await axios.post("http://localhost:5000/login", {
          email: formData.email,
          password: formData.password,
        });
        setResponseMessage(response.data.message); // Store the response message
      } catch (err) {
        setError(err.response ? err.response.data.message : "Error logging in.");
      }
    } else {
      // Register
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
      } else {
        try {
          const response = await axios.post("http://localhost:5000/register", {
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
          setResponseMessage(response.data.message); // Store the response message
        } catch (err) {
          setError(err.response ? err.response.data.message : "Error registering.");
        }
      }
    }
    setLoading(false); // Stop loading after request is completed
  };

  // Clear response message when toggling between forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setResponseMessage(""); // Clear the response message on toggle
  };

  return (
    <div className="main-form">
      <div className="form-container">
        <div className={`form-box ${isLogin ? "login" : "register"}`}>
          {/* Login Form */}
          {isLogin ? (
            <div className="form-content">
              <h2>Login</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {error && <p className="error">{error}</p>} {/* Show error message if any */}
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p>
                Don't have an account?{" "}
                <span className="toggle-btn" onClick={toggleForm}>
                  Register
                </span>
              </p>
              {responseMessage && <p className="response">{responseMessage}</p>} {/* Display API response */}
            </div>
          ) : (
            // Register Form
            <div className="form-content">
              <h2>Register</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                {error && <p className="error">{error}</p>} {/* Show error message if any */}
                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span className="toggle-btn" onClick={toggleForm}>
                  Login
                </span>
              </p>
              {responseMessage && <p className="response">{responseMessage}</p>} {/* Display API response */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidingForm;

