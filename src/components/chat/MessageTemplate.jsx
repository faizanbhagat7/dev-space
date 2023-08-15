import React,{useState,useEffect} from "react";
import "./messageTemplate.css";
import ReactTimeAgo from "react-time-ago";
import { supabase } from "../../backend/supabaseConfig.js";

const MessageTemplate = ({ message, recieverProfile }) => {
  
  const [sharedPostinfo, setSharedPostinfo] = useState(null);
  const [postOwner, setPostOwner] = useState(null);
  
  const fetchSharedPostinfo = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", message?.sharedPostId).single();

    if (!error) {
      setSharedPostinfo(data);

      const { data: postOwner, error: postOwnerError } = await supabase
        .from("profiles")
        .select()
        .eq("id", data?.author).single();
        if(!postOwnerError){
          setPostOwner(postOwner)
        }    
    } 
}
  
  

  useEffect(() => {
    if(message?.sharedPostId){
      fetchSharedPostinfo();
    }
  }, [message?.sharedPostId]);



  return (
    <>
    
    <div style={{
        width: "100%",
      display: "flex",
      flexDirection: "column",
        alignItems: message?.senderId === recieverProfile?.id ? "flex-start" : "flex-end",
        marginBottom: "10px",
    }}>
      <div className={message?.senderId === recieverProfile?.id ? "message-reciever-container" : "message-sender-container"}>
        <div className="message-owner"
               style={{
                color: message.senderId === recieverProfile?.id ? "#15202b" : "#007fff",
                
              }}
        >
          {message?.senderId === recieverProfile?.id ? (
            <p className="message-owner-name">{recieverProfile?.name}</p>
          ) : (
            <p className="message-owner-name">You</p>
          )}
        </div>
        <div className="message-content">
          <p className="message-text"
              style={{
                color: message.senderId === recieverProfile?.id ? "#fff" : "#000",
              }}
          >{message?.message}</p>

           {/*  shared post container */}
      
      {
        message?.sharedPostId && sharedPostinfo && postOwner &&  
        (
          <div className="message-shared-post-container">
          <div className="message-shared-post-content">
          {
              sharedPostinfo?.image && (
          
            <div className="message-shared-post-image">
              <img
                src={sharedPostinfo?.image}
                alt=""
              />
            </div>
              )}
            </div>
            <div className="message-shared-post-owner">
            <span className="message-shared-post-owner-name">{
              postOwner?.name
            }</span>
            <span className="message-shared-post-caption">
              {
              sharedPostinfo?.caption
              }
            </span>
          </div>
          </div>
        )
      }
   
        </div>
      </div>

     


      {/*  time */}
      <div className="message-time">
          <p className="message-time-text"
             style={{
              color: 'gray',
              marginRight: message.senderId === recieverProfile?.id ? "auto" : "30px",
              marginLeft: message.senderId === recieverProfile?.id ? "10px" : "auto",
            }}
          >
            <ReactTimeAgo date={message?.created_at} locale="en-US" />
          </p>
        </div>
      </div>
        
    </>
  );
};

export default MessageTemplate;
