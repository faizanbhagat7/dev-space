import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import { LoginContext } from "../context/LoginContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import "./form.css";

const Register = () => {
  const { user, setUser, session, setSession } = useContext(LoginContext);
  const Session = useSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    if(!username || !email || !password){
      alert("Please fill all the fields")
    }
    else{
      if(!password.length < 6){
        alert("Password should be atleast 6 characters long")
      }
      else{
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
            alert("User created successfully");
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
    }
  }
  };

  return (
    <>
      <div className="main-body">
        <div className="container">
          <div className="banner-section">
            <p className="tagline">
              Connect with Developers across the globe 🌏
            </p>
          </div>
          <div className="form-section">
            <p className="form-title">Create a new Account</p>
            <form onSubmit={handleRegister}>
              <p className="input-label">User name</p>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
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
                Create Account
              </button>
            </form>
            <p className="login-link">
              Already have an account ? &nbsp;
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="login-link-text">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
