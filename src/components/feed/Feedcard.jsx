import React, { useState, useEffect, useContext } from "react";
import "./feedcard.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";

const Feedcard = ({ feed }) => {
  const { user } = useContext(LoginContext);
  const [feedAuthor, setFeedAuthor] = useState(null);

  useEffect(() => {
    getFeedAuthor();
  }, []);

  const getFeedAuthor = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", feed.author)
      .single();
    setFeedAuthor(data);
  };

  return (
    <>
      <div className="feed-card">
        <div className="feed-card-header">
          <div className="feed-card-header-left">
            <img src={feedAuthor?.avatar} alt="" className="feed-card-avatar" width='100px' height='100px' />
            <div className="feed-card-author">
              <h4>{feedAuthor?.name}</h4>
            </div>
          </div>
          <div className="feed-card-header-right">
            <h4>{new Date(feed.created_at).toLocaleDateString()}</h4>
          </div>
        </div>
        <div className="feed-card-body">
          <p>{feed.caption}</p>
          <div className="feed-card-image">
            <img src={feed.image} alt="" width='500px' height='500px' />
          </div>
        </div>
        <div className="feed-card-footer">
          <div className="feed-card-footer-left">
            <h4>{feed.likes} likes</h4>
          </div>
          <div className="feed-card-footer-right">
            <h4>{feed.comments} comments</h4>
          </div>
        </div>
        <div className="feed-card-actions">
          <div className="feed-card-actions-left">
            <button className="feed-card-action-button">
              <i className="far fa-heart"></i>
              <h4>Like</h4>
            </button>
            <button className="feed-card-action-button">
              <i className="far fa-comment"></i>
              <h4>Comment</h4>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedcard;
