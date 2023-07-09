import React, { useState, useEffect, useContext } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "./backend/supabaseConfig";
import { LoginContext } from "./context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route } from "react-router-dom";
import "./homepage.css";
import Sidebar from "./components/sidebar/Sidebar";
import Userprofile from "./components/profile/Userprofile";


const Homepage = () => {
  const Session = useSession();
  const { user, setUser , fetchUserProfile} = useContext(LoginContext);


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

  // const fetchUserProfile = async (Session) => {
  //   const { data, error } = await supabase
  //     .from("profiles")
  //     .select()
  //     .eq("id", Session.user.id);
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     setUser(data[0]);
  //   }
  // };

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
          <Routes>
            <Route path="/profile" element={<Userprofile />} />
            <Route path="/feed"  element={<h1>feed</h1>} />
            <Route path="/chat" element={<h1>chat</h1>} />
            <Route path="/resume" element={<h1>resume</h1>} />
            <Route path="/tests" element={<h1>tests</h1>} />
            <Route path={`/achievements/:id`}
             element={<h1>achievements</h1>} />
             <Route path={`/feed/:id`}
              element={<h1>feed</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Homepage;
