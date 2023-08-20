import React, { useState, useEffect, useContext } from "react";
import "./feedsharemodal.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import Loader from "../loader/Loader";
import FeedsendLogic from "./FeedsendLogic";

const Feedsharemodal = ({ postId, setFeedShareModal }) => {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user,darkMode } = useContext(LoginContext);

  useEffect(() => {
    getFollowingList();
  }, []);

  const getFollowingList = async () => {
    setLoading(true);
    let followingListTemp = [];
    for (let i = 0; i < user.following.length; i++) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.following[i]);
      if (!error) {
        if(!followingListTemp.includes(data[0])){
          followingListTemp = [...followingListTemp, data[0]];
        }
    }
    setFollowingList(followingListTemp);
    }
    setLoading(false);
  };

  console.log(followingList);

  return (
    <>
      <div className="feedsharemodal-container">
        <div className="feedsharemodal-wrapper"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <div className="feedsharemodal-header">
            <p>Share Post</p>
          </div>
          <div className="feedsharemodal-body">
            <div className="feed-share-followinglist">
              {loading && <Loader />}

              {followingList?.map((following) => (
                   (
                    <FeedsendLogic followinguser={following} postId={postId} />
                    )
              ))}
            </div>
          </div>
          <div className="feedsharemodal-footer">
            <button
              className="feedsharemodal-cancel"
              onClick={() => setFeedShareModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedsharemodal;
