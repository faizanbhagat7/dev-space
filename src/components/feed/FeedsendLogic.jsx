import React,{useState,useEffect,useContext} from "react";
import "./feedsendlogic.css";
import { supabase } from "../../backend/supabaseConfig";
import Loader from "../loader/Loader";
import {LoginContext} from "../../context/LoginContext";

const FeedsendLogic = ({ followinguser, postId }) => {

    const [loading, setLoading] = useState(false);
    const [send, setSend] = useState(false);
    const {user,darkMode} = useContext(LoginContext);

    const sendPost = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("chats")
            .insert([
                {
                    senderId: user?.id,
                    recieverId: followinguser?.id,
                    sharedPostId: postId,
                },
            ]);
        if (!error) {
            setSend(true);
        }
        else{
            // alert(error.message)
        }
        setLoading(false);
    };

    

  return (
    <>
      <div className="sharefeed-template"
        style={{
          backgroundColor: darkMode ? "#15202b" : "lightgray",
          color: darkMode ? "white" : "black",
          boxShadow
            : darkMode
              ? "0px 0px 5px 0px rgba(255,255,255,0.2)"
              : "none",
        }}
      >
        <div className="sharefeed-userinfo">
          <div className="sharefeed-image">
            <img src={followinguser?.avatar} alt="" />
          </div>
          <div className="sharefeed-details">
            <div className="sharefeed-name">{followinguser?.name}</div>
          </div>
        </div>

        <div className="sharefeed-button">
          <button
            style={{
                backgroundColor: send ? "gray" : "",
                cursor: send ? "not-allowed" : "pointer",
            }}
            onClick={sendPost}
          >
            {
                send ? "Sent" : "Send"
            }
            </button>
        </div>
      </div>
    </>
  );
};

export default FeedsendLogic;
