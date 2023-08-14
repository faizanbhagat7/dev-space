import React, { useState, useEffect ,useContext} from "react";
import "./settings.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate ,Link} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(LoginContext);

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


            <div className="settings-logout-container" 
            onClick={() => {
              // supabase.auth.signOut();
              // setUser(null);
              // navigate("/");
            }}>
              <div className='settings-logout'>
             <div className='logout-icon-container'>
             <LogoutIcon className="logout-icon"/> 
             </div>

             <div className="logout-text-container">
              <p>Log Out from Account</p>
             </div> 
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Settings;
