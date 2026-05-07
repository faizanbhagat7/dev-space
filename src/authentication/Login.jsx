import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../backend/supabaseConfig";
import "./form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("All fields required", { position: "top-center", autoClose: 1500, hideProgressBar: true, closeOnClick: true, closeButton: false });
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be 6+ characters", { position: "top-center", autoClose: 1500, hideProgressBar: true, closeOnClick: true, closeButton: false });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, closeButton: false });
    } else {
      navigate("/");
      setEmail(""); setPassword("");
    }
  };

  return (
    <>
      <div className="main-body">
        <div className="container">
          <div className="banner-section">
            <div className="banner-logo">dev<span>_</span>space</div>
            <p className="tagline">// where developers<br />// connect + grow<br />// together</p>
            <div className="banner-tags">
              <span className="banner-tag">#open_source</span>
              <span className="banner-tag">#devs</span>
              <span className="banner-tag">#community</span>
              <span className="banner-tag">#code</span>
            </div>
          </div>
          <div className="form-section">
            <p className="form-title">Welcome back</p>
            <form onSubmit={handleLogin}>
              <label className="input-label">email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              <label className="input-label">password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              <button type="submit" className="submit-button" disabled={loading}>
                <span>{loading ? "logging in..." : "Login →"}</span>
              </button>
            </form>
            <p className="login-link">
              No account?&nbsp;
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
