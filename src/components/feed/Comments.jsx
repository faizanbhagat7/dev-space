import React, { useState, useContext } from "react";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import "./comments.css";
import Commentdata from "./Commentdata";

const Comments = ({ feed, getComments, commentList }) => {
  const { user } = useContext(LoginContext);
  const [commentText, setCommentText] = useState("");

  const addComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;
    const { error } = await supabase.from("comments").insert([{
      postId: feed?.id, userId: user?.id, comment: commentText,
    }]);
    if (!error) { setCommentText(""); getComments(); }
  };

  const avatar = user?.avatar || user?.image;

  return (
    <div className="comments-section">
      <div className="add-comment">
        <div className="comment-avatar" style={{flexShrink:0}}>
          {avatar ? <img src={avatar} alt="" /> : user?.name?.[0]?.toUpperCase()}
        </div>
        <input
          type="text"
          placeholder="Add a comment..."
          className="comment-input"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addComment(e)}
        />
        <button className="comment-submit-btn" onClick={addComment}>send</button>
      </div>
      <div className="comments-list">
        {commentList?.map(comment => (
          <Commentdata key={comment.id} comment={comment} getComments={getComments} commentList={commentList} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
