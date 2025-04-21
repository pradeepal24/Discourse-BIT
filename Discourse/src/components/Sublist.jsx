import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/subjectlist.css';

const Sublist = () => {
  const navigate = useNavigate();

  const subjects = [
    { name: "Physics", path: "/drawer/answer" },
    { name: "Chemistry", path: "/drawer/answer" },
    { name: "Foundational English", path: "/drawer/answer" },
    { name: "Digital Computer Electronics", path: "/drawer/answer" },
    { name: "Computational Problem Solving", path: "/drawer/answer" },
  ];

  return (
    <div className="subjectlist-container">
      <div className="subject-card">
        <div className="subject-card-header">Discourse Subjects – IT</div>
        <div className="subject-card-body">
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Discourse</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(({ name, path }) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>
                    <span
                      className="click-here-link"
                      onClick={() =>
                        navigate(path, {
                          state: {
                            subject: name,
                            department: "IT",
                            facultyName: "ManojK"
                          }
                        })
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
