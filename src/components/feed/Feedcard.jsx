import React, { useState, useEffect, useContext } from "react";
import "./feedcard.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import ReactTimeAgo from "react-time-ago";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Feedcard = ({ feed }) => {
  const { user } = useContext(LoginContext);
  const [feedAuthor, setFeedAuthor] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [likeList, setLikeList] = useState([]); 
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    getFeedAuthor();
    getLikes();
  }, []);

  const getFeedAuthor = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", feed.author)
      .single();
    setFeedAuthor(data);
  };

  const handleLike = async () => {
    const { data, error } = await supabase
      .from("likes")
      .insert([{
         postId: feed?.id,
          userId: user?.id,
      }]);
      if (data) {
        console.log(data)
        setIsLikedByUser(true);
        getLikes();
      }
  };

  const getLikes = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("userId")
      if (data) {
        setLikeList(data);
        setLikeCount(data.length);
      }
      checkIsLikedByUser();
  }

  const checkIsLikedByUser = () => {
    const isLiked = likeList.find((like) => like.userId === user?.id);
    if (isLiked) {
      setIsLikedByUser(true);
    }
  }
  console.log(likeList)
  return (
    <>
      <div className="feed-card">
        <div className="feed-card-header">
          <div className="feed-card-header-left">
            <div className="author-info">
              <div
                className="author-avatar"
                style={{
                  border:
                    feedAuthor?.id === user?.id ? "2px solid #007fff" : "none",
                }}
              >
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
          <div className="feed-card-footer-left">
            <div className="feed-card-footer-like-container">
              <div className="feed-like-icon" onClick={handleLike}>
                <FavoriteBorderSharpIcon 
                  style={{
                    color: isLikedByUser ? "#007fff" : "",
                  }}
                />
              </div>
              <div className="feed-like-count">{likeCount}</div>
            </div>
            <div className="feed-card-footer-comment-container">
              <div classname="feed-comment-icon">
                <ChatBubbleOutlineIcon />
              </div>
              <div className="feed-comment-count">5</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedcard;
