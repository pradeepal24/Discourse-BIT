import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

const History2 = () => {
  const [History, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const subject = localStorage.getItem('subject');

  useEffect(() => {
    fetchhistory();
  }, []);

  const fetchhistory = () => {
    axios
      .get('http://localhost:5000/getquestionshistory', { params: { subject } })
      .then(res => {
        console.log(res.data);
        setHistory(res.data);
      })
      .catch(err => {
        console.log('error while fetching the users history', err);
      });
  };

  const filteredFaculty = History.filter(faculty =>
    faculty.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.file_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.created_at.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (faculty) => {
    localStorage.setItem('editFaculty', JSON.stringify(faculty));
    navigate('/drawer/faculty');
  };

  const handledelte = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteuser/${id}`);
      fetchhistory();
    } catch (error) {
      console.log('error in deleting', error);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1200px', height: '100vh', overflowY: 'auto' }}>
      <div className="card shadow-sm" style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="card-header bg-light">
          <h3 className="mb-0">History of Added Questions</h3>
        </div>

        <div className="card-body d-flex flex-column" style={{ overflowY: 'hidden', flex: '1' }}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search question, answer, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Scrollable Table Area */}
          <div className="table-responsive" style={{ overflowY: 'auto', flex: '1' }}>
            <table className="table table-hover" style={{ minWidth: '1000px' }}>
              <thead className="bg-primary text-white">
                <tr>
                  <th style={{ width: '20%', backgroundColor: 'blue', color: 'white' }}>Question</th>
                  <th style={{ width: '40%', backgroundColor: 'blue', color: 'white' }}>Answer</th>
                  <th style={{ width: '10%', backgroundColor: 'blue', color: 'white' }}>Subject</th>
                  <th style={{ width: '10%', backgroundColor: 'blue', color: 'white' }}>Department</th>
                  <th style={{ width: '15%', backgroundColor: 'blue', color: 'white' }}>File</th>
                  <th style={{ width: '15%', backgroundColor: 'blue', color: 'white' }}>Date of Upload</th>
                  <th style={{ width: '15%', backgroundColor: 'blue', color: 'white' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((faculty, index) => (
                  <tr key={index}>
                    <td>{faculty.question}</td>
                    <td className="text-muted">{faculty.answer}</td>
                    <td>{faculty.subject}</td>
                    <td>{faculty.department}</td>
                    <td>{faculty.file_path}</td>
                    <td>{faculty.created_at}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-success me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(faculty)}
                      ></i>
                      <i
                        className="bi bi-trash-fill text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handledelte(faculty.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default History2;
