// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    user: { username: 'user', password: 'user123', role: 'user' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = Object.values(users).find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('role', user.role);
      setRole(user.role);

      if (user.role === 'admin') {
        navigate('/admin'); // Redirect to Admin page
      } else {
        navigate('/'); // Redirect to User page
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>PS Portal</h1>
          <h2>Hi, Welcome Back!</h2>
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
          <button className="submit" type="submit">Login</button>
          <div className="or">Or</div>
          <button className="google-sign-in" type="button">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" /> Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
