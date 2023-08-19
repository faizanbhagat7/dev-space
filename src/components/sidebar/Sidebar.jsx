import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { LoginContext } from "../../context/LoginContext";
import AssistantRoundedIcon from "@mui/icons-material/AssistantRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { supabase } from "../../backend/supabaseConfig";
import { ToastContainer, toast } from "react-toastify";
import LogoutModal from "../settings/LogoutModal";

const Sidebar = () => {
  const { user, setUser, activebutton, setActivebutton } =
    useContext(LoginContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();


  // profile image of user
  const image = (
    <img
      src={user?.avatar}
      alt=""
      border="0"
      style={{ width: "30px", height: "30px", borderRadius: "50px" }}
    ></img>
  );

  const sidebarOptions = [
    {
      name: "feed",
      icon: <AssistantRoundedIcon />,
      url: "/feed",
    },

    {
      name: "search",
      icon: <PersonSearchIcon />,
      url: "/search",
    },
    {
      name: "add post",
      icon: <PostAddIcon />,
      url: "/add-post",
    },

    {
      name: "chat",
      icon: <ChatBubbleRoundedIcon />,
      url: `/chats/${user?.id}`,
    },
    {
      name: "profile",
      icon: image,
      url: `/profile/${user?.id}`,
    },
    // {
    //   name: "create resume",
    //   icon: <FeedRoundedIcon />,
    //   url: "/resume",
    // },
    // {
    //   name: "tests",
    //   icon: <QuizRoundedIcon />,
    //   url: "/tests",
    // },
    // {
    //   name: "bookmarks",
    //   icon: <CollectionsBookmarkRoundedIcon />,
    //   url: "/bookmarks",
    // },
  ];

  return (
    <>
      <div className="sidebar-container">
        {/* profile section */}
        <div className="sidebar-profile-section">
          <div classname="profile-image">
            <img
              src={user?.avatar}
              alt=""
              border="0"
              style={{ width: "60px", height: "60px", borderRadius: "10px" }}
            ></img>
          </div>
          <div className="profile">
            <p className="sidebar-user-name">{user?.name.substring(0, 13)}</p>
            <p className="sidebar-user-desc">{user?.description}</p>
          </div>
        </div>

        {/* sidebar options */}
        <div className="sidebar-options-section">
          {sidebarOptions.map((option) => (
            <Link
              to={option.url}
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => setActivebutton(option.name)}
            >
              <div
                className="sidebar-options"
                style={{
                  backgroundColor:
                    activebutton === option.name ? "#e9e9e9" : "white",
                  color: activebutton === option.name ? "#007fff" : "#000",
                  borderBottom:
                    activebutton === option.name ? "2px solid #007fff" : "none",
                  transition: "all 0.2s ease-in-out",
                  paddingBottom: "0px",
                  transition: "all 0.2s ease-in-out",
                  boxShadow:
                    activebutton === option.name
                      ? "0px 0px 5px 0px #007fff"
                      : "none",
                }}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-name">{option.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* logout buttton */}
        <div className="sidebar-logout-section">
          <button className="logout-button" onClick={()=>setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </div>
      {
        showLogoutModal &&(
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
        )
      }
      <ToastContainer />
    </>
  );
};

export default Sidebar;
