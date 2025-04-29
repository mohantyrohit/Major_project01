import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/AuthContext";
import { setAccessToken } from "../axios";
import "./Login.css";

const Login = () => {
  const [loginType, setLoginType] = useState(null);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.identifier || !formData.password) {
      setError(
        `${loginType === "student" ? "Email" : "Institute ID"} and password are required.`
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${loginType}/login`,
        {
          [loginType === "student" ? "email" : "instituteId"]: formData.identifier,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user;

        // ✅ Store access token in memory
        setAccessToken(token);

        // ✅ Store token in sessionStorage based on loginType
        if (loginType === "student") {
          sessionStorage.setItem("studentToken", token);
        } else {
          sessionStorage.setItem("instituteToken", token);
        }

        sessionStorage.setItem("loginType", loginType);

        // ✅ Save user to context
        login(
          {
            ...user,
            signupType: response.data.signupType || loginType,
            name: user.name,
            instituteName: user.name,
          },
          token
        );

        // ✅ Redirect user based on login type
        if (loginType === "student") {
          navigate("/Welcome", { state: { userName: user.name } });
        } else {
          navigate("/WelcomeInstitute", {
            state: {
              welcomeMessage: response.data.message,
              instituteName: user.name,
              signupType: "institute",
            },
          });
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <h2>Login</h2>
        {!loginType ? (
          <div className="login-options-container">
            <div
              className="login-option-box"
              onClick={() => setLoginType("student")}
            >
              <img
                src="/logo/student.png"
                alt="Student Logo"
                className="login-logo"
              />
              <button className="login-option">Login as Student</button>
            </div>
            <div
              className="login-option-box"
              onClick={() => setLoginType("institute")}
            >
              <img
                src="/logo/institute.jpg"
                alt="Institute Logo"
                className="login-logo"
              />
              <button className="login-option">Login as Institute</button>
            </div>
          </div>
        ) : (
          <>
            <label>
              {loginType === "student" ? "Email:" : "Institute ID:"}
            </label>
            <input
              type="text"
              name="identifier"
              placeholder={`Enter ${
                loginType === "student" ? "Email" : "Institute ID"
              }`}
              value={formData.identifier}
              onChange={handleInputChange}
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {error && <p className="error-message">{error}</p>}
            <button
              className="submit-btn"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button className="back-btn" onClick={() => setLoginType(null)}>
              Back
            </button>
          </>
        )}
        <p className="create-account">
          Don't have an account? <a href="/signup">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
