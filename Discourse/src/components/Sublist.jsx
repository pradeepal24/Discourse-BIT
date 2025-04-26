import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/subjectlist.css";
import axios from "axios";

const Sublist = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  // const subjects = [
  //   { name: "Physics", path: "/drawer/answer" },
  //   { name: "Chemistry", path: "/drawer/answer" },
  //   { name: "Foundational English", path: "/drawer/answer" },
  //   { name: "Digital Computer Electronics", path: "/drawer/answer" },
  //   { name: "Computational Problem Solving", path: "/drawer/answer" },
  // ];

  const department = localStorage.getItem("department");
  const fetchSubjects = () => {
    axios
      .get("http://localhost:5000/getsubjects", {
        params: { department: department },
      })
      .then((res) => {
        setSubjects(res.data);
      })
      .catch((err) => {
        console.log("error while getting subjects", err);
      });
  };
  // const fetchAnswer = () => {
  //   axios
  //     .get("http://localhost:5000/getanswers", {
  //       params: { department: department, subject: subjects.subject },
  //     })
  //     .then((res) => {
  //       setSubjects(res.data);
  //     })
  //     .catch((err) => {
  //       console.log("error while getting subjects", err);
  //     });
  // };
 

  useEffect(() => {
    fetchSubjects();
  }, []);
  async function loosupradeep(subject) {
    await axios.get('http://localhost:5000/answers/students',{
      params : { department : department
        
      }
    })
  }
  return (
    <div className="subjectlist-container">
      <div className="subject-card">
        <div className="subject-card-header">
          Discourse Subjects - {localStorage.getItem("department")}{" "}
        </div>
        <div className="subject-card-body">
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Discourse</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(({ subject }) => (
                <tr key={subject}>
                  <td>{subject}</td>
                  <td>
                    <span
                      className="click-here-link"
                      onClick={() =>{
                        loosupradeep(subject)
                        navigate("/drawer/answer", {
                          state: {
                            subject: subject,
                            department: department,
                          },
                        })}
                      }
                    >
                      Click Here
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sublist;
