import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../backend/supabaseConfig";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import "./commentdata.css";
import { LoginContext } from "../../context/LoginContext";
import DeleteIcon from "@mui/icons-material/Delete";

const Commentdata = ({ comment, getComments }) => {
  const [commentedUser, setCommentedUser] = useState(null);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", comment?.userId).single()
      .then(({ data }) => data && setCommentedUser(data));
  }, [comment?.userId]);

  const deleteComment = async () => {
    await supabase.from("comments").delete().eq("id", comment?.id);
    getComments();
  };

  const avatar = commentedUser?.avatar || commentedUser?.image;

  return (
    <div className="comment-item">
      <Link to={`/profile/${commentedUser?.id}`} style={{textDecoration:'none'}}>
        <div className="comment-item-avatar">
          {avatar ? <img src={avatar} alt="" /> : commentedUser?.name?.[0]?.toUpperCase()}
        </div>
      </Link>
      <div className="comment-item-body">
        <div className="comment-item-header">
          <Link to={`/profile/${commentedUser?.id}`} style={{textDecoration:'none'}}>
            <span className="comment-item-name">{commentedUser?.name || "User"}</span>
          </Link>
          <span className="comment-item-time">
            {comment?.created_at && <ReactTimeAgo date={new Date(comment.created_at)} locale="en-US" />}
          </span>
        </div>
        <div className="comment-item-text">{comment?.comment}</div>
      </div>
      {(user?.id === comment?.userId) && (
        <DeleteIcon className="comment-item-delete" fontSize="small" onClick={deleteComment} />
      )}
    </div>
  );
};

export default Commentdata;
