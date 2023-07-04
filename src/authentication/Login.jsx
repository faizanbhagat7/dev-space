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

        

  return (
    <>
        <div> 
            <div>
                <h1>Login</h1>
                <form onSubmit={handleLogin}> 
                    <label >Email</label><br />
                    <input type="email" value={email} onChange={(event)=>{setEmail(event.target.value)}}/> <br /><br />
                    <label>Password</label> <br />
                    <input type="password" value={password} onChange={(event)=>{setPassword(event.target.value)}}/> <br /><br />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Login