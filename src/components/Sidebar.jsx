import React, { useEffect, useState ,useContext} from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { LoginContext } from "../context/LoginContext";
import AssistantRoundedIcon from "@mui/icons-material/AssistantRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { supabase } from "../backend/supabaseConfig";
import { ToastContainer, toast } from "react-toastify";

const Sidebar = () => {

  const { user,setUser } = useContext(LoginContext);
  const [activebutton, setActivebutton] = useState("feed");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Logged out  successfully !",{
        closeOnClick:   true,
        closeButton: false, 
      });
      setUser(null);
    }
  };
    

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
    },
    {
      name: "profile",
      icon: image,
    },
    {
      name: "add-post",
      icon: <PostAddIcon />,
    },
    {
      name: "chat",
      icon: <ChatBubbleRoundedIcon />,
    },
    {
      name: "resume",
      icon: <FeedRoundedIcon />,
    },
    {
      name: "tests",
      icon: <QuizRoundedIcon />,
    },
    {
      name: "bookmarks",
      icon: <CollectionsBookmarkRoundedIcon />,
    },
  ];

  return (
    <>
      <div className="sidebar-container" >
        {/* profile section */}
        <div className="sidebar-profile-section">
          <div classname="profile-image">
          <img
            src={user?.avatar}
            alt=""
            border="0"
            style={{ width: "60px", height: "60px", borderRadius: "50px" }}
          ></img>
          </div>
          <div className="profile">
          <p className="user-name"> {user?.name}</p>
          <p className="user-desc">Software Engineer  </p>
          </div>
         
        </div>

        {/* sidebar options */}
        <div className="sidebar-options-section">
          {sidebarOptions.map((option) => (
            <Link
              to={option.name}
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => setActivebutton(option.name)}
            >
              <div
                className="sidebar-options"
                style={{
                  backgroundColor:
                    activebutton === option.name ? "#e9e9e9" : "white",
                  color: activebutton === option.name ? "#0077b5" : "#000",
                  borderLeft:
                    activebutton === option.name ? "4px solid #0077b5" : "none",
                  transform:
                    activebutton === option.name ? "scale(1.04)" : "none",
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
          <button className="logout-button"
           onClick={handleLogout}
          >Logout</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Sidebar;
