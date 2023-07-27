import React, { useState, useEffect, useContext } from "react";
import "./FollowersPage.css";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Link,useParams } from "react-router-dom";


const FollowersPage = () => {
  const {profileId} = useParams();
  const [followers, setFollowers] = useState([]);

  const fetchFollowerProfiles = async () => {

    // fetch followers id 
    const { data, error } = await supabase
      .from("profiles")
      .select("followers")
      .eq("id", profileId)
  
    if (error) {
      console.log(error);
      return;
    }
    // fetch followers profile
    let idList = data[0]?.followers;
    console.log(idList);

    if (idList === null || idList === []) {
      return;
    }
    else{
      const { data, error } = await supabase
      .from("profiles")
      .select()
      .in("id", idList)
      setFollowers(data);
      if (error) {
        console.log(error);
        return;
      }
    }

  };

  useEffect(() => {
    fetchFollowerProfiles();
  }, []);

  return (
    <>
      <div className="followers-container">
        {followers?.length === 0 ? (
          <h1>No followers yet</h1>
        ) : (
          <h1>Followers</h1>
        )}

        {followers.length > 0 &&
          followers?.map((fetcheduser) => (
            <Link
              to={`/profile/${fetcheduser.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="follower-card">
                <div className="follower-image">
                  <img src={fetcheduser.avatar} alt="" />
                </div>
                <div className="follower-details">
                  <div className="follower-name">{fetcheduser.name}</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default FollowersPage;
