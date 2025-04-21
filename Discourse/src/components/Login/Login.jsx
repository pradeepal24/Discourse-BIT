import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import image from '../../assets/image.png'

const Login = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const { role } = response.data;

      // Save role and update state
      localStorage.setItem('role', role);
      setRole(role);

      // Redirect based on role
      if (role === 'admin') {
        navigate('/drawer');
      } else if (role === 'faculty') {
        navigate('/drawer');
      } else if (role === 'student') {
        navigate('/drawer');
      } else {
        navigate('/not-authorized'); 
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="wrapper">

      <div>
        <img src={image} alt="bit logo" style={{width:200,height:200}}/>
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

          <button className="submit" type="submit">Login</button>
          <div className="or">Or</div>

          <button className="google-sign-in" type="button">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
