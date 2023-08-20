import React, { useState, useEffect , useContext } from "react";
import "./profilefeed.css";
import { useParams } from "react-router-dom";
import { supabase } from "../../backend/supabaseConfig";
import Feedcard from "../feed/Feedcard";
import Loader from "../loader/Loader";
import { LoginContext } from "../../context/LoginContext";

const Profilefeed = () => {
  const { profileId } = useParams();
  const [profileFeed, setProfileFeed] = useState([]);
  const [fetching, setFetching] = useState(false);
  const { darkMode } = useContext(LoginContext);

  const fetchProfileFeed = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("author", profileId)
      .order("created_at", { ascending: false });
    if (error) {
      setFetching(false);
      console.log(error);
      return;
    }
    setProfileFeed(data);
    setFetching(false);
  };

  useEffect(() => {
    fetchProfileFeed();
  }, [profileId]);

  //   console.log(profileFeed);

  return (
    <>
      {profileFeed.length > 0 ? (
        <div className="profileFeed-container">
          {profileFeed?.map((post) => (
            <Feedcard feed={post} getFeed={fetchProfileFeed} />
          ))}
        </div>
      ) : fetching ? (
        <Loader />
      ) : (
        <div className="noFeed-text">
            <div
              style={{
                color: darkMode ? "white" : "black",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >There are no posts yet</div>
        </div>
        
      )}
    </>
  );
};

export default Profilefeed;
