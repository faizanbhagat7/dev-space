// R9Oh5HpQNXaiy9wIG30Ki3wmOFXKunL4VMBPlNpE ==> API KEY QUIZAPI.IO
import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import axios from "axios";
import { Link } from "react-router-dom";
import './Test.css'

const Test = () => {
  const { activebutton, user, setActivebutton ,
    darkMode
  } = useContext(LoginContext);
  
  useEffect(() => {
    setActivebutton("tests");
  }, []);



  return (
    <>
      <div className="test-container">
        <div className="test-header"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : "#fff",
            color: darkMode ? "#fff" : "#1f1f1f",
          }}
        >
          <p>Check your Technical skills</p>
        </div>
        <div className="test-body"
        style={{
          backgroundColor: darkMode ? "#1f1f1f" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
        >
          <p>Select Difficulty level</p>
          <div className="test-body-catagory">
            <Link to="easy" style={{textDecoration:"none",color:"black"}}>
              <div className="test-body-catagory-item">Beginner</div>
            </Link>

            <Link to="medium" style={{textDecoration:"none",color:"black"}}>
              <div className="test-body-catagory-item">intermediate</div>
            </Link>

            <Link to="hard" style={{textDecoration:"none",color:"black"}}>
              <div className="test-body-catagory-item">Expert</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
