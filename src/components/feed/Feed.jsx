import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import { supabase } from "../../backend/supabaseConfig";
import "./feed.css";
import Feedcard from "./Feedcard";

const Feed = () => {
  const { activebutton, setActivebutton, user, darkMode } =
    useContext(LoginContext);
  const [feed, setFeed] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setActivebutton("feed");
    getFeed();
  }, [feed]);

  const getFeed = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      // filtering data, show only feed of following people

      if (user?.following?.length <= 0 || 
          !user?.following
        ) {
        setFetching(false);
        return;
      }

      let postList = [];
      data?.map((post) => {
        if (
          user?.following?.includes(post.author) ||
          post.author === user?.id
        ) {
          postList = [...postList, post];
        }
      });
      setFeed(postList);
      setFetching(false);
    } else {
      setFetching(false);
    }
  };

  // realtime post updates
  useEffect(() => {
    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "posts",
          event: "INSERT",
        },
        (payload) => {
          setFeed((feed) => [...feed, payload.new]);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
  return (
    <>
      {feed.length > 0 ? (
        <div className="feed-container">
          {feed?.map((post) => (
            <Feedcard feed={post} getFeed={getFeed} />
          ))}
        </div>
      ) : fetching 
       ? (
        <Loader />
      ) : (
        <div
          classsName="noFeed"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
            fontSize: "1.5rem",
            color: "black",
            fontFamily:
              'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            color: darkMode ? "white" : "black",
          }}
        >
          <div>No feed, Follow people to see their feed</div>
        </div>
      )}
    </>
  );
};

export default Feed;
