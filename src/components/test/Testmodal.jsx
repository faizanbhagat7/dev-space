import React, { useState } from "react";
import "./Testmodal.css";
import Question from "./Question";

const getScoreMsg = (score) => {
  if (score >= 9) return { msg: "Perfect score! You're elite 🔥", color: "var(--magenta)" };
  if (score >= 7) return { msg: "Solid performance! Keep it up 💪", color: "var(--green-code)" };
  if (score >= 5) return { msg: "Not bad. Room to grow 📈", color: "var(--yellow)" };
  return { msg: "Keep grinding. You'll get there 🛠️", color: "var(--text-muted)" };
};

const Testmodal = ({ setTestmodal, questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const done = currentQuestion >= 10 || currentQuestion >= questions.length;
  const { msg, color } = getScoreMsg(score);

  return (
    <div className="testmodal-container">
      <div className="testmodal-body">
        {!done ? (
          <Question
            question={questions[currentQuestion]}
            setCurrentQuestion={setCurrentQuestion}
            currentQuestion={currentQuestion}
            setScore={setScore}
            score={score}
          />
        ) : (
          <div className="testmodal-result">
            <h1>Done!</h1>
            <p className="completed-statement">// test completed</p>
            <div className="score-display">{score}/10</div>
            <p className="score-label">correct answers</p>
            <p style={{ color }}>{msg}</p>
            <div className="btn-container">
              <button className="testmodal-result-button" onClick={() => setTestmodal(false)}>
                ← back to tests
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testmodal;
