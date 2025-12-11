import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Q&A Interactive Viewer App
 * - Header with app title
 * - Form to add Q&A pairs
 * - Scrollable list of question/answer pairs (reverse order)
 * - Click question to toggle answer
 * - Responsive, light-themed, styled with provided palette
 * - Saves Q&As to localStorage
 */
function App() {
  // Theme palette (from style guide)
  const theme = {
    primary: "#3b82f6",
    success: "#06b6d4",
    secondary: "#64748b",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
  };

  // State for the Q&A form fields
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  // State for the Q&A list, answer visibility states, and errors
  const [qaList, setQaList] = useState([]);
  const [openIdxs, setOpenIdxs] = useState({});
  const [error, setError] = useState("");
  // Focus for accessibility
  const questionInputRef = useRef(null);

  // Load QAs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("qaPairs");
    if (stored) {
      try {
        setQaList(JSON.parse(stored));
      } catch (e) {
        setQaList([]);
      }
    }
  }, []);

  // Save to localStorage when qaList changes
  useEffect(() => {
    localStorage.setItem("qaPairs", JSON.stringify(qaList));
  }, [qaList]);

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (question.trim() === "" || answer.trim() === "") {
      setError("Both question and answer are required.");
      return;
    }
    // Add new Q&A to front (reverse order)
    setQaList((prev) => [
      { question: question.trim(), answer: answer.trim() },
      ...prev,
    ]);
    setQuestion("");
    setAnswer("");
    setError("");
    // Focus back on question field
    setTimeout(() => questionInputRef.current?.focus(), 0);
  };

  // PUBLIC_INTERFACE
  const handleToggle = (idx) => {
    setOpenIdxs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div
      className="App"
      style={{
        background: theme.background,
        color: theme.text,
        minHeight: "100vh",
        margin: 0,
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          background: theme.primary,
          color: "#fff",
          padding: "2rem 0 1.25rem",
          boxShadow: "0 2px 8px 0 rgba(59, 130, 246, 0.08)",
          marginBottom: "1.2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            fontSize: "2.2rem",
          }}
        >
          Q&amp;A Interactive Viewer
        </h1>
        <div style={{ fontSize: "1rem", fontWeight: 400, color: theme.surface, opacity: 0.94 }}>
          Add questions and answers for interactive learning.
        </div>
      </header>

      {/* Q&A Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 560,
          margin: "0 auto 1.8rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: theme.surface,
          boxShadow: "0 2px 10px 0 rgba(59, 130, 246, 0.03)",
          borderRadius: 13,
          padding: "1.4rem 1.4rem 1rem 1.4rem",
          border: `1px solid ${theme.secondary}22`,
        }}
        autoComplete="off"
      >
        <label htmlFor="qa-question" style={{ fontWeight: 600, color: theme.secondary }}>
          Question
        </label>
        <input
          id="qa-question"
          ref={questionInputRef}
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            padding: "0.6rem 0.9rem",
            border: `1.1px solid ${theme.secondary}33`,
            borderRadius: 8,
            fontSize: "1.08rem",
            background: theme.background,
            color: theme.text,
            outline: "none",
          }}
        />
        <label htmlFor="qa-answer" style={{ fontWeight: 600, color: theme.secondary }}>
          Answer
        </label>
        <textarea
          id="qa-answer"
          placeholder="Enter the answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            padding: "0.6rem 0.9rem",
            minHeight: 76,
            border: `1.1px solid ${theme.secondary}33`,
            borderRadius: 8,
            fontSize: "1.08rem",
            background: theme.background,
            color: theme.text,
            outline: "none",
          }}
        />
        {error && (
          <div
            style={{
              color: theme.error,
              fontWeight: 500,
              marginBottom: "-.6rem",
              marginTop: "0.1rem",
              fontSize: "1.02rem",
            }}
            data-testid="error-msg"
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            background: theme.success,
            color: "#fff",
            padding: "0.74rem 0.7rem",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
            fontSize: "1.12rem",
            cursor: "pointer",
            marginTop: "0.4rem",
            boxShadow: "0 1px 6px 0 rgba(6, 182, 212, 0.08)",
            transition: "background 0.18s",
            letterSpacing: "-0.03em",
          }}
        >
          Add Q&A
        </button>
      </form>

      {/* Q&A List */}
      <section
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: theme.surface,
          borderRadius: 13,
          border: `1px solid ${theme.secondary}22`,
          minHeight: 130,
          boxShadow: "0 2px 12px 0 rgba(100, 116, 139, 0.07)",
          padding: "0.8rem 1.4rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: theme.secondary,
            fontSize: "1.15rem",
            margin: "0.28rem 0 0.3rem 0.1rem",
            letterSpacing: "-0.01em",
            opacity: 0.93,
            textAlign: "left",
          }}
        >
          Questions
        </div>
        <div
          style={{
            maxHeight: 360,
            overflowY: "auto",
            paddingTop: ".2rem",
            paddingBottom: ".2rem",
          }}
        >
          {qaList.length === 0 && (
            <div
              style={{
                color: theme.secondary,
                opacity: 0.72,
                fontWeight: 400,
                margin: "0.8rem 0 1.1rem 0",
                textAlign: "center",
              }}
              data-testid="empty-message"
            >
              No Q&amp;A pairs yet. Add your first question above!
            </div>
          )}
          {qaList.map((qa, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: idx !== qaList.length - 1 ? "1.2rem" : "0.3rem",
                paddingBottom: "0.2rem",
                userSelect: "none",
                borderBottom: idx !== qaList.length - 1 ? `1.2px dashed ${theme.secondary}18` : "none",
              }}
            >
              <button
                onClick={() => handleToggle(idx)}
                tabIndex={0}
                style={{
                  background: theme.primary,
                  border: "none",
                  borderRadius: 7,
                  outline: "none",
                  padding: "0.70rem 1.02rem",
                  width: "100%",
                  textAlign: "left",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.07rem",
                  marginBottom: openIdxs[idx] ? ".36rem" : "0",
                  cursor: "pointer",
                  transition: "background 0.17s, box-shadow 0.15s",
                  boxShadow: openIdxs[idx]
                    ? "0 1px 7px 0 rgba(59, 130, 246, 0.19)"
                    : "0 1px 4px 0 rgba(59, 130, 246, 0.10)",
                }}
                aria-expanded={!!openIdxs[idx]}
                aria-controls={`qa-answer-${idx}`}
                data-testid={`qa-question-btn-${idx}`}
              >
                {qa.question}
                <span
                  style={{
                    float: "right",
                    fontWeight: 600,
                    fontSize: "0.97rem",
                    opacity: 0.74,
                  }}
                  aria-hidden="true"
                >
                  {openIdxs[idx] ? "▲" : "▼"}
                </span>
              </button>
              {openIdxs[idx] && (
                <div
                  id={`qa-answer-${idx}`}
                  style={{
                    background: theme.surface,
                    color: theme.text,
                    borderRadius: 6,
                    marginTop: "-0.2rem",
                    marginBottom: ".4rem",
                    padding: "0.95rem 0.8rem 0.6rem 1.4rem",
                    fontWeight: 500,
                    fontSize: "1.04rem",
                    boxShadow: "0 0.2px 5px 0 rgba(6, 182, 212, 0.06)",
                  }}
                  data-testid={`qa-answer-${idx}`}
                >
                  {qa.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* App Footer (optional, muted) */}
      <div
        style={{
          marginTop: "2.1rem",
          marginBottom: "1.6rem",
          color: theme.secondary,
          fontWeight: 400,
          fontSize: ".97rem",
          textAlign: "center",
          opacity: 0.57,
          letterSpacing: "0.01em",
        }}
      >
        Q&amp;A Interactive Viewer &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default App;
