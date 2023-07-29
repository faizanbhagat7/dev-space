import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Body from "./Body";

const Resumebody = () => {
  const { activebutton, user, setActivebutton } = useContext(LoginContext);
  useEffect(() => {
    setActivebutton("create resume");
  }, []);

  return (
    <>
      <div className="resume-container-main" style={
        {
          width: "100%",
          height:"100vh",
          overflow:'scroll',
          margin: "0 ",
        }
      }>
        <Body />
      </div>
    </>
  );
};

export default Resumebody;
