import React, { useState, useEffect, useContext } from "react";
import "./feedcard.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import ReactTimeAgo from "react-time-ago";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Comments from "./Comments";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Feedcard = ({ feed , getFeed}) => {
  const { user } = useContext(LoginContext);
  const [feedAuthor, setFeedAuthor] = useState(null);
  const [likeList, setLikeList] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentpopup, setCommentpopup] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    getFeedAuthor();
    getLikes();
    getComments();
  }, [feed]);

  const getFeedAuthor = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", feed.author)
      .single();
    setFeedAuthor(data);
  };

  const deletePost = async () => {
    const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", feed?.id);
    if (!error) {
        getFeed();
    }
    }
  

  const handleLike = async () => {
    if (isLikedByUser === false) {
      addLike();
    } else {
      removeLike();
    }
  };

  const addLike = async () => {
    const { data, error } = await supabase.from("likes").insert([
      {
        postId: feed?.id,
        userId: user?.id,
      },
    ]);
    if (!error) {
      getLikes();
      setIsLikedByUser(true);
    }
  };

  const removeLike = async () => {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("postId", feed?.id)
      .eq("userId", user?.id);
    if (!error) {
      getLikes();
      setIsLikedByUser(false);
    }
  };

  const getLikes = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("userId")
      .eq("postId", feed?.id);
    if (!error) {
      setLikeList(data.map((obj) => obj.userId));
      setLikeCount(data.length);
      if (data.map((obj) => obj.userId).includes(user?.id)) {
        setIsLikedByUser(true);
        return;
      } else {
        setIsLikedByUser(false);
      }
    }
  };

  const handleCommentPopup = () => {
    if (commentpopup === false) {
      setCommentpopup(true);
    } else {
      setCommentpopup(false);
    }
  };

  const getComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("postId", feed?.id)
      .order("created_at", { ascending: false });
    if (!error) {
      setCommentList(data);
      setCommentCount(data.length);
    }
  };

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
                <Link
                  to={`/profile/${feedAuthor?.id}`}
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <div className="author-name">{feedAuthor?.name}</div>
                </Link>
                <div className="author-desc">{feedAuthor?.description}</div>
                <div className="feed-date">
                  <ReactTimeAgo date={feed?.created_at} locale="en-US" />
                </div>
              </div>
            </div>
          </div>
          <div className="feed-card-header-right">
            {
              feedAuthor?.id === user?.id && (
                <DeleteIcon 
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={deletePost}
                />
              )
            }
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
                <FavoriteIcon
                  style={{
                    color: isLikedByUser ? "#007fff" : "gray",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </div>
              <div
                className="feed-like-count"
                style={{
                  color: isLikedByUser ? "#007fff" : "",
                }}
              >
                {likeCount}
              </div>
            </div>
            <div
              className="feed-card-footer-comment-container"
              onClick={handleCommentPopup}
            >
              <div classname="feed-comment-icon">
                <ChatBubbleOutlineIcon
                  style={{
                    color: commentpopup ? "#007fff" : "",
                  }}
                />
              </div>
              <div
                className="feed-comment-count"
                style={{
                  color: commentpopup ? "#007fff" : "",
                }}
              >
                {commentCount}
              </div>
            </div>
            <div className="feed-card-footer-bookmark-container">
              <BookmarkIcon 
                style={{
                  color: "lightgray",
                }}
              />
              </div>
          </div>
        </div>

        {/* commments section */}
        {commentpopup && (
          <Comments
            feed={feed}
            getComments={getComments}
            commentList={commentList}
          />
        )}
      </div>
    </>
  );
};

export default Feedcard;
