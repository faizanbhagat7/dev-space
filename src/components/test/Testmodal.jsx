import React,{useState,useEffect} from "react";
import "./Testmodal.css";
import Question from "./Question";

const Testmodal = ({ setTestmodal, questions }) => {
    const [currentQuestion,setCurrentQuestion] = useState(0)
    const [score,setScore] = useState(0)
  return (
    <>
      <div className="testmodal-container">
        <div className="testmodal-body">
            {
                questions.length > 0  && currentQuestion < 10
                 ? (
                    <Question
                    question={questions[currentQuestion]}
                    setCurrentQuestion={setCurrentQuestion}
                    currentQuestion={currentQuestion}
                    setScore={setScore}
                    score={score}
                    />
                )
                :
                (
                    <div className="testmodal-result">
                        <p>Result</p>
                        <p>{score}/10</p>
                        <div className="testmodal-result-button" onClick={()=>(setTestmodal(false))}>Close</div>
                    </div>

                )
            }
        </div>
      </div>
    </>
  );
};

export default Testmodal;
