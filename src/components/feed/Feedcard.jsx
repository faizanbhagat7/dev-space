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
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import Feedsharemodal from "./Feedsharemodal";

const Feedcard = ({ feed, getFeed }) => {
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
    if (feed) {
      getFeedAuthor();
      getLikes();
      getComments();
      checkIsBookmarked();
    }
  }, [feed]);

  /* =========================
     FETCH AUTHOR
  ========================= */

  const getFeedAuthor = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", feed.author)
      .single();

    setFeedAuthor(data);
  };

  /* =========================
     LIKES
  ========================= */

  const handleLike = () => {
    isLikedByUser ? removeLike() : addLike();
  };

  const addLike = async () => {
    await supabase.from("likes").insert([
      {
        postId: feed?.id,
        userId: user?.id,
      },
    ]);
    getLikes();
    setIsLikedByUser(true);
  };

  const removeLike = async () => {
    await supabase
      .from("likes")
      .delete()
      .eq("postId", feed?.id)
      .eq("userId", user?.id);

    getLikes();
    setIsLikedByUser(false);
  };

  const getLikes = async () => {
    const { data } = await supabase
      .from("likes")
      .select("userId")
      .eq("postId", feed?.id);

    if (data) {
      const users = data.map((obj) => obj.userId);
      setLikeList(users);
      setLikeCount(users.length);
      setIsLikedByUser(users.includes(user?.id));
    }
  };

  /* =========================
     COMMENTS
  ========================= */

  const handleCommentPopup = () => {
    setCommentpopup(!commentpopup);
  };

  const getComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("postId", feed?.id)
      .order("created_at", { ascending: false });

    if (data) {
      setCommentList(data);
      setCommentCount(data.length);
    }
  };

  /* =========================
     BOOKMARKS
  ========================= */

  const handleSaveToBookmarks = () => {
    isAddedToSaved ? removeFromSaved() : addToSaved();
  };

  const addToSaved = async () => {
    await supabase.from("bookmarks").insert([
      {
        postId: feed?.id,
        userId: user?.id,
      },
    ]);
    setIsAddedToSaved(true);
    toast.success("Saved");
  };

  const removeFromSaved = async () => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("postId", feed?.id)
      .eq("userId", user?.id);

    setIsAddedToSaved(false);
    toast.success("Removed");
  };

  const checkIsBookmarked = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("userId")
      .eq("postId", feed?.id);

    if (data) {
      setIsAddedToSaved(data.map((u) => u.userId).includes(user?.id));
    }
  };

  /* =========================
     SAFE DATA
  ========================= */

  const name = feedAuthor?.name || "User";
  const image = feedAuthor?.image || null;

  /* =========================
     UI
  ========================= */

  return (
    <div className="feed-card">
      {/* HEADER */}
      <div className="feed-card-header">
        <div className="feed-card-header-left">
          <Link
            to={`/profile/${feedAuthor?.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="author-avatar">
              {image ? (
                <img src={image} className="author-avatar-img" />
              ) : (
                <span className="avatar-fallback">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </Link>

          <div className="author-info">
            <Link
              to={`/profile/${feedAuthor?.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="author-name">{name}</div>
            </Link>

            <div className="author-desc">
              {feedAuthor?.description || "User"}
            </div>

            <div className="feed-date">
              <ReactTimeAgo date={feed?.created_at} locale="en-US" />
            </div>
          </div>
        </div>

        <div className="feed-card-header-right">
          {feedAuthor?.id === user?.id && (
            <DeleteIcon onClick={() => setShowDeleteModal(true)} />
          )}

          {showDeleteModal && (
            <Deletemodal
              setShowDeleteModal={setShowDeleteModal}
              feed={feed}
              getFeed={getFeed}
            />
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="feed-card-body">
        <div className="feed-card-body-text">{feed?.caption}</div>

        {feed?.image && (
          <div className="feed-card-body-image">
            <img src={feed.image} alt="post" />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="feed-card-footer">
        <div className="feed-card-footer-left">
          <div className="feed-card-footer-like-container">
            <div onClick={handleLike}>
              {isLikedByUser ? (
                <FavoriteSharpIcon style={{ color: "#007fff" }} />
              ) : (
                <FavoriteBorderSharpIcon />
              )}
            </div>
            <div>{likeCount}</div>
          </div>

          <div
            className="feed-card-footer-comment-container"
            onClick={handleCommentPopup}
          >
            {commentpopup ? (
              <ChatBubbleRoundedIcon style={{ color: "#007fff" }} />
            ) : (
              <ChatBubbleOutlineIcon />
            )}
            <div>{commentCount}</div>
          </div>

          <div
            className="feed-share-container"
            onClick={() => setFeedShareModal(true)}
          >
            <SendIcon />
          </div>

          {feedShareModal && (
            <Feedsharemodal
              postId={feed.id}
              setFeedShareModal={setFeedShareModal}
            />
          )}

          <div
            className="feed-card-footer-bookmark-container"
            onClick={handleSaveToBookmarks}
          >
            {isAddedToSaved ? (
              <BookmarkSharpIcon style={{ color: "#007fff" }} />
            ) : (
              <BookmarkBorderSharpIcon />
            )}
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      {commentpopup && (
        <Comments
          feed={feed}
          getComments={getComments}
          commentList={commentList}
        />
      )}
    </div>
  );
};

export default Feedcard;
