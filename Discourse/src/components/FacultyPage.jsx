import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"; 
import "../Styles/faculty.css";
import axios from "axios";

function FacultyPage() {
  const [formData, setFormData] = useState({
    lessonName: "",
    question: "",
    answer: "",
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, JPG, or PNG images are allowed");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleCancel = () => {
    setFormData({
      lessonName: "",
      question: "",
      answer: "",
      file: null
    });
    toast.info("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const { lessonName, question, answer, file } = formData;
  
    if (!lessonName || !question || !answer) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const faculty_id = localStorage.getItem("faculty_id");
      const formDataToSend = new FormData();
      formDataToSend.append("faculty_id", faculty_id);
      formDataToSend.append("lessonname", lessonName);
      formDataToSend.append("question", question);
      formDataToSend.append("answer", answer);
      if (file) formDataToSend.append("file", file);
  
      await axios.post("http://localhost:5000/questions", formDataToSend);
  
      toast.success("Question uploaded successfully!");
      handleCancel();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="faculty-page">
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="upload-card">
        <div className="card-header">
          <h2>
            <i className="bi bi-upload icon"></i>
            Upload {localStorage.getItem("subject")} Question
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="upload-form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lessonName">Lesson Name *</label>
              <input
                id="lessonName"
                type="text"
                name="lessonName"
                placeholder="Enter lesson name"
                value={formData.lessonName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Upload Image</label>
              <div className="file-upload">
                <label htmlFor="file-upload" className="file-upload-label">
                  <i className="bi bi-upload upload-icon"></i>
                  <span>{formData.file ? formData.file.name : "Choose a File"}</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                />
                {formData.file && (
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                    className="file-clear"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="question">Question *</label>
            <textarea
              id="question"
              name="question"
              placeholder="Enter your question"
              value={formData.question}
              onChange={handleChange}
              required
              rows={3}  
              style={{
                resize: 'none', 
                overflowY: 'auto', 
                width: '100%', 
                minHeight: '50px' 
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Answer *</label>
            <textarea
              id="answer"
              name="answer"
              placeholder="Enter your answer here..."
              value={formData.answer}
              onChange={handleChange}
              required
              rows={4} 
              style={{
                resize: 'none', 
                overflowY: 'auto', 
                width: '100%',
                minHeight: '60px' 
              }}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              <i className="bi bi-x"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className="upload-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : (
                <i className="bi bi-upload"></i>
              )}
              {isSubmitting ? "Uploading..." : "Upload Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyPage;