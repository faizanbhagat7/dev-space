import React, { useState, useEffect } from "react";
import "./profilefeed.css";
import { useParams } from "react-router-dom";
import { supabase } from "../../backend/supabaseConfig";
import Feedcard from "../feed/Feedcard";
import Loader from "../loader/Loader";

const Profilefeed = () => {
  const { profileId } = useParams();
  const [profileFeed, setProfileFeed] = useState([]);
  const [fetching, setFetching] = useState(false);

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
            <div>There are no posts yet</div>
        </div>
        
      )}
    </>
  );
};

export default Profilefeed;
