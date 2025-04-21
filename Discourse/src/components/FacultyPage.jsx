import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/faculty.css";

function FacultyPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleCancel = () => {
    setQuestion("");
    setAnswer("");
    setFile(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // Logic to upload
    console.log({ question, answer, file });
  };

  return (
    <div className="faculty-page">
      <div className="upload-card">
        <div className="upload-form-section">
          <h2>Upload a Question</h2>

          <label>Lesson Name</label>
          <input
            type="text"
            placeholder="Lesson name"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <label>Question</label>
          <input
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <label>Attach File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <label>Answer</label>
          <div className="answer-scrollable">
            <div
              className="scrollable-content"
              contentEditable={true}
              suppressContentEditableWarning={true}
              placeholder="Enter answer here"
              onInput={(e) => setAnswer(e.target.innerText)}
            />
          </div>
        </div>

        {/* Buttons in the same row at the bottom */}
        <div className="upload-button-section">
          <button className="upload-btn" onClick={handleUpload}>
            Upload
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyPage;
