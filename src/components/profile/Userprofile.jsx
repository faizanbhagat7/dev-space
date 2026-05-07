import React from "react";
import "./Userprofile.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import Editprofilemodal from "./Editprofilemodal";
import { useSession } from "@supabase/auth-helpers-react";
import Loader from "../loader/Loader";
import SettingsIcon from "@mui/icons-material/Settings";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

const Userprofile = () => {
  const { user, setUser, setActivebutton, fetchUserProfile } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [isfollowing, setIsfollowing] = useState(false);
  const Session = useSession();

  const fetchDynamicUserProfile = async (id) => {
    const { data, error } = await supabase.from("profiles").select().eq("id", id).single();
    if (error) { toast.error("Error fetching profile"); return; }
    setUserProfile(data);
  };

  const checkIsFollowing = (id) => {
    const following = Array.isArray(user?.following) ? user.following : [];
    setIsfollowing(following.includes(id));
  };

  const followUser = async (id) => {
    const following = Array.isArray(user?.following) ? user.following : [];
    const newFollowing = [...following, id];
    await supabase.from("profiles").update({ following: newFollowing }).eq("id", user?.id);
    const followers = Array.isArray(userProfile?.followers) ? userProfile.followers : [];
    await supabase.from("profiles").update({ followers: [...followers, user?.id] }).eq("id", id);
    setIsfollowing(true);
    fetchDynamicUserProfile(id);
    fetchUserProfile(Session);
  };

  const unfollowUser = async (id) => {
    const following = Array.isArray(user?.following) ? user.following : [];
    await supabase.from("profiles").update({ following: following.filter(i => i !== id) }).eq("id", user?.id);
    const followers = Array.isArray(userProfile?.followers) ? userProfile.followers : [];
    await supabase.from("profiles").update({ followers: followers.filter(i => i !== user?.id) }).eq("id", id);
    setIsfollowing(false);
    fetchDynamicUserProfile(id);
    fetchUserProfile(Session);
  };

  useEffect(() => {
    if (profileId === user?.id) setActivebutton("profile");
    else { setActivebutton(""); checkIsFollowing(profileId); }
    fetchDynamicUserProfile(profileId);
    supabase.from("achievements").select().eq("author", profileId).then(({ data }) => data && setAchievementsCount(data.length));
    supabase.from("posts").select().eq("author", profileId).then(({ data }) => data && setFeedCount(data.length));
  }, [profileId]);

  if (!userProfile) return <Loader />;

  const avatar = userProfile?.avatar || userProfile?.image;
  const followers = Array.isArray(userProfile?.followers) ? userProfile.followers.length : 0;
  const following = Array.isArray(userProfile?.following) ? userProfile.following.length : 0;

  return (
    <>
      <div className="profile-container">
        <div className="profile-header animate-fade">
          <div className="image-section">
            <div className="profile-image">
              {avatar
                ? <img src={avatar} alt={userProfile?.name} />
                : <div style={{width:'100%',height:'100%',background:'var(--black)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:800,color:'var(--cream)',fontFamily:'var(--font-display)'}}>{userProfile?.name?.[0]?.toUpperCase()}</div>
              }
            </div>
          </div>
          <div className="profile-details">
            <div>
              <div className="user-name">{userProfile?.name}</div>
              <div className="user-description">{userProfile?.description || "developer"}</div>
            </div>
            <div className="profile-connections">
              <Link to={"/feed/" + profileId} style={{ textDecoration: "none" }}>
                <div className="post-count">
                  <strong>{feedCount}</strong>
                  <span>posts</span>
                </div>
              </Link>
              <Link to="followers" style={{ textDecoration: "none" }}>
                <div className="followers">
                  <strong>{followers}</strong>
                  <span>followers</span>
                </div>
              </Link>
              <Link to="following" style={{ textDecoration: "none" }}>
                <div className="following">
                  <strong>{following}</strong>
                  <span>following</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {user?.id === profileId ? (
          <div className="edit-settings-container animate-fade stagger-2">
            <div className="edit-profile-section">
              <button className="edit-profile-button" onClick={() => setShowModal(true)}>
                <EditCalendarIcon fontSize="small" /> Edit Profile
              </button>
            </div>
            <div className="profile-settings-section">
              <button className="edit-profile-button" onClick={() => navigate(`/settings/${profileId}`)}>
                <SettingsIcon fontSize="small" /> Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="mobile-follow-section animate-fade stagger-2">
            <button className="profile-follow-button" onClick={() => isfollowing ? unfollowUser(profileId) : followUser(profileId)}
              style={{ background: isfollowing ? "var(--text-muted)" : "var(--black)" }}>
              {isfollowing ? "Following" : "Follow"}
            </button>
            {isfollowing && (
              <button className="profile-message-button" onClick={() => navigate(`/messagechannel/${profileId}`)}>
                Message
              </button>
            )}
          </div>
        )}

        <div className="profile-footer">
          <div className="skills animate-fade stagger-3">
            <div className="skills-header">skills</div>
            <div className="skills-list">{userProfile?.skills || "No skills listed yet"}</div>
          </div>
          <Link to={"/achievements/" + profileId} style={{ textDecoration: "none" }}>
            <div className="achievements animate-fade stagger-4">
              <div className="achievements-header">achievements</div>
              <div className="achievements-count">{achievementsCount} certification{achievementsCount !== 1 ? "s" : ""} from {userProfile?.name}</div>
            </div>
          </Link>
          <Link to={"/feed/" + profileId} style={{ textDecoration: "none" }}>
            <div className="feed animate-fade stagger-5">
              <div className="feed-header">posts</div>
              <div className="feed-count">{feedCount} post{feedCount !== 1 ? "s" : ""} from {userProfile?.name}</div>
            </div>
          </Link>
        </div>
      </div>

      {showModal && (
        <Editprofilemodal
          setShowModal={setShowModal}
          fetchDynamicUserProfile={fetchDynamicUserProfile}
          userProfile={userProfile}
        />
      )}
    </>
  );
};

export default Userprofile;
