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
import Achievement from "./components/achievement/Achievement";
import Users from "./components/search/Users";
import Feed from "./components/feed/Feed";
import Addpost from "./components/addpost/Addpost";
import Chat from "./components/chat/Chat";
import Resume from "./components/resume/Resume";
import Test from "./components/test/Test";
import Bookmark from "./components/bookmark/Bookmark";
import Certificateviewer from "./components/achievement/Certificateviewer";
import { useParams } from "react-router-dom";

const Homepage = () => {
  const Session = useSession();
  const { user, setUser, fetchUserProfile, activebutton, setActivebutton } =
    useContext(LoginContext);
  const { profileId, certificateId } = useParams();

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
            <Route path="/" element={<Feed />} />
            <Route path={`/profile/:profileId`} element={<Userprofile />} />
            <Route path="/search" element={<Users />} />
            <Route path="/add-post" element={<Addpost />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/tests" element={<Test />} />
            <Route path="/bookmarks" element={<Bookmark />} />
            <Route
              path={`/achievements/:profileId`}
              element={<Achievement />}
            />
            <Route path={`/feed/:profileId`} element={<h1>feed</h1>} />
            <Route
              path={`view-certificate/:certificateId`}
              element={<Certificateviewer />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Homepage;
