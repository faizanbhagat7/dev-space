import React, { useState, useffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import "./form.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please fill all the fields");
    } else {
      if (!password.length < 6) {
        alert("Password should be atleast 6 characters long");
      } else {
      }
      supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then((data) => {
          navigate("/");
          alert("Logged in successfully");
        })
        .catch((error) => {
          alert(error);
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
    </>
  );
};

export default Login;
