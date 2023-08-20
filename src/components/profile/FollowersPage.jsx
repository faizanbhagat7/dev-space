import React, { useState, useEffect, useContext } from "react";
import "./Follow.css";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Link, useParams } from "react-router-dom";
import Loader from "../loader/Loader";

const FollowersPage = () => {
  const { profileId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(LoginContext);

  const fetchFollowerProfiles = async () => {
    setLoading(true);
    // fetch followers id
    const { data, error } = await supabase
      .from("profiles")
      .select("followers")
      .eq("id", profileId);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }
    // fetch followers profile
    let idList = data[0]?.followers;
    // console.log(idList);

    if (idList === null || idList === []) {
      setLoading(false);
      return;
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .in("id", idList);
      setFollowers(data);
      setLoading(false);
      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }
    }
  };

  useEffect(() => {
    fetchFollowerProfiles();
  }, []);

  return (
    <>
      <div className="follow-container">
       <h1> Followers </h1>
        {followers?.length === 0 && loading === false && (
          <h1>No followers yet</h1>
        ) }

          {
            loading && <Loader />
          }

        {followers.length > 0 &&
          followers?.map((fetcheduser) => (
            <Link
              to={`/profile/${fetcheduser.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="follow-card"
                style={{
                  backgroundColor: darkMode ? "#1f1f1f" : "white",
                  color: darkMode ? "white" : "#15202b",
                }}
              >
                <div className="follow-image">
                  <img src={fetcheduser.avatar} alt="" />
                </div>
                <div className="follow-details">
                  <div className="follow-name"
                    style={{
                      color: darkMode ? "white" : "#15202b",
                    }}
                  >{fetcheduser.name}</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default FollowersPage;
