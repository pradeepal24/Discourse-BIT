import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Answers = () => {
  const navigate = useNavigate();

  const initialQAs = [
    { id: 1, question: "What is your name?", answer: "My name is Manoj Karuppusamy." },
    { id: 2, question: "What is your favorite subject?", answer: "My favorite subject is Physics." },
    { id: 3, question: "What is your favorite hobby?", answer: "My favorite hobby is Reading." },
    { id: 4, question: "What motivates you to study?", answer: "Nature inspires me to stay focused and grow stronger." },
    { id: 5, question: "Where do you see yourself in 5 years?", answer: "In 5 years, I see myself as a Software Engineer." },
  ];

  const [qas, setQas] = useState(
    initialQAs.map(item => ({
      ...item,
      showAnswer: false,
      likes: 0,
      dislikes: 0,
      showReply: false,
      replyText: "",
      replies: []
    }))
  );

  const toggleAnswer = id => {
    setQas(qas.map(item =>
      item.id === id ? { ...item, showAnswer: !item.showAnswer } : item
    ));
  };

  const vote = (id, type) => {
    setQas(qas.map(item =>
      item.id === id
        ? {
            ...item,
            likes: type === 'like' ? item.likes + 1 : item.likes,
            dislikes: type === 'dislike' ? item.dislikes + 1 : item.dislikes,
          }
        : item
    ));
  };

  const toggleReply = id => {
    setQas(qas.map(item =>
      item.id === id ? { ...item, showReply: !item.showReply } : item
    ));
  };

  const handleReplyChange = (id, value) => {
    setQas(qas.map(item =>
      item.id === id ? { ...item, replyText: value } : item
    ));
  };

  const submitReply = id => {
    setQas(qas.map(item => {
      if (item.id === id && item.replyText.trim()) {
        return {
          ...item,
          replies: [...item.replies, item.replyText.trim()],
          replyText: "",
          showReply: false
        };
      }
      return item;
    }));
  };

  const deleteReply = (qid, index) => {
    setQas(qas.map(item => {
      if (item.id === qid) {
        const newReplies = [...item.replies];
        newReplies.splice(index, 1);
        return { ...item, replies: newReplies };
      }
      return item;
    }));
  };

  return (
    <div
      className="vh-100 d-flex flex-column p-0 bg-light mx-auto"
      style={{
        maxWidth: '1250px',
        width: '100vw',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div className="bg-primary text-white text-center py-4">
        <h2 className="mb-0">Discourse Forum: Physics</h2>
      </div>

      {/* Meta Info */}
      <div className="bg-white p-4 border-bottom shadow-sm position-sticky top-0 z-3">
        <div className="d-flex justify-content-between text-dark">
          <div><i className="bi bi-person-fill me-2 text-secondary"></i><strong>Faculty:</strong> ManojK</div>
          <div><strong>Department:</strong> IT</div>
          <div><strong>Course Code:</strong> PHY101</div>
          <div></div>
        </div>
      </div>

      {/* Q&A Section (Scrollable only inside this area) */}
      <div
        className="overflow-auto p-4"
        style={{
          flex: 1,
          backgroundColor: '#f8f9fa',
          height: 'calc(100vh - 200px)',  // Adjust the height to avoid overlap with header/footer
          paddingBottom: '50px'  // Ensure the bottom part isn't hidden behind the button
        }}
      >
        {qas.map((item, qIndex) => (
          <div key={item.id} className="mb-5">
            {/* Question */}
            <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded shadow-sm border">
              <h4 className="mb-0">
                <span className="me-2">Q{item.id}.</span>
                <i className="bi bi-question-circle-fill text-primary me-2"></i>
                {item.question}
              </h4>
              <button className="btn btn-outline-primary btn-sm" onClick={() => toggleAnswer(item.id)}>
                {item.showAnswer ? <><i className="bi bi-eye-slash-fill"></i> Hide</> : <><i className="bi bi-eye-fill"></i> Show</>}
              </button>
            </div>

            {/* Answer */}
            {item.showAnswer && (
              <div className="mt-3 p-3 bg-white rounded shadow-sm border-start border-4 border-primary">
                {item.id === 4 ? (
                  <div>
                    <p className="mb-2"><strong>A:</strong> {item.answer}</p>
                    <img
                      src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?cs=srgb&dl=daylight-environment-forest-459225.jpg&fm=jpg"
                      alt="Motivational Forest"
                      className="img-fluid rounded mt-2"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <p className="mb-0"><strong>A:</strong> {item.answer}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="d-flex justify-content-end align-items-center mt-3">
              <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => vote(item.id, 'like')}>
                <i className="bi bi-hand-thumbs-up-fill"></i> {item.likes}
              </button>
              <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => vote(item.id, 'dislike')}>
                <i className="bi bi-hand-thumbs-down-fill"></i> {item.dislikes}
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => toggleReply(item.id)}>
                <i className="bi bi-reply-fill"></i> Reply
              </button>
            </div>

            {/* Reply Input */}
            {item.showReply && (
              <div className="mt-3">
                <textarea
                  className="form-control form-control-sm mb-2"
                  rows="2"
                  placeholder="Write your reply..."
                  value={item.replyText}
                  onChange={e => handleReplyChange(item.id, e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary btn-sm" onClick={() => submitReply(item.id)}>
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Replies List */}
            {item.replies.map((r, idx) => (
              <div key={idx} className="mt-3 p-3 bg-white rounded shadow-sm border d-flex justify-content-between align-items-start">
                <p className="mb-0"><strong>Reply:</strong> {r}</p>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  title="Delete reply"
                  onClick={() => deleteReply(item.id, idx)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        className="btn btn-secondary position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 1000 }}
        onClick={() => navigate('/drawer/sublist')}
      >
        <i className="bi bi-arrow-left-circle me-2"></i>Back
      </button>
    </div>
  );
};

export default Answers;
