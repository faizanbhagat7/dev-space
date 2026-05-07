import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { LoginContext } from "../../context/LoginContext";
import AssistantRoundedIcon from "@mui/icons-material/AssistantRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { supabase } from "../../backend/supabaseConfig";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const { user, setUser, activebutton, setActivebutton } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Logged out successfully!", { closeOnClick: true, closeButton: false });
      setUser(null);
      navigate("/");
    }
  };

  const sidebarOptions = [
    { name: "feed", icon: <AssistantRoundedIcon />, url: "/feed" },
    { name: "add post", icon: <PostAddIcon />, url: "/add-post" },
    { name: "profile", icon: user?.avatar
        ? <img src={user.avatar} alt="" style={{width:20,height:20,borderRadius:'50%',objectFit:'cover'}} />
        : <span style={{width:20,height:20,borderRadius:'50%',background:'var(--magenta)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:700}}>{user?.name?.[0]?.toUpperCase()}</span>,
      url: `/profile/${user?.id}` },
    { name: "search", icon: <PersonSearchIcon />, url: "/search" },
    { name: "chat", icon: <ChatBubbleRoundedIcon />, url: `/chats/${user?.id}` },
    { name: "create resume", icon: <FeedRoundedIcon />, url: "/resume" },
    { name: "tests", icon: <QuizRoundedIcon />, url: "/tests" },
  ];

  return (
    <>
      <div className="sidebar-container">
        <div className="sidebar-profile-section">
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" />
            : <div style={{width:42,height:42,borderRadius:6,background:'var(--magenta)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff',fontWeight:700,flexShrink:0}}>{user?.name?.[0]?.toUpperCase()}</div>
          }
          <div className="profile">
            <p className="sidebar-user-name">{user?.name?.substring(0, 16)}</p>
            <p className="sidebar-user-desc">// {user?.description?.substring(0,22) || 'developer'}</p>
          </div>
        </div>

        <div className="sidebar-section-label">// navigation</div>

        <div className="sidebar-options-section">
          {sidebarOptions.map((option) => (
            <Link
              key={option.name}
              to={option.url}
              style={{ textDecoration: "none" }}
              onClick={() => setActivebutton(option.name)}
            >
              <div className={`sidebar-options${activebutton === option.name ? " active" : ""}`}>
                <div className="option-icon">{option.icon}</div>
                <div className="option-name">{option.name}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sidebar-logout-section">
          <button className="logout-button" onClick={handleLogout}>
            $ logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Sidebar;
