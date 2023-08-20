import React, { useState, useffect ,useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import "./form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {LoginContext} from "../context/LoginContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { darkMode} = useContext(LoginContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("All Fields Must Be Filled !", {
        position: "top-center",
        autoClose: 1500,
        borderRadius: 20,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false,
      });
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long !", {
        position: "top-center",
        autoClose: 1500,
        borderRadius: 20,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false,
      });
      return;
    } else {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 1500,
          borderRadius: 20,
          hideProgressBar: true,
          closeOnClick: true,
          closeButton: false,
        });
      } else {
        navigate("/");
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <>
      <div className="main-body">
        <div className="container"
          style={{
            backgroundColor: darkMode ? "#1F1F1F" : "#fff",
            color: darkMode ? "#fff" : "#000",
            boxShadow: darkMode ? "0px 0px 10px #fff" : "0px 0px 10px #000",
          }}
        >
          <div className="banner-section">
            <p className="tagline"
                style={{
                  textShadow: darkMode ? "0px 0px 10px #000" : "0px 0px 10px wheat",                
                  }}
            >Empowering the developer community 🚀</p>
          </div>
          <div className="form-section">
            <p className="form-title"
             style={{
              color: darkMode ? "#fff" : "#000",
            }}
            
            >Login to Your Account</p>
            <form onSubmit={handleLogin}>
              <p className="input-label"
               style={{
                color: darkMode ? "#fff" : "#15202b",
              }}
              >Email</p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-field"
                style={{
                  color: darkMode && "#fff",
                  backgroundColor: darkMode && "#15202b",                  
                }}
              />
              <p className="input-label"
               style={{
                color: darkMode ? "#fff" : "#15202b",
              }}
              >Password</p>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-field"
                style={{
                  color: darkMode && "#fff",
                  backgroundColor: darkMode && "#15202b",                  
                }}
              />
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
            <p className="login-link"
            style={{
              color: darkMode && "#fff",
            }}
            >
              Don't have an Account ? &nbsp;
              <Link to="/register" style={{ textDecoration: "none" }}>
                <span className="login-link-text">Register</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
