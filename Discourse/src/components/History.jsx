import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

const History = () => {
  const [History, setHistory] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchhistory();
  }, []);
  
  const fetchhistory = () => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log("error while fetching the users history", err);
      });
  };
  
  const filteredFaculty = History.filter(
    (faculty) =>
      faculty.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maskPassword = (password) => "•".repeat(password.length);

  const handleEdit = (faculty) => {
    localStorage.setItem("editFaculty", JSON.stringify(faculty));
    navigate("/admin"); // route to AdminPage
  };

  const handledelte = (id) => {
    try {
      axios.delete(`http://localhost:5000/deleteuser/${id}`);
      fetchhistory();
    } catch (error) {
      console.log("error in deleting", error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="mb-0">Faculty Archive</h2>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "20%", backgroundColor: "blue", color: "white"  }}>Name</th>
                  <th style={{ width: "20%" , backgroundColor: "blue", color: "white" }}>Password</th>
                  <th style={{ width: "20%" , backgroundColor: "blue", color: "white" }}>Subject</th>
                  <th style={{ width: "15%", backgroundColor: "blue", color: "white"  }}>Department</th>
                  <th style={{ width: "10%", backgroundColor: "blue", color: "white"  }}>Role</th>
                  <th style={{ width: "15%", backgroundColor: "blue", color: "white"  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((faculty, index) => (
                  <tr key={index}>
                    <td>{faculty.username}</td>
                    <td className="text-muted">{faculty.password}</td>
                    <td>{faculty.subject}</td>
                    <td>{faculty.department}</td>
                    <td
                      className={
                        faculty.role === "Admin"
                          ? "text-danger"
                          : "text-primary"
                      }
                    >
                      {faculty.role}
                    </td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-success me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(faculty)}
                      ></i>
                      <i
                        className="bi bi-trash-fill text-danger"
                        style={{ cursor: "pointer" }}
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

export default History;