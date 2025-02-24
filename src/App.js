
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import $ from "jquery"; // ✅ Import jQuery

import "./css/adminlte.min.css";
import "./css/adminlte.min.css.map";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "jquery/dist/jquery.min.js"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";
import "./css/theme.css";

import  { useState } from "react";







const EmailValidationForm = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false); // To track if the request is in progress

  

  // Regular expression to check for a valid email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Validate email on submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setSuccessMessage("");
    setError("");

    // Check if email matches the regex
    if (!emailRegex.test(email)) {
      setIsValid(false);
      setError("Please enter a valid email address.");
    } else {
      setIsValid(true);
      setError("");
      setSending(true);

      // Call the backend to send an email
      try {
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSuccessMessage("Email sent successfully!");
        } else {
          setError("Failed to send email.");
        }
      } catch (err) {
        setError("Error sending email: " + err.message);
      } finally {
        setSending(false); // Stop the loading indicator
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header text-center">
              <h4>Email Validation</h4>
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

                {/* Show error message */}
                {!isValid && <p className="text-danger">{error}</p>}

                {/* Show success message */}
                {successMessage && <p className="text-success">{successMessage}</p>}

                {/* Show loading state */}
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







const App = () => {
  useEffect(() => {
    // ✅ Ensure sidebar is collapsed on load
    $("body").addClass("sidebar-mini layout-fixed sidebar-collapse");

    // ✅ Enable sidebar toggle
    $("[data-widget='pushmenu']").on("click", function () {
      $("body").toggleClass("sidebar-collapse");
    });



    return () => {
      // ✅ Cleanup event listener when component unmounts
      $("[data-widget='pushmenu']").off("click");
    };
  }, []);

  return (
    <div className="wrapper">
      {/* ✅ Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            {/* ✅ Use button for better accessibility */}
            <button className="nav-link" data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </button>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
      </nav>

      {/* ✅ Sidebar (Now Black) */}
      <aside className="main-sidebar sidebar-dark-primary elevation-2">
        <Link to="/" className="brand-link">
          <span className="brand-text font-weight-light">AdminLTE React</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>Dashboard</p>
                </Link>
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-user"></i>
                  <p>Profile</p>
                </Link>

              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* ✅ Content Wrapper */}

       {/* Email validation example */}
      {<div className="content-wrapper">
        <EmailValidationForm />
      </div>}

      



      {/* ✅ Footer */}
      <footer className="main-footer">
        <strong>Copyright &copy; 2025.</strong> All rights reserved.
      </footer>
    </div>
  );
};



export default App;



