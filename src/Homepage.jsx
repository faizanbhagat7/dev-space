import React, { useState, useEffect, useContext } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "./backend/supabaseConfig";
import { LoginContext } from "./context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route } from "react-router-dom";
import "./homepage.css";
import Sidebar from "./components/Sidebar";

const Homepage = () => {
  const Session = useSession();
  const { user, setUser } = useContext(LoginContext);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Logged out  successfully !");
      setUser(null);
    }
  };

  useEffect(() => {
    if (!user || user.id !== Session.user.id) {
      fetchUserProfile(Session);
    }
  }, [Session]);

  const fetchUserProfile = async (Session) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", Session.user.id);
    if (error) {
      console.log(error);
    } else {
      setUser(data[0]);
    }
  };

  if (!user) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }
  return (
    <>
      <div className="main">
        <div className="sidebar">
          <Sidebar />
        </div>

        <div className="content">
          <h1>Home</h1>
          <h2>Welcome {user.name}</h2>
          <button onClick={handleLogout}>LogOut</button>
          <Routes>
            <Route path="/profile" element={<h1>Profile</h1>} />
            <Route path="/feed"  element={<h1>feed</h1>} />
            <Route path="/chat" element={<h1>chat</h1>} />
            <Route path="/resume" element={<h1>resume</h1>} />
            <Route path="/tests" element={<h1>tests</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Homepage;
