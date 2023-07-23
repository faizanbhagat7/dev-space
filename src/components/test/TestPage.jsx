import React, { useState, useEffect, useContext } from "react";
import "./Testpage.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Testmodal from "./Testmodal";
import { LoginContext } from "../../context/LoginContext";


const TestPage = () => {
  const { difficultyLevel } = useParams();
  const navigate = useNavigate();
  const {  setActivebutton } = useContext(LoginContext);
  const [questions, setQuestions] = useState([]);
  const [testmodal, setTestmodal] = useState(false);

  const changeDifficulty = () => {
    navigate("/tests");
  };

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(
        `https://quizapi.io/api/v1/questions?apiKey=R9Oh5HpQNXaiy9wIG30Ki3wmOFXKunL4VMBPlNpE&limit=10&catagory=all&difficulty=${difficultyLevel}`
      );
      setQuestions(data);
    } catch (error) {
      navigate("/tests");
    }
  };

  useEffect(() => {
    setActivebutton("tests");
    fetchQuestions();
  }, [difficultyLevel]);



  return (
    <>
      <div className="testpage-container">
        <div className="testpage-body">
          <div className="testpage-title">
            <p>{difficultyLevel} level test</p>
          </div>
          <div className="test-rules">
            <p>Points to remember</p>
            <ul>
              <li>You will be given 10 questions</li>
              <li>Each question carries 1 point</li>
              <li>
                You can unlock the next question only if you answer the current
                question
              </li>
              <li>Once you answer a question you cannot go back to it</li>
              <li>Once you select an answer, it cannot be changed</li>
            </ul>
          </div>

          <div className="testpage-buttons">
            <div className="testpage-button-start"
              onClick={()=>(setTestmodal(true))}
            >Start Test</div>
            <div className="testpage-button-change" onClick={changeDifficulty}>
              Change difficulty
            </div>
          </div>
        </div>
      </div>

      {/* test modal */}
      {testmodal && questions.length !== 0 && <Testmodal setTestmodal={setTestmodal} questions={questions}/>}
      
    </>
  );
};

export default TestPage;
