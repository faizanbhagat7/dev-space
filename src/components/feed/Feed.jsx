import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Loader from "../loader/Loader";
import { supabase } from "../../backend/supabaseConfig";
import Feedcard from "./Feedcard";
import "./feed.css";

const Feed = () => {
  const { setActivebutton, user } = useContext(LoginContext);
  const [feed, setFeed] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setActivebutton("feed");
    if (user) getFeed();
  }, [user]);

  const getFeed = async () => {
    try {
      setFetching(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const following = user?.following || [];

      const filtered = data?.filter(
        (post) =>
          following.includes(post.author) || post.author === user?.id
      );

      setFeed(filtered || []);
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setFetching(false);
    }
  };

  if (fetching) return <Loader />;

  if (!feed.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        No feed yet. Follow users to see content 🚀
      </div>
    );
  }

  return (
    <div className="feed-container">
      {feed.map((post) => (
        <Feedcard key={post.id} feed={post} getFeed={getFeed} />
      ))}
    </div>
  );
};

export default Feed;
