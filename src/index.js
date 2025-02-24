// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom/client";
// import "./css/theme.css";

// import "admin-lte/dist/css/adminlte.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// // Import FontAwesome for icons
// import "@fortawesome/fontawesome-free/css/all.min.css";

// import App from "./App";

// // 1️⃣ BASIC COMPONENT (Arrow Function)
// const BasicComponent = () => <h1>Hello, Developer!</h1>;
// const BasicIntro = () => <h2>Just Started Learning React?</h2>;

// // 2️⃣ STATE & EVENT HANDLING (Destructuring + Arrow Functions)
// //Example of Destructuring bcoz in this useState() returns an array with 2 values: count(current state value) and setCount( function to update state), instead of using : const count = stateArray[0]; and const setCount = stateArray[1];
// const CounterExample = () => {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <h2>Counter: {count}</h2>
//       <button onClick={() => setCount((prev) => prev + 1)}>+</button>
//       <button onClick={() => setCount((prev) => prev - 1)}>-</button>
//     </div>
//   );
// };


// // 3️⃣ FORM HANDLING (Template Literals)
// const FormExample = () => {
//   const [name, setName] = useState("");

//   return (
//     <div>
//       <h2>Enter Your Name:</h2>
//       <input type="text" onChange={(e) => setName(e.target.value)} />
//       {/* Example of template Literals. */}
//       <p>{`Hello, ${name || "Guest"}!`}</p> 
//     </div>
//   );
// };

// const Form2Example = () => {
//     const [age, setAge] = useState ("");

//     return (
//         <div>
//             <h3>Enter Your Age:</h3>
//             <input type="number" onChange={(e) => setAge(e.target.value)} />
//             <p>{`Age: ${age}`}</p>
//         </div>
//     );
// };

// // 4️⃣ USEEFFECT HOOK (ASYNC UPDATE)
// //useState: Manages the data state and useEffect:Handles side effects  (updating data after 2 seconds)
// const UseEffectExample = () => {
//   const [data, setData] = useState("Loading..."); //This initializes a state variable (data) with "Loading...". and setData is a function that updates data when called

//   useEffect(() => {
//     setTimeout(() => {
//       setData("Data Loaded!");
//     }, 2000);
//   }, []);

//   return <h2>{data}</h2>;
// };

// // 5️⃣ MAIN APP COMPONENT
// const App = () => (
//   <div style={{ textAlign: "center", marginTop: "50px" }}>
//     <BasicComponent />
//     <BasicIntro />
//     <CounterExample />
//     <FormExample />
//     <Form2Example />
//     <UseEffectExample />
//   </div>
// );




// // 6️⃣ RENDER REACT APP
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);




import React,{useState} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import React Router
// import "./css/theme.css";

import "admin-lte/dist/css/adminlte.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "jquery/dist/jquery.min.js";
import "admin-lte/dist/js/adminlte.min.js"; // ✅ Import jQuery
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Import Bootstrap JS

import App from "./App"; // ✅ Import the App component

import $ from "jquery";
window.$ = window.jQuery = $;


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



// ✅ Wrap App inside BrowserRouter for routing support
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);



