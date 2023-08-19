import React, { useState, useEffect, useContext } from "react";
import "./feedcard.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import ReactTimeAgo from "react-time-ago";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import Comments from "./Comments";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import Deletemodal from "./Deletemodal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendIcon from '@mui/icons-material/Send';
import Feedsharemodal from './Feedsharemodal'

const Feedcard = ({ feed, getFeed , openCommentDefault , setOpenCommentDefault }) => {
  const { user } = useContext(LoginContext);
  const [feedAuthor, setFeedAuthor] = useState(null);
  const [likeList, setLikeList] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentpopup, setCommentpopup] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddedToSaved, setIsAddedToSaved] = useState(false);
  const [feedShareModal, setFeedShareModal] = useState(false);


  useEffect(() => {
    getFeedAuthor();
    checkIsBookmarked();
    openCommentDefault && setCommentpopup(true)
  }, [feed?.id]);

  useEffect(() => {
    getLikes();
  }, [likeList]);

  useEffect(() => {
    getComments();
  }, [commentList]);

  const getFeedAuthor = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", feed.author)
      .single();
    setFeedAuthor(data);
  };

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
      // getLikes();
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
      // getLikes();
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
      openCommentDefault && setOpenCommentDefault(false)
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

  const handleSaveToBookmarks = async () => {
    if (isAddedToSaved === false) {
      addToSaved();
    } else {
      removeFromSaved();
    }
  };

  const addToSaved = async () => {
    const { data, error } = await supabase.from("bookmarks").insert([
      {
        postId: feed?.id,
        userId: user?.id,
      },
    ]);
    if (!error) {
      setIsAddedToSaved(true);
      toast.success("Post added to Bookmarks", {
        closeOnClick: true,
        closeButton: false,
        position: "bottom-center",
        duration: 200,
        hideProgressBar: true,
      });
    }
  };

  const removeFromSaved = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("postId", feed?.id)
      .eq("userId", user?.id);
    if (!error) {
      setIsAddedToSaved(false);
      toast.success("Post removed from Bookmarks", {
        closeOnClick: true,
        closeButton: false,
        position: "bottom-center",
        duration: 200,
        hideProgressBar: true,
      });
    }
  };

  const checkIsBookmarked = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("userId")
      .eq("postId", feed?.id);
    if (!error) {
      if (data.map((obj) => obj.userId).includes(user?.id)) {
        setIsAddedToSaved(true);
        return;
      } else {
        setIsAddedToSaved(false);
      }
    }
  };

    useEffect(() => {
    const channel = supabase
      .channel("realtime-likes")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "likes",
          event: "*",
        },
        (payload) => {
          getLikes();
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);


    useEffect(() => {
    const channel = supabase
      .channel("realtime-comments")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "comments",
          event: "*",
        },
        (payload) => {
          getComments();
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
  return (
    <>
      <div className="feed-card">
        <div className="feed-card-header">
          <div className="feed-card-header-left">
            <div className="author-info">
              <Link
                to={`/profile/${feedAuthor?.id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div
                  className="author-avatar"
                  style={{
                    border:
                      feedAuthor?.id === user?.id
                        ? "2px solid #007fff"
                        : "none",
                  }}
                >
                  <img
                    src={feedAuthor?.avatar}
                    alt=""
                    className="author-avatar-img"
                  />
                </div>
              </Link>
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
                <div className="feed-delete-icon"
                style={{
                  cursor: "pointer",
                }}
                  onClick={() => setShowDeleteModal(true)}
                >
                  <DeleteIcon />
                </div>
              )
            }
            {showDeleteModal && (
              <Deletemodal
                setShowDeleteModal={setShowDeleteModal}
                feed={feed}
                getFeed={getFeed}
              />
            )}
          </div>
        </div>

        {/* feed body */}
        <Link to={`/post/${feed?.id}`} style={{ textDecoration: "none" ,color:'#000'}}>
        <div className="feed-card-body">
          <div className="feed-card-body-text">{feed?.caption}</div>
          {feed?.image && (
            <div className="feed-card-body-image">
              <img src={feed?.image} alt="" />
            </div>
          )}
        </div>
        </Link>


        <div className="feed-card-footer">
          <div className="feed-card-footer-left">
            <div className="feed-card-footer-like-container">
              <div className="feed-like-icon" onClick={handleLike}>
                {isLikedByUser ? (
                  <FavoriteSharpIcon
                    style={{
                      color: "#007fff",
                    }}
                  />
                ) : (
                  <FavoriteBorderSharpIcon />
                )}
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
                {commentpopup ? (
                  <ChatBubbleRoundedIcon
                    style={{
                      color: "#007fff",
                    }}
                  />
                ) : (
                  <ChatBubbleOutlineIcon />
                )}
              </div>
              <div
                className="feed-comment-count"
                style={{
                  color: commentpopup ? "#007fff" : "",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {commentCount}
              </div>
            </div>

                {/* feed share container */}
                <div className="feed-share-container"
                  onClick={
                    () => setFeedShareModal(true)
                  }
                >
                  <div className="feed-share-icon">
                    <SendIcon />
                    </div>
                    </div>
                  {
                    feedShareModal && (
                      <Feedsharemodal postId={feed.id} setFeedShareModal={setFeedShareModal} />
                    )
                  }
            <div
              className="feed-card-footer-bookmark-container"
              onClick={handleSaveToBookmarks}
            >
              {isAddedToSaved ? (
                <BookmarkSharpIcon
                  style={{
                    color: "#007fff",
                  }}
                />
              ) : (
                <BookmarkBorderSharpIcon />
              )}
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
