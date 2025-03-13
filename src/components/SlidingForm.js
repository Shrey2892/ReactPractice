import React, { useState } from "react";
import "../css/styles.css";
import { useNavigate } from "react-router-dom";

const SlidingForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register
  const [formData, setFormData] = useState({ //When on load the fields remain empty
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state
  const [responseMessage, setResponseMessage] = useState(""); // To store the API response message
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

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

    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";
    const bodyData = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

    // Make the fetch request
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      // Handle response
      const data = await response.json();

      if (!response.ok) {
        // Handle errors if any
        throw new Error(data.message || "Something went wrong");
      }

      setResponseMessage(data.message); // Store the response message

      // If the registration is successful and status is 1, navigate to the verify-email page
      if (!isLogin && data.status === 1) {
        navigate("/verify-email");
      }

    } catch (err) {
      setError(err.message || "Error occurred while processing the request.");
    } finally {
      setLoading(false); // Stop loading after request is completed
    }
  };

  // Clear response message when toggling between forms
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setResponseMessage(""); // Clear the response message on toggle
    
    setFormData({
      email: "",
      password: "",
      confirmPassword: "", // Reset confirmPassword as well, since it's only used in the register form
    });
  
    setError(""); // Clear any errors
  };
  

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
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
