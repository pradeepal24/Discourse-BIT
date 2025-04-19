import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import AdminPage from './components/Admin/AdminPage';

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  return (
    <div className="App">
      <Routes>
        {/* Route for login */}
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route
          path="/admin"
          element={role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
