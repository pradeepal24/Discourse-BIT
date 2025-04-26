import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import image from "../../assets/image.png";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Login = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      const { name, role, faculty_id, subject, department } = response.data;

      // Store values in localStorage
      localStorage.setItem("username", name);
      localStorage.setItem("role", role);
      localStorage.setItem("faculty_id", faculty_id);
      localStorage.setItem("subject", subject);
      localStorage.setItem("department", department);

      setRole(role);

      if (role === "admin") {
        navigate("/drawer");
      } else if (role === "faculty") {
        navigate("/drawer");
      } else if (role === "student") {
        navigate("/drawer");
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  // Google success function
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded); // Shows: name, email, picture

    localStorage.setItem("username", decoded.name);
    localStorage.setItem("email", decoded.email); // Optional
    localStorage.setItem("picture", decoded.picture); // Optional
    localStorage.setItem("role", "student"); // Default role
    setRole("student");

    navigate("/drawer/sublist");
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    setError("Google Sign-In failed");
  };

  return (
    <div className="wrapper">
      <div>
        <img src={image} alt="bit logo" style={{ width: 200, height: 200 }} />
      </div>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1 className="Name">BIT DISCOURSE</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="input-box">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="submit" type="submit">
            Login
          </button>

          <div className="or">Or</div>

          <div className="google-sign-in-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              type="standard"
              theme="white"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="center"
              width="100%"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 