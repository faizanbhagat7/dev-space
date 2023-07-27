import React, { useState, useEffect, useContext } from "react";
import "./Follow.css";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Link, useParams } from "react-router-dom";

const FollowingPage = () => {
  const { profileId } = useParams();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowerProfiles = async () => {
    setLoading(true);
    // fetch following id
    const { data, error } = await supabase
      .from("profiles")
      .select("following")
      .eq("id", profileId);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }
    // fetch following profile
    let idList = data[0]?.following;
    console.log(idList);

    if (idList === null || idList === []) {
      setLoading(false);
      return;
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .in("id", idList);
      setFollowing(data);
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
       <h1> Following </h1>
        {following?.length === 0 && loading === false && (
          <h1>Following no one yet</h1>
        )}

        {
            loading && <h1>Loading...</h1>
        }

        {following.length > 0 &&
          following?.map((fetcheduser) => (
            <Link
              to={`/profile/${fetcheduser.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="follow-card">
                <div className="follow-image">
                  <img src={fetcheduser.avatar} alt="" />
                </div>
                <div className="follow-details">
                  <div className="follow-name">{fetcheduser.name}</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default FollowingPage;
