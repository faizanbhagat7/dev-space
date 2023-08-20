import React,{useState,useEffect,useContext} from "react";
import "./Testmodal.css";
import Question from "./Question";
import { LoginContext } from "../../context/LoginContext";

const Testmodal = ({ setTestmodal, questions }) => {
    const [currentQuestion,setCurrentQuestion] = useState(0)
    const [score,setScore] = useState(0)
    const {darkMode} = useContext(LoginContext)
  return (
    <>
      <div className="testmodal-container">
        <div className="testmodal-body"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
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
                        <div>
                        <h1>Congratulations!!</h1>
                        <p className='completed-statement'>
                            You have successfully completed the test
                        </p>
                        <p>You scored {score} out of 10</p>
                        <p
                        style={{
                            color:"#0077b5"
                        }}
                        >{score >= 8 && "You Rocked it !"}</p>
                        <p
                         style={{
                            color:"#15202b"
                        }}
                        >{score < 8 && score >= 5 && "Fantastic! ,You can do better !"}</p>
                        <p
                         style={{
                            color:"#ad0c0c"
                        }}
                        >{score < 5 && "You need to work hard on your skills !"}</p>
                        <div className='btn-container'>
                        <div className="testmodal-result-button" onClick={()=>(setTestmodal(false))}>Return</div>
                        </div>
                    </div>
                    </div>

                )
            }
        </div>
      </div>
    </>
  );
};

export default Testmodal;
