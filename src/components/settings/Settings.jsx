import React, { useState, useEffect ,useContext} from "react";
import "./settings.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate ,Link} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutModal from "./LogoutModal";
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';

const Settings = () => {
  const { user } = useContext(LoginContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  console.log(showLogoutModal)
  return (
    <>
      <div className="settings-container">
        <div className="settings-header">
          <p>Settings</p>
        </div>
        <div className="settings-content">

            {/* bookmarks */}
          <Link
            to={`/bookmarks/${user?.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
        <div className="bookmarks">
            <div className="bookmarks-icon-container">
              <BookmarksIcon className="bookmarks-icon" />
            </div>
            <div className="bookmarks-title">
              <p>Bookmarks</p>
            </div>
        </div>
          </Link>

          {/* create resume  */}
          <Link
            to={`/resume`}
            style={{ textDecoration: "none", color: "black" }}
          >
        <div className="bookmarks">
            <div className="bookmarks-icon-container">
              <FeedRoundedIcon className="bookmarks-icon" />
            </div>
            <div className="bookmarks-title">
              <p>Generate Resume</p>
            </div>
        </div>
          </Link>

            {/* test section  */}
            <Link
            to={`/tests`}
            style={{ textDecoration: "none", color: "black" }}
          >
        <div className="bookmarks">
            <div className="bookmarks-icon-container">
              <QuizRoundedIcon className="bookmarks-icon" />
            </div>
            <div className="bookmarks-title">
              <p>Check technical skills</p>
            </div>
        </div>
          </Link>

            {/* Logout */}
            <div className="settings-logout-container" 
            onClick={()=>setShowLogoutModal(true)}>
              <div className='settings-logout'>
             <div className='logout-icon-container'>
             <LogoutIcon className="logout-icon"/> 
             </div>

             <div className="logout-text-container">
              <p>Log Out from Account</p>
             </div> 
             </div>
            </div>
            
            {/* Logout Modal */}
            {showLogoutModal && (
              <LogoutModal setShowLogoutModal={setShowLogoutModal} />
            )}


        </div>
      </div>
    </>
  );
};

export default Settings;
