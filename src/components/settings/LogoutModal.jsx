import React,{useState,useEffect,useContext} from "react";
import "./logoutmodal.css";
import { supabase } from "../../backend/supabaseConfig";
import {LoginContext} from "../../context/LoginContext";
import {useNavigate} from "react-router-dom";


const LogoutModal = ({ setShowLogoutModal }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(LoginContext);
    const Logout =  () => {
         supabase.auth.signOut();
         setUser(null);
         navigate("/");
        }

  return (
    <>
      <div className="logout-modal">
        <div className="logout-modal-content">
          <div className="logout-modal-header">
            <p>Log Out from account</p>
          </div>
          <div className="logout-modal-body">
            <p>Are you sure you want to Log Out from account <span
            style={{fontWeight:"bold",
            color:"#1a73e8",
            fontFamily:'applesystem, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
            >{ user?.name }</span> ?</p>
          </div>
          <div className="logout-modal-footer">
            <button
              className="logout-modal-button-cancel"
              onClick={()=>
                setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button
              className="logout-modal-button-delete"
              onClick={() => {
                Logout();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
