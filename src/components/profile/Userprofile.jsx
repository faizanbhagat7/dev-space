import React from "react";
import "./Userprofile.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route, useNavigate, useParams } from "react-router-dom";
import Editprofilemodal from "./Editprofilemodal";
import { useSession } from "@supabase/auth-helpers-react";
import Loader from "../loader/Loader";

const Userprofile = () => {
  const { user, setUser, activebutton, setActivebutton, fetchUserProfile } =
    useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [profileAchievementsCount, setProfileAchievementsCount] = useState("");
  const [isfollowing, setIsfollowing] = useState(null);
  const [profileFeedCount, setProfileFeedCount] = useState(0);
  const Session = useSession();

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

  // follow and unfollow functionality
  const checkIsFollowing = async (profileId) => {
    setIsfollowing(false);
    {
      user?.following?.forEach((element) => {
        if (element === profileId) {
          setIsfollowing(true);
          return;
        }
      });
    }
  };

  const followUser = async (profileId) => {
    let newFollowingList = [];
    if (user?.following === null || user?.following === []) {
      newFollowingList = [profileId];
    } else {
      newFollowingList = [...user?.following, profileId];
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        following: newFollowingList,
      })
      .eq("id", user?.id);

    if (error) {
      // console.log(error);
      return;
    } else {
      let newFollowersList = [];
      if (userProfile?.followers === null || userProfile?.followers === []) {
        newFollowersList = [user?.id];
      } else {
        newFollowersList = [...userProfile?.followers, user?.id];
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          followers: newFollowersList,
        })
        .eq("id", profileId);

      if (error) {
        // console.log(error);
        return;
      } else {
        setIsfollowing(true);
        fetchDynamicUserProfile(profileId);
        fetchUserProfile(Session);
      }
    }
  };

  const unfollowUser = async (profileId) => {
    const newList = user?.following?.filter((item) => item !== userProfile?.id);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        following: newList,
      })
      .eq("id", user?.id);

    if (error) {
      // console.log(error);
      return;
    } else {
      const newList = userProfile?.followers?.filter(
        (item) => item !== user?.id
      );
      const { data, error } = await supabase
        .from("profiles")
        .update({
          followers: newList,
        })
        .eq("id", profileId);

      if (error) {
        // console.log(error);
        return;
      } else {
        setIsfollowing(false);

        fetchDynamicUserProfile(profileId);
        fetchUserProfile(Session);
      }
    }
  };

  const handleFollows = async (profileId) => {
    if (isfollowing === true) {
      unfollowUser(profileId);
    } else {
      followUser(profileId);
    }
  };

  const profileAchievementsCountFunction = async (profileId) => {
    const { data, error } = await supabase
      .from("achievements")
      .select()
      .eq("author", profileId);
    if (!error) {
      setProfileAchievementsCount(data.length);
    }
  };

  const profileFeedCountFunction = async (profileId) => {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("author", profileId);
    if (!error) {
      setProfileFeedCount(data.length);
    }
  };

  useEffect(() => {
    if (profileId === user?.id) {
      setActivebutton("profile");
    } else {
      setActivebutton("");
      checkIsFollowing(profileId);
    }
    fetchDynamicUserProfile(profileId);
    profileAchievementsCountFunction(profileId);
    profileFeedCountFunction(profileId);
  }, [profileId]);

  if (!userProfile) {
    return <Loader />;
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
              <Link
                to={"/feed/" + profileId}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="post-count">
                  Feed <br /> {profileFeedCount}
                </div>
              </Link>
              <Link
                to={"followers"}
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                <div className="followers">
                  followers <br />{" "}
                  {userProfile?.followers !== null
                    ? userProfile?.followers?.length
                    : 0}
                </div>
              </Link>

              <Link
                to={"following"}
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                <div className="following">
                  following <br />{" "}
                  {userProfile?.following !== null
                    ? userProfile?.following?.length
                    : 0}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {user?.id === profileId ? (
          <div className="edit-profile-section">
            <button
              className="edit-profile-button"
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="mobile-follow-section">
            <div
              className={`profile-follow-section-${
                isfollowing ? "following" : "notfollowing"
              }`}
            >
              <button
                className="profile-follow-button"
                onClick={() => handleFollows(profileId)}
                style={{
                  backgroundColor: isfollowing ? "gray" : "#1a73e8",
                  boxShadow: isfollowing ? "0px 0px 5px 0px black" : "",
                  border: isfollowing ? "1px solid gray" : "1px solid #1a73e8",
                }}
              >
                {isfollowing === true ? <p>Following</p> : <p>Follow</p>}
              </button>
              {isfollowing === true && (
                <button
                  className="profile-message-button"
                  onClick={() => {
                    navigate("/chats/" + profileId);
                  }}
                  style={{
                    backgroundColor: "#1a73e8",
                    boxShadow: "0px 0px 5px 0px black",
                    border: "1px solid #1a73e8",
                  }}
                >
                  Message
                </button>
              )}
            </div>
          </div>
        )}
        {user?.id === profileId && (
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
                {profileAchievementsCount === 1
                  ? " certification "
                  : "  certifications "}
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
              <p className="feed-count">
                {profileFeedCount <= 1
                  ? profileFeedCount + " post "
                  : profileFeedCount + " posts "}
                from {userProfile?.name}
              </p>
            </Link>
          </div>
        </div>
      </div>
      {showModal ? (
        <Editprofilemodal
          setShowModal={setShowModal}
          fetchDynamicUserProfile={fetchDynamicUserProfile}
          userProfile={userProfile}
        />
      ) : null}
    </>
  );
};

export default Userprofile;
