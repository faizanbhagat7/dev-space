import React, { useState, useEffect, useContext, useRef } from "react";
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
  const [likeCount, setLikeCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentpopup, setCommentpopup] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddedToSaved, setIsAddedToSaved] = useState(false);
  const [feedShareModal, setFeedShareModal] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const realtimeRef = useRef(null);

  useEffect(() => {
    if (!feed) return;
    getFeedAuthor();
    getLikes();
    getComments();
    checkIsBookmarked();
    subscribeToLikes();
    subscribeToComments();
    return () => {
      if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);
    };
  }, [feed?.id]);

  const getFeedAuthor = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", feed.author).single();
    setFeedAuthor(data);
  };

  /* Real-time subscriptions */
  const subscribeToLikes = () => {
    const channel = supabase
      .channel(`likes-${feed.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "likes", filter: `postId=eq.${feed.id}` },
        () => getLikes()
      )
      .subscribe();
    if (!realtimeRef.current) realtimeRef.current = channel;
  };

  const subscribeToComments = () => {
    supabase
      .channel(`comments-${feed.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `postId=eq.${feed.id}` },
        () => getComments()
      )
      .subscribe();
  };

  /* Likes */
  const handleLike = () => {
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 400);
    isLikedByUser ? removeLike() : addLike();
  };

  const addLike = async () => {
    setIsLikedByUser(true);
    setLikeCount(c => c + 1);
    await supabase.from("likes").insert([{ postId: feed?.id, userId: user?.id }]);
  };

  const removeLike = async () => {
    setIsLikedByUser(false);
    setLikeCount(c => Math.max(0, c - 1));
    await supabase.from("likes").delete().eq("postId", feed?.id).eq("userId", user?.id);
  };

  const getLikes = async () => {
    const { data } = await supabase.from("likes").select("userId").eq("postId", feed?.id);
    if (data) {
      const users = data.map(o => o.userId);
      setLikeCount(users.length);
      setIsLikedByUser(users.includes(user?.id));
    }
  };

  /* Comments */
  const getComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("postId", feed?.id).order("created_at", { ascending: false });
    if (data) { setCommentList(data); setCommentCount(data.length); }
  };

  /* Bookmarks */
  const handleSaveToBookmarks = () => { isAddedToSaved ? removeFromSaved() : addToSaved(); };

  const addToSaved = async () => {
    await supabase.from("bookmarks").insert([{ postId: feed?.id, userId: user?.id }]);
    setIsAddedToSaved(true);
    toast.success("Saved to bookmarks");
  };

  const removeFromSaved = async () => {
    await supabase.from("bookmarks").delete().eq("postId", feed?.id).eq("userId", user?.id);
    setIsAddedToSaved(false);
    toast.success("Removed from bookmarks");
  };

  const checkIsBookmarked = async () => {
    const { data } = await supabase.from("bookmarks").select("userId").eq("postId", feed?.id);
    if (data) setIsAddedToSaved(data.map(u => u.userId).includes(user?.id));
  };

  const name = feedAuthor?.name || "User";
  const image = feedAuthor?.avatar || feedAuthor?.image || null;

  return (
    <div className="feed-card animate-slide">
      {/* HEADER */}
      <div className="feed-card-header">
        <div className="feed-card-header-left">
          <Link to={`/profile/${feedAuthor?.id}`} style={{ textDecoration: "none" }}>
            <div className="author-avatar">
              {image
                ? <img src={image} className="author-avatar-img" alt={name} />
                : <span className="avatar-fallback">{name.charAt(0).toUpperCase()}</span>
              }
            </div>
          </Link>
          <div className="author-info">
            <Link to={`/profile/${feedAuthor?.id}`} style={{ textDecoration: "none" }}>
              <div className="author-name">{name}</div>
            </Link>
            <div className="author-desc">{feedAuthor?.description || "developer"}</div>
            <div className="feed-date">
              {feed?.created_at && <ReactTimeAgo date={new Date(feed.created_at)} locale="en-US" />}
            </div>
          </div>
        </div>
        <div className="feed-card-header-right">
          {feedAuthor?.id === user?.id && (
            <DeleteIcon onClick={() => setShowDeleteModal(true)} fontSize="small" />
          )}
        </div>
      </div>

      {showDeleteModal && <Deletemodal setShowDeleteModal={setShowDeleteModal} feed={feed} getFeed={getFeed} />}

      {/* BODY */}
      <div className="feed-card-body">
        {feed?.caption && <div className="feed-card-body-text">{feed.caption}</div>}
        {feed?.image && (
          <div className="feed-card-body-image">
            <img src={feed.image} alt="post" loading="lazy" />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="feed-card-footer-left">
        <div className={`feed-card-footer-like-container${likeAnimate ? " feed-like-active" : ""}`} onClick={handleLike}>
          {isLikedByUser
            ? <FavoriteSharpIcon style={{ color: "var(--magenta)", fontSize: 18 }} />
            : <FavoriteBorderSharpIcon style={{ fontSize: 18 }} />
          }
          <span className="like-count">{likeCount}</span>
        </div>

        <div className="feed-card-footer-comment-container" onClick={() => setCommentpopup(!commentpopup)}>
          {commentpopup
            ? <ChatBubbleRoundedIcon style={{ color: "var(--cyan)", fontSize: 18 }} />
            : <ChatBubbleOutlineIcon style={{ fontSize: 18 }} />
          }
          <span className="comment-count">{commentCount}</span>
        </div>

        <div className="feed-share-container" onClick={() => setFeedShareModal(true)}>
          <SendIcon style={{ fontSize: 16 }} />
        </div>

        {feedShareModal && <Feedsharemodal postId={feed.id} setFeedShareModal={setFeedShareModal} />}

        <div className="feed-card-footer-bookmark-container" onClick={handleSaveToBookmarks}>
          {isAddedToSaved
            ? <BookmarkSharpIcon style={{ color: "var(--green-code)", fontSize: 18 }} />
            : <BookmarkBorderSharpIcon style={{ fontSize: 18 }} />
          }
        </div>
      </div>

      {commentpopup && <Comments feed={feed} getComments={getComments} commentList={commentList} />}
    </div>
  );
};

export default Feedcard;
