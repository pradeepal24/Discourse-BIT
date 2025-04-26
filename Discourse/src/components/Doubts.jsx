import React, { useEffect, useState } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Doubts = () => {
  // Existing state declarations
  const [replyInputs, setReplyInputs] = useState({});
  const [typedReplies, setTypedReplies] = useState({});
  const [questions, setquestions] = useState([]);
  const [doubtquestion, setdoubtquestion] = useState([]);
  const [submitLoading, setSubmitLoading] = useState({});
  const [doubtAnswers, setDoubtAnswers] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState({});

  const department = localStorage.getItem("department");
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  useEffect(() => {
    fetchDoubts();
    getDoubtAnswersForStudent();
  }, []);

  // All your existing functions here
  const handleToggleInput = (index) => {
    setReplyInputs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleInputChange = (e, index) => {
    setTypedReplies((prev) => ({ ...prev, [index]: e.target.value }));
  };

  const handleSubmitReply = async (index, id, subject, did) => {
    try {
      setSubmitLoading((prev) => ({ ...prev, [index]: true }));
      console.log(id);
      const department = localStorage.getItem("department");
      const doubtsanswer = typedReplies[index];

      const response = await axios.post(
        "http://localhost:5000/doubtsanswer",
        { doubtsanswer },
        {
          params: {
            username: username,
            subject: subject,
            department: department,
            qid: id,
            did: did,
          },
        }
      );

      console.log(`Reply to Q${id} submitted:`, response.data);
      setReplyInputs((prev) => ({ ...prev, [index]: false }));
      setTypedReplies((prev) => ({ ...prev, [index]: "" }));
      getDoubtAnswersForStudent();
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert(`Error submitting reply: ${error.message}`);
    } finally {
      setSubmitLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // New function to handle deleting replies
  const handleDeleteReply = async (answerId) => {
    try {
      // Set loading state for the specific delete button
      setDeleteLoading((prev) => ({ ...prev, [answerId]: true }));
      
      // Make the delete request to your backend
      const response = await axios.delete(
        "http://localhost:5000/deletedoubtanswer",
        {
          params: {
            answerId: answerId,
            department: department
          },
        }
      );

      console.log(`Reply with ID ${answerId} deleted:`, response.data);
      
      // Refresh the doubt answers after deletion
      getDoubtAnswersForStudent();
      
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert(`Error deleting reply: ${error.message}`);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  // Function to handle deleting the main doubt
  const handleDeleteMainDoubt = async (doubtId) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [`doubt-${doubtId}`]: true }));
      
      const response = await axios.delete(
        "http://localhost:5000/deletedoubt",
        {
          params: {
            doubtId: doubtId,
            department: department
          },
        }
      );

      console.log(`Doubt with ID ${doubtId} deleted:`, response.data);
      
      // Refresh the doubts after deletion
      fetchDoubts();
      
    } catch (error) {
      console.error("Error deleting doubt:", error);
      alert(`Error deleting doubt: ${error.message}`);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [`doubt-${doubtId}`]: false }));
    }
  };

  const fetchDoubts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/studentdoubt", {
        params: { department: department },
      });
      console.log("here in get response i need to map the name of who posted the doubt", response.data);
      setquestions(response.data);

      if (response.data.length > 0) {
        fetchQuestion(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
  };

  const getDoubtAnswersForStudent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getdoubtanswerstudent",
        {
          params: {
            department: department,
          },
        }
      );

      console.log("Doubt Answers for Student:", response.data);
      setDoubtAnswers(response.data);
    } catch (error) {
      console.error("Error fetching student doubt answers:", error);
    }
  };

  const fetchQuestion = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getdoubtquestion",
        {
          params: { question_id: id },
        }
      );
      setdoubtquestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  return (
    <div style={{ width: "100vw", padding: "2rem" }}>
      <div style={{ maxWidth: "96vw", margin: "0 auto" }}>
        <h2 className="text-center mb-4">💬 Doubts & Discussions</h2>

        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {questions.map((q, index) => (
            <Card
              key={index}
              className="mb-4 shadow-sm border-0"
              style={{ borderRadius: "20px" }}
            >
              <Card.Header className="bg-primary bg-gradient text-white py-3" style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">{q.question}</h5>
                    <div className="mt-2">
                      <Badge bg="light" text="primary" className="me-2 py-2 px-3">
                        #{q.id}
                      </Badge>
                      <Badge bg="info" className="py-2 px-3">
                        {q.subject}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mt-3 p-3 bg-light border-start border-4 border-primary rounded-3">
                  <strong className="text-muted">Doubt: </strong>
                  {q.doubts || "This is a sample reply to the query."}
                  {role === 'faculty' && (
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-danger btn-sm mt-2 ms-2" 
                        onClick={() => handleDeleteMainDoubt(q.d_id)}
                        disabled={deleteLoading[`doubt-${q.d_id}`]}
                      >
                        {deleteLoading[`doubt-${q.d_id}`] ? "Deleting..." : "Delete doubt"}
                      </button>
                    </div>
                  )}
                  <p className="text-end mb-0 mt-2 text-secondary">
                    <small>From : <span className="fw-bold">{q.username}</span></small>
                  </p>
                </div>

                {doubtAnswers.map((element, ansIndex) => {
                  if (element.did === q.d_id) {
                    return (
                      <div key={ansIndex} className="mt-3 p-3 bg-light border-start border-4 border-success rounded-3">
                        <strong className="text-muted">
                          <span className="fw-bold text-primary">{element.username}</span>:{" "}
                        </strong>
                        {element.danswer}
                        {role === 'faculty' && (
                          <div className="d-flex justify-content-end">
                            <button 
                              className="btn btn-danger btn-sm mt-2 ms-2"
                              onClick={() => handleDeleteReply(element.id)}
                              disabled={deleteLoading[element.id]}
                            >
                              {deleteLoading[element.id] ? "Deleting..." : "Delete reply"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}

                <div className="mt-3 d-flex justify-content-end flex-wrap gap-2">
                  <Button variant="primary" onClick={() => handleToggleInput(index)}>
                    {replyInputs[index] ? "Cancel" : "Reply"}
                  </Button>
                </div>

                {replyInputs[index] && (
                  <Form className="mt-3">
                    <Form.Group controlId={`reply-input-${index}`}>
                      <Form.Label>
                        <strong>Type your reply:</strong>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your reply here..."
                        value={typedReplies[index] || ""}
                        onChange={(e) => handleInputChange(e, index)}
                        className="rounded-3"
                      />
                    </Form.Group>
                    <div className="text-end mt-2">
                      <Button
                        variant="success"
                        onClick={() => handleSubmitReply(index, q.id, q.subject, q.d_id)}
                        disabled={submitLoading[index]}
                      >
                        {submitLoading[index] ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doubts;