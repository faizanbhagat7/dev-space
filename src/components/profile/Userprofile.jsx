import React from "react";
import "./Userprofile.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route ,useNavigate} from "react-router-dom";
import Editprofilemodal from "./Editprofilemodal";

const Userprofile = () => {
  const { user, setUser } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="image-section">
            <div className="profile-image">
              <img src={user?.avatar} alt="" />
            </div>
          </div>
          <div className="profile-details">
            <div className="description">
              <div className="user-name">{user?.name}</div>
              <div className="user-description">{user?.description}</div>
            </div>
            <div className="profile-connections">
              <div className="followers">
                followers <br /> 10
              </div>
              <div className="following">
                following <br /> 8
              </div>
              <div className="post-count">
                posts <br /> 3
              </div>
            </div>
          </div>
        </div>
        <div className="edit-profile-section">
          <button
            className="edit-profile-button"
            onClick={() => setShowModal(true)}
          >
            Edit Profile
          </button>
        </div>

      {/* logout button */}
        {/* <div className="logout-section"> */}
          <button
            className="logout-button-mobile"
            onClick={() => {
              supabase.auth.signOut();
              setUser(null);
              navigate("/");
            }}
          >
            Logout
          </button>
        {/* </div> */}


        <div className="profile-footer">
          <div className="skills">
            <div className="skills-header">Skills</div>
            <div className="skills-list">
             {user?.skills ? user?.skills : "No skills added"}
            </div>
          </div>
          <div className="achievements">
            <Link
              to={"/achievements/" + user?.id}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p className="achievements-header"> Achievements</p>
              <p className="achievements-count">
                5 Certifications achieved by {user?.name}
              </p>
            </Link>
          </div>
          <div className="feed">
            <Link
              to={"/feed/" + user?.id}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p className="feed-header">Feed</p>
              <p className="feed-count">3 posts by {user?.name}</p>
            </Link>
          </div>
        </div>
      </div>
      {showModal ? <Editprofilemodal setShowModal={setShowModal} /> : null}
    </>
  );
};

export default Userprofile;
