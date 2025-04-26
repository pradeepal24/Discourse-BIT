import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Badge,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Answers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from URL state or localStorage
  const subject = location.state?.subject || localStorage.getItem("subject");
  const faculty =
    location.state?.faculty || localStorage.getItem("faculty") || "Dr. Smith";
  const department = localStorage.getItem("department");
  const username = localStorage.getItem("username");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("this is console log username", username);
  // Fetch questions from database
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/answers", {
        params: {
          department: department,
          subject: subject,
        },
      })
      .then((response) => {
        // Transform data to include UI state for each question
        const questionData = response.data.map((q) => ({
          ...q,
          showAnswer: false,
          showReplyInput: false,
          replyText: "",
          liked: false,
          disliked: false,
        }));

        setQuestions(questionData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      });
  }, [department, subject]);

  // Toggle answer visibility
  const toggleAnswer = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, showAnswer: !q.showAnswer } : q
      )
    );
  };

  // Toggle reply input field
  const toggleReply = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, showReplyInput: !q.showReplyInput } : q
      )
    );
  };

  // Handle reply text change
  const handleReplyChange = (id, text) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, replyText: text } : q))
    );
  };

  // Submit reply
  const submitReply = (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question.replyText.trim()) return;

    // In a real app, you'd send this to your backend
    axios
      .post("http://localhost:5000/doubts", {
        
        questionId: id,
        replyText: question.replyText,
        username:username,
        // userId: localStorage.getItem('userId') || 'anonymous',
        subject: subject,
        department: department,
      })
      .then((response) => {
        // Update local state with new reply
        setQuestions(
          questions.map((q) => {
            if (q.id === id) {
              const updatedReplies = [
                ...(q.replies || []),
                {
                  id: response.data.id || Date.now(),
                  text: q.replyText,
                  userId: localStorage.getItem("username") || "anonymous",
                  timestamp: new Date().toISOString(),
                },
              ];

              return {
                ...q,
                replies: updatedReplies,
                replyText: "",
                showReplyInput: false,
              };
            }
            return q;
          })
        );
      })
      .catch((err) => {
        console.error("Error submitting reply:", err);
        alert("Failed to submit reply. Please try again.");
      });
  };

  // Handle likes and dislikes
  const handleVote = (id, voteType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          // Toggle the vote state
          if (voteType === "like") {
            if (q.liked) {
              return { ...q, liked: false, likes: (q.likes || 0) - 1 };
            } else {
              // If disliked, remove dislike first
              const updatedDislikes = q.disliked
                ? (q.dislikes || 0) - 1
                : q.dislikes || 0;
              return {
                ...q,
                liked: true,
                disliked: false,
                likes: (q.likes || 0) + 1,
                dislikes: updatedDislikes,
              };
            }
          } else {
            if (q.disliked) {
              return { ...q, disliked: false, dislikes: (q.dislikes || 0) - 1 };
            } else {
              // If liked, remove like first
              const updatedLikes = q.liked ? (q.likes || 0) - 1 : q.likes || 0;
              return {
                ...q,
                disliked: true,
                liked: false,
                dislikes: (q.dislikes || 0) + 1,
                likes: updatedLikes,
              };
            }
          }
        }
        return q;
      })
    );

    // In a real app, you'd also update the backend
    axios
      .post("http://localhost:5000/api/vote", {
        questionId: id,
        voteType: voteType,
        userId: localStorage.getItem("userId") || "anonymous",
      })
      .catch((err) => {
        console.error("Error saving vote:", err);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: 400,
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", maxWidth: "1300px", mx: "auto", height: "100%" }}>
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {subject} Forum
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
              Faculty:
            </Typography>
            <Typography variant="body1">{faculty}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
              Department:
            </Typography>
            <Typography variant="body1">{department}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
              Course Code:
            </Typography>
            <Typography variant="body1">
              {subject.substring(0, 3).toUpperCase() + "101"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Questions and Answers Section */}
      <Box
        sx={{
          width: "100%",
          maxHeight: "400px",
          overflowY: "auto",
          pr: 1,
          mb: 8,
        }}
      >
        {questions.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No questions available for this subject.
            </Typography>
          </Paper>
        ) : (
          questions.map((question) => (
            <Card
              key={question.id}
              sx={{
                mb: 3,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* Question */}
              <CardHeader
                title={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginleft: "2",
                    }}
                  >
                    <Badge
                      color="secondary"
                      badgeContent={`Q${question.id}`}
                      sx={{ mr: 3 }}
                    />
                    <Typography variant="h6" component="span">
                      {question.question}
                    </Typography>
                  </Box>
                }
                action={
                  <Button
                    variant={question.showAnswer ? "outlined" : "contained"}
                    color={question.showAnswer ? "secondary" : "primary"}
                    size="small"
                    startIcon={
                      question.showAnswer ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )
                    }
                    onClick={() => toggleAnswer(question.id)}
                  >
                    {question.showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>
                }
                sx={{ bgcolor: "background.paper" }}
              />

              {/* Answer (conditional) */}
              {question.showAnswer && (
                <CardContent
                  sx={{
                    borderLeft: 4,
                    borderColor: "primary.main",
                    pt: 0,
                  }}
                >
                  <Box sx={{ mt: 2 }}>
                    {question.danswer}
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="bold"
                    >
                      Answer:
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                      {question.answer}
                    </Typography>

                    {/* Display image if available */}
                    {question.file_path && (
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <img
                          src={`http://localhost:5000/${question.file_path}`}
                          alt="Answer illustration"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Voting buttons */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Button
                      variant={question.liked ? "contained" : "outlined"}
                      color="success"
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleVote(question.id, "like")}
                    >
                      {question.likes || 0}
                    </Button>
                    <Button
                      variant={question.disliked ? "contained" : "outlined"}
                      color="error"
                      size="small"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => handleVote(question.id, "dislike")}
                    >
                      {question.dislikes || 0}
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<ChatIcon />}
                      onClick={() => toggleReply(question.id)}
                    >
                      Reply
                    </Button>
                  </Box>

                  {/* Replies */}
                  {question.replies && question.replies.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        Replies:
                      </Typography>

                      {question.replies.map((reply, index) => (
                        <Paper
                          key={reply.id || index}
                          variant="outlined"
                          sx={{
                            p: 2,
                            mb: 1,
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                            {reply.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posted by: {reply.userId || "Anonymous"} •{" "}
                            {new Date(reply.timestamp).toLocaleString()}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {/* Reply input (conditional) */}
                  {question.showReplyInput && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Your Reply"
                        variant="outlined"
                        value={question.replyText}
                        onChange={(e) =>
                          handleReplyChange(question.id, e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => toggleReply(question.id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => submitReply(question.id)}
                          disabled={!question.replyText.trim()}
                        >
                          Submit Reply
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </Box>

      {/* Back button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <IconButton
          color="primary"
          size="large"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            width: 56,
            height: 56,
            boxShadow: 3,
          }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Answers;
