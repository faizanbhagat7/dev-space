import React, { useState } from "react";
import "./Question.css";

const Question = ({
  currentQuestion,
  setCurrentQuestion,
  question,
  setScore,
  score,
  questions,
}) => {
  const [optionSelected, setOptionSelected] = useState(null);
  const questionStatement = question.question;
  const options = question.answers;
  const optionEntries = Object.entries(options)
    .filter((item) => item[1] !== null)
    .slice(0, 4);

  const correctAnswerKey = Object.keys(question?.correct_answers).find(
    (key) => question?.correct_answers[key] === "true"
  );
  const correctAnswer = correctAnswerKey?.replace("_correct", "");

  const correctAnswerText = options[correctAnswer];

  const handleAnswer = (answer) => {
    if (currentQuestion < 10) {
      if (optionSelected) return;
      else {
        if (answer === correctAnswerText) {
          setScore(score + 1);
        }
        setOptionSelected(answer);
      }
    }
  };

  return (
    <>
      <div className="question-container">
        <div className="question-number">
          <p>Question {currentQuestion + 1}</p>
        </div>

        <div className="question-text">
          <p>{questionStatement}</p>
        </div>
        <div className="question-options">
          {optionEntries.map((option) => {
            const [key, value] = option;
            return (
              <div
                className="question-option"
                onClick={() => handleAnswer(value)}
                style={{
                  backgroundColor:
                    optionSelected === value && optionSelected !== null
                      ? "#0077b5"
                      : "",
                  color:
                    optionSelected === value && optionSelected !== null
                      ? "white"
                      : "",
                }}
              >
                {value}
              </div>
            );
          })}
        </div>
        <div className="question-next">


          <button className="quit-test-button" onClick={() => {
            setCurrentQuestion(10);
            setOptionSelected(null);
            }}>
            Quit Test
            </button>


          <button
            className="question-next-button"
            onClick={() => {
              setOptionSelected(null);

            if (currentQuestion < 10) {
              setCurrentQuestion(currentQuestion + 1);
                }
            }}
          >
            {currentQuestion > 8 ? "Submit" : "Next Question"}
          </button>

        </div>
      </div>
    </>
  );
};

export default Question;
