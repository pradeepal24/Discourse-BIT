import React from 'react'
import { useNavigate } from 'react-router-dom';

function StudentPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('role');
      navigate('/'); 
    };
  
    return (
      <div>
        <h1>student Page</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
}

export default StudentPage