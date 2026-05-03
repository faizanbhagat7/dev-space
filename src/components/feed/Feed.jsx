import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import Loader from "../loader/Loader";
import { supabase } from "../../backend/supabaseConfig";
import Feedcard from "./Feedcard";
import "./feed.css";

const Feed = () => {
  const { setActivebutton, user } = useContext(LoginContext);

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setActivebutton("feed");

    if (user) {
      getFeed();
    } else {
      setLoading(false); // important: stop loader if no user
    }
  }, [user]);

  const getFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const following = user?.following || [];

      const filtered =
        data?.filter(
          (post) =>
            following.includes(post.author) || post.author === user?.id
        ) || [];

      setFeed(filtered);
    } catch (err) {
      console.error("Feed error:", err);
      setError("Something went wrong while loading feed.");
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 UI STATES (clean and controlled)

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="noFeed">
        Please login to see your feed 🔐
      </div>
    );
  }

  if (error) {
    return (
      <div className="noFeed">
        {error}
      </div>
    );
  }

  if (!feed.length) {
    return (
      <div className="noFeed">
        No posts yet. Start following people 🚀
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
