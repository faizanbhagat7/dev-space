import React, { useState, useEffect ,useContext} from "react";
import "./settings.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";

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
        
            <div className="settings-logout-container" 
            onClick={() => {
              supabase.auth.signOut();
              setUser(null);
              navigate("/");
            }}>
             <h1>Logout</h1>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
