import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Loader from '../loader/Loader'

const Feed = () => {
  const { activebutton, setActivebutton } = useContext(LoginContext);

  useEffect(() => {
    setActivebutton("feed");
  }, []);

  return (
    <>
       <h1> Application feed </h1> 
 
    </>
  );
};

export default Feed;
