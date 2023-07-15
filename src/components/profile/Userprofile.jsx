import React from "react";
import "./Userprofile.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route ,useNavigate, useParams} from "react-router-dom";
import Editprofilemodal from "./Editprofilemodal";


const Userprofile = () => {
  const { user, setUser ,activebutton, setActivebutton} = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const {profileId} = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [profileAchievementsCount, setProfileAchievementsCount] = useState('');

  
  const fetchDynamicUserProfile = async (profileId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", profileId)
      .single();
    if (error) {
      toast.error("Error fetching user profile");
      return;
    }
    setUserProfile(data);
    
  };

  useEffect(() => {
    if (profileId === user?.id) {
      setActivebutton("profile");
    }
    fetchDynamicUserProfile(profileId);
    profileAchievementsCountFunction(profileId);
    
  }, [profileId]);

  const profileAchievementsCountFunction = async (profileId) => {
    const { data, error } = await supabase
      .from("achievements")
      .select()
      .eq("author", profileId);
    if (!error) {
      setProfileAchievementsCount(data.length);
    }
  };

  if (!userProfile) {
    return <h1>Loading...</h1>;
  }


  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="image-section">
            <div className="profile-image">
              <img src={userProfile?.avatar} alt="" />
            </div>
          </div>
          <div className="profile-details">
            <div className="description">
              <div className="user-name">{userProfile?.name}</div>
              <div className="user-description">{userProfile?.description}</div>
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
      
      {
        user?.id === profileId && (
        <div className="edit-profile-section">
          <button
            className="edit-profile-button"
            onClick={() => setShowModal(true)}
          >
            Edit Profile
          </button>
        </div>
        )}
     
          
          {

        user?.id === profileId && ( 
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
        )}


        <div className="profile-footer">
          <div className="skills">
            <div className="skills-header">Skills</div>
            <div className="skills-list">
             {userProfile?.skills ? userProfile?.skills : "No skills added"}
            </div>
          </div>
          <div className="achievements">
            <Link
              to={"/achievements/" + profileId}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p className="achievements-header"> Achievements</p>
              <p className="achievements-count">
                {profileAchievementsCount} 
                {profileAchievementsCount === 1 ? " certification " : "  certifications "}
                 achieved by {userProfile?.name}
              </p>
            </Link>
          </div>
          <div className="feed">
            <Link
              to={"/feed/" + profileId}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p className="feed-header">Feed</p>
              <p className="feed-count">3 posts by {userProfile?.name}</p>
            </Link>
          </div>
        </div>
      </div>
      {showModal ? <Editprofilemodal setShowModal={setShowModal} 
      fetchDynamicUserProfile={fetchDynamicUserProfile} userProfile={userProfile}/> : null}
    </>
  );
};

export default Userprofile;
