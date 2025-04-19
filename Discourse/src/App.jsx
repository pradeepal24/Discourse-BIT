// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';  // Correct path for Login component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />  {/* Define route for Login */}
        {/* Add other routes for your app here */}
      </Routes>
    </div>
  );
}

export default App;
