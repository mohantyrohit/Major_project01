import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [signupType, setSignupType] = useState(null); // Determines if it's student or institute
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instituteId, setInstituteId] = useState(""); // Only relevant for institutes
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: "url('/images/Signup.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
  };

  // Function to handle student signup
  const handleStudentSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("https://major-project01-1ukh.onrender.com/api/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful:", data);
        navigate("/login"); // Redirect to login after successful signup
      } else {
        setError(data.message || "Signup failed. Please try again.");
        console.error("Signup failed:", data.message);
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error("Error during signup:", err);
    }
  };

  // Function to handle institute signup
  const handleInstituteSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("https://major-project01-1ukh.onrender.com/api/institute/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          instituteId,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Institute signup successful:", data);
        navigate("/login"); // Redirect to login after successful signup
      } else {
        setError(data.message || "Signup failed. Please try again.");
        console.error("Signup failed:", data.message);
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error("Error during signup:", err);
    }
  };

  return (
    <div style={backgroundStyle}>
      <h2>{signupType ? `Sign Up as ${signupType === "student" ? "Student" : "Institute"}` : "Create an Account"}</h2>

      {!signupType ? (
        // Show options to select signup type
        <div className="signup-options-container">
          <div className="signup-option-box" onClick={() => setSignupType("student")}>
            <img src="/logo/student.png" alt="Student Logo" className="signup-logo" />
            <button className="signup-option">Sign Up as Student</button>
          </div>

          <div className="signup-option-box" onClick={() => setSignupType("institute")}>
            <img src="/logo/institute.jpg" alt="Institute Logo" className="signup-logo" />
            <button className="signup-option">Sign Up as Institute</button>
          </div>
        </div>
      ) : (
        // Show the signup form based on signup type
        <form
          className="signup-form"
          onSubmit={signupType === "student" ? handleStudentSignup : handleInstituteSignup}
        >
          {signupType === "student" ? (
            <>
              <label>Full Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <label>Institute Name:</label>
              <input
                type="text"
                placeholder="Enter institute name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>Institute ID:</label>
              <input
                type="text"
                placeholder="Enter institute ID"
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                required
              />
            </>
          )}
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button className="signup-btn" type="submit">Sign Up</button>
          <button className="back-btn" onClick={() => setSignupType(null)}>Back</button>
          <p className="already-account">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Signup;
