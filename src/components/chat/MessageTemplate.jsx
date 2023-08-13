import React from "react";
import "./messageTemplate.css";
import ReactTimeAgo from "react-time-ago";

const MessageTemplate = ({ message, recieverProfile }) => {
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
        </div>
      </div>
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
