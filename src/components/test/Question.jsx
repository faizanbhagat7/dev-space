import React, { useState } from "react";
import "./Question.css";

const Question = ({ currentQuestion, setCurrentQuestion, question, setScore, score }) => {
  const [optionSelected, setOptionSelected] = useState(null);
  const [correctAnswerText, setCorrectAnswerText] = useState(null);

  const options = question?.answers || {};
  const optionEntries = Object.entries(options).filter(([, v]) => v !== null).slice(0, 4);

  const getCorrectAnswerText = () => {
    const correctKey = Object.keys(question?.correct_answers || {}).find(k => question.correct_answers[k] === "true");
    return options[correctKey?.replace("_correct", "")];
  };

  const handleAnswer = (value) => {
    if (optionSelected) return;
    const correct = getCorrectAnswerText();
    setCorrectAnswerText(correct);
    if (value === correct) setScore(score + 1);
    setOptionSelected(value);
  };

  const getOptionClass = (value) => {
    if (!optionSelected) return "question-option";
    const correct = correctAnswerText || getCorrectAnswerText();
    if (value === correct) return "question-option option-correct";
    if (value === optionSelected && value !== correct) return "question-option option-wrong";
    return "question-option option-selected";
  };

  const progress = ((currentQuestion) / 10) * 100;

  return (
    <div className="question-container">
      <div className="question-progress">
        <span className="question-number">Q{currentQuestion + 1} / 10</span>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="question-number" style={{color:'var(--text-muted)'}}>score: {score}</span>
      </div>

      <div className="question-text">
        <p>{question?.question}</p>
      </div>

      <div className="question-options">
        {optionEntries.map(([key, value]) => (
          <div key={key} className={getOptionClass(value)} onClick={() => handleAnswer(value)}>
            {value}
          </div>
        ))}
      </div>

      <div className="question-next">
        <button className="quit-test-button" onClick={() => setCurrentQuestion(10)}>
          quit
        </button>
        <button
          className="question-next-button"
          disabled={!optionSelected}
          onClick={() => { setOptionSelected(null); setCorrectAnswerText(null); setCurrentQuestion(currentQuestion + 1); }}
        >
          {currentQuestion >= 9 ? "submit →" : "next →"}
        </button>
      </div>
    </div>
  );
};

export default Question;
