import React, { useState, useffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import "./form.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("All Fields Must Be Filled !", {
        position: "top-center",
        autoClose: 1500,
        borderRadius: 20,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false
     });
    } else {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long !", {
          position: "top-center",
          autoClose: 1500,
          borderRadius: 20,
          hideProgressBar: true,
          closeOnClick: true,
          closeButton: false
       });
      } else {
      }
      supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then((data) => {
          navigate("/");
          toast.success("Logged In Successfully !", {
            position: "top-center",
            autoClose: 1500,
            borderRadius: 20,
            hideProgressBar: true,
            closeOnClick: true,
            closeButton: false
          });
        })
        .catch((error) => {
          toast.error(error?.message, {
            position: "top-center",
            autoClose: 1500,
            borderRadius: 20,
            hideProgressBar: true,
            closeOnClick: true,
            closeButton: false
         });
        });
    }
  };

  return (
    <>
      <div className="main-body">
        <div className="container">
          <div className="banner-section">
            <p className="tagline">Empowering the developer community 🚀</p>
          </div>
          <div className="form-section">
            <p className="form-title">Login to Your Account</p>
            <form onSubmit={handleLogin}>
              <p className="input-label">Email</p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <p className="input-label">Password</p>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
            <p className="login-link">
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
