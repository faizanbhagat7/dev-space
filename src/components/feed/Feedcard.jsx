import React, { useState, useEffect, useContext } from "react";
import "./feedcard.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import ReactTimeAgo from "react-time-ago";
import SchoolIcon from '@mui/icons-material/School';

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
            <div className="author-info">
              <div className="author-avatar">
                <img
                  src={feedAuthor?.avatar}
                  alt=""
                  className="author-avatar-img"
                />
              </div>
              <div className="author-description">
                <div className="author-name">{feedAuthor?.name}</div>
                <div className="author-desc">{feedAuthor?.description}</div>
                <div className="feed-date">
                  <ReactTimeAgo date={feed?.created_at} locale="en-US" />
                </div>
              </div>
            </div>
          </div>
          <div className="feed-card-header-right">
            <h1>:</h1>
          </div>
        </div>
        <div className="feed-card-body">
          <div className="feed-card-body-text">{feed?.caption}</div>
          {feed?.image && (
            <div className="feed-card-body-image">
              <img src={feed?.image} alt="" />
            </div>
          )}
        </div>
        <div className="feed-card-footer">
           
        </div>  
      </div>
    </>
  );
};

export default Feedcard;
