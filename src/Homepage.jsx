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
import Resumebody from "./components/resume/Resumebody";
import Test from "./components/test/Test";
import Bookmark from "./components/bookmark/Bookmark";
import Certificateviewer from "./components/achievement/Certificateviewer";
import { useParams } from "react-router-dom";
import TestPage from "./components/test/TestPage";
import FollowersPage from "./components/profile/FollowersPage";
import FollowingPage from "./components/profile/FollowingPage";
import Loader from "./components/loader/Loader";
import Profilefeed from "./components/profile/Profilefeed";

const Homepage = () => {
  const Session = useSession();
  const {
    user,
    setUser,
    fetchUserProfile,
    activebutton,
    setActivebutton,
    recommendedUsers,
    fetchRecommendedUsers,
  } = useContext(LoginContext);
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
      toast.success("Welcome to the developers Community !} !", {
        closeOnClick: true,
        closeButton: false,
        position: "top-center",
        duration: 1000,
        hideProgressBar: true,
      });
      fetchUserProfile(Session);
    }
  }, [Session]);

  if (!user) {
    return (
      <>
        <Loader />
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
            <Route path="/resume" element={<Resumebody />} />
            <Route path="/tests" element={<Test />} />
            <Route path={`/bookmarks/:profileId`} element={<Bookmark />} />
            <Route
              path={`/achievements/:profileId`}
              element={<Achievement />}
            />
            <Route path={`/feed/:profileId`} element={<Profilefeed />} />
            <Route
              path={`view-certificate/:certificateId`}
              element={<Certificateviewer />}
            />
            <Route path={`/tests/:difficultyLevel`} element={<TestPage />} />

            <Route
              path={`/profile/:profileId/followers`}
              element={<FollowersPage />}
            />

            <Route
              path={`/profile/:profileId/following`}
              element={<FollowingPage />}
            />

            <Route path="*" element={<Feed />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Homepage;
