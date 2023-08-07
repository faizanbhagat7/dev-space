import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import { supabase } from "../../backend/supabaseConfig";
import "./feed.css";
import Feedcard from "./Feedcard";

const Feed = () => {
  const { activebutton, setActivebutton, user } = useContext(LoginContext);
  const [feed, setFeed] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setActivebutton("feed");
    getFeed();
  }, []);

  const getFeed = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    // filtering data, show only feed of following people
    let postList = [];

    data.map((post) => {
      if (user.following.includes(post.author) || post.author === user?.id) {
        postList = [...postList, post];
      }
    });
    setFeed(postList);
    setFetching(false);
  };

  console.log(feed);

  return (
    <>
      {feed.length > 0 ? (
        <div className="feed-container"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            overflowY: "scroll",

          }}
        >
          {
            feed.map((post) => <Feedcard feed={post} />)
          }
        </div>
      ) : fetching ? (
        <Loader />
      ) : (
        <h2 align="center">There are no posts yet</h2>
      )}
    </>
  );
};

export default Feed;
