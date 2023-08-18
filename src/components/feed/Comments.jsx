import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import ReactTimeAgo from "react-time-ago";
import "./comments.css";
import SendIcon from "@mui/icons-material/Send";
import Commentdata from "./Commentdata";

const Comments = ({ feed, getComments, commentList }) => {
  const { user } = useContext(LoginContext);
  const [commentText, setCommentText] = useState("");

  const addComment = async (e) => {
    e.preventDefault();
    if (commentText.split(" ").join("")=== "") {
      return;
    }
    const { data, error } = await supabase.from("comments").insert([
      {
        postId: feed?.id,
        userId: user?.id,
        comment: commentText,
      },
    ]);
    if (!error) {
      setCommentText("");
      // getComments();
    }
  };


  return (
    <>
      <div className="feed-comments-section">
        <div className="feed-comments-section-header">
          <div className="feed-comments-section-header-left">
            <img src={user?.avatar} alt="" />
          </div>
          <form onSubmit={addComment}>
            <div className="feed-comments-section-header-right">
              <div>
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />{" "}
              </div>
              <div>
                <SendIcon
                  className="comment-send-icon"
                  type="submit"
                  onClick={addComment}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="feed-comments-section-body">
          {commentList?.map((comment) => (
            <div className="feed-comment">
              <Commentdata comment={comment} getComments={getComments}
              commentList={commentList}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Comments;
