import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import { LoginContext } from "../context/LoginContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { darkMode} = useContext(LoginContext);
  const Session = useSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!username || !email || !password) {
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
      supabase.auth
        .signUp({
          email: email,
          password: password,
        })
        .then((data) => {
          supabase
            .from("profiles")
            .insert({
              id: data.data.user.id,
              name: username,
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPZNFpkJSy6LmJ9T9pg7QXLlU-eLWyblScCc1qaDXORkI5fqoQ9-AigZxvBjWjM_J_eEE&usqp=CAU",
            })
            .then((data) => {
              navigate("/");
              setUsername("");
              setEmail("");
              setPassword("");
            })
            .catch((error) => {
              toast.error(error?.message, {
                position: "top-center",
                autoClose: 1500,
                borderRadius: 20,
                hideProgressBar: true,
                closeOnClick: true,
                closeButton: false,
              });
            });
        })
        .catch((error) => {
          toast.error(error?.message, {
            position: "top-center",
            autoClose: 1500,
            borderRadius: 20,
            hideProgressBar: true,
            closeOnClick: true,
            closeButton: false,
          });
        });
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
            >
              Connect with Developers across the globe 🌏
            </p>
          </div>
          <div className="form-section">
            <p className="form-title"
              style={{
                color: darkMode ? "#fff" : "#000",
              }}
              
            >Create a new Account</p>
            <form onSubmit={handleRegister}>
              <p className="input-label"
                style={{
                  color: darkMode ? "#fff" : "#15202b",
                }}
              >User name</p>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
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
                Create Account
              </button>
            </form>
            <p className="login-link"
              style={{
                color: darkMode && "#fff",
              }}
            >
              Already have an account ? &nbsp;
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="login-link-text">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
