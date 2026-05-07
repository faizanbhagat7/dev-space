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
    if (user) getFeed();
    else setLoading(false);
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

      // Safe null check on following
      const following = Array.isArray(user?.following) ? user.following : [];

      // Algorithm: show own posts + following posts, sorted by recency
      const filtered = (data || []).filter(
        post => following.includes(post.author) || post.author === user?.id
      );

      setFeed(filtered);
    } catch (err) {
      console.error("Feed error:", err);
      setError("Something went wrong loading feed.");
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="noFeed"><p>Please login to see your feed 🔐</p></div>;
  if (error) return <div className="noFeed"><p>{error}</p></div>;
  if (!feed.length) return (
    <div className="noFeed">
      <p>No posts yet.</p>
      <p style={{fontSize:11,marginTop:4}}>Start following devs to fill your feed 🚀</p>
    </div>
  );

  return (
    <div className="feed-container">
      {feed.map((post, i) => (
        <div key={post.id} className={`animate-slide stagger-${Math.min(i + 1, 5)}`}>
          <Feedcard feed={post} getFeed={getFeed} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
