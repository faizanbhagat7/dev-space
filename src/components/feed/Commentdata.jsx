import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../backend/supabaseConfig";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import "./commentdata.css";
import { LoginContext } from "../../context/LoginContext";
import DeleteIcon from '@mui/icons-material/Delete';


const Commentdata = ({ comment ,getComments,commentList}) => {
  const [commentedUser, setCommentedUser] = useState();
  const { user } = useContext(LoginContext);

  const fetchCommentedUser = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", comment?.userId);
    if (!error) {
      setCommentedUser(data[0]);
    }
  };

  const deleteComment = async () => {
    const { data, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment?.id);
    if (!error) {
        // getComments();
    }
    };

  useEffect(() => {
    fetchCommentedUser();
  }, [comment?.id]);

  return (
    <>
      <div className="feed-commentdata-section">
        <div className="feed-commentdata-section-header">
          <Link
            to={`/profile/${commentedUser?.id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div className="feed-commentdata-section-header-image-container">
              <img src={commentedUser?.avatar} alt="" />
            </div>
          </Link>
        </div>
        <div className="feed-commentdata-section-body">
          <Link
            to={`/profile/${commentedUser?.id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <p className="commented-user-info">
              <span className="commented-username">{commentedUser?.name}</span>
              <span className="commented-time">
                <ReactTimeAgo date={comment?.created_at} />
              </span>
            </p>
          </Link>
          <p className="comment-text">{comment?.comment}</p>
        </div>

        {user?.id === comment?.userId && (
          <div className="delete-comment-section">
            <DeleteIcon 
                style={{ color: "red", cursor: "pointer" ,margin:'auto'}}
                onClick={deleteComment}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Commentdata;
