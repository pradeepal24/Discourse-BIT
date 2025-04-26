import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();





  const [faculty, setFaculty] = useState({
    username: '',
    password: '',
    subject: '',
    role: '',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingEdit = JSON.parse(localStorage.getItem('editFaculty'));
    if (existingEdit) {
      setFaculty(existingEdit);
    }

    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.backgroundColor = '';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFaculty(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    // e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    const existingList = JSON.parse(localStorage.getItem('facultyList')) || [];
    const editing = JSON.parse(localStorage.getItem('editFaculty'));

    let updatedList;
    if (editing) {
      updatedList = existingList.map(item =>
        item.name === editing.name ? faculty : item
      );
      localStorage.removeItem('editFaculty');
    } else {
      updatedList = [...existingList, faculty];
    }

    axios.post('http://localhost:5000/addusers',faculty)
    .then(res => {})
    .catch(err=>console.log(err,'error while Admin adding users'))

    localStorage.setItem('facultyList', JSON.stringify(updatedList));

    console.log('Faculty Saved:', faculty);
    setFaculty({ username: '', password: '', subject: '', role: '', department: '' });
    setIsSubmitting(false);
  
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div
        className="card border-0 rounded-4"
        style={{
          width: '100%',
          maxWidth: '950px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
        }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Faculty"
              style={{ width: '100px', height: '100px' }}
            />
            <p className="mt-3 fs-5 fw-bold text-primary">
              <i className="bi bi-person-lines-fill me-2"></i>
              Map Faculty
            </p>
          </div>

          <div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={faculty.username}
                  onChange={handleChange}
                  placeholder="Enter faculty name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    value={faculty.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                className="form-control"
                name="subject"
                value={faculty.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={faculty.role}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">faculty</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Department</label>
                <select
                  className="form-select"
                  name="department"
                  value={faculty.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIML">AIML</option>
                  <option value="ECE">ECE</option>
                 
                </select>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg fw-semibold"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting && <span className="spinner-border spinner-border-sm me-2"></span>}
                <i className="bi bi-person-check me-2"></i>{' '}
                {localStorage.getItem('editFaculty') ? 'Map Faculty' : 'Register Faculty'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;