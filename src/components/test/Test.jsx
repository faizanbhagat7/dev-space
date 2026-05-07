import React, { useContext, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import { Link } from "react-router-dom";
import './Test.css';

const difficulties = [
  { level: "easy", label: "Beginner", desc: "Fundamentals & basics", color: "var(--green-code)" },
  { level: "medium", label: "Intermediate", desc: "Core concepts & patterns", color: "var(--yellow)" },
  { level: "hard", label: "Expert", desc: "Advanced & tricky", color: "var(--magenta)" },
];

const Test = () => {
  const { setActivebutton } = useContext(LoginContext);
  useEffect(() => { setActivebutton("tests"); }, []);

  return (
    <div className="test-container">
      <div className="test-header"><p>run quiz.exe</p></div>
      <div className="test-body">
        <p>Select difficulty level</p>
        <div className="test-body-catagory">
          {difficulties.map(({ level, label, desc }) => (
            <Link key={level} to={level} style={{ textDecoration: "none" }}>
              <div className="test-body-catagory-item">
                <span>{label} — <span style={{opacity:0.6,fontSize:12}}>{desc}</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Test;
