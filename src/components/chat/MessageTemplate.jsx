import React from "react";
import "./messageTemplate.css";
import ReactTimeAgo from "react-time-ago";

const MessageTemplate = ({ message, recieverProfile }) => {
  return (
    <>
    <div style={{
        width: "100%",
      display: "flex",
        justifyContent: message?.senderId === recieverProfile?.id ? "flex-start" : "flex-end",
    }}>
      <div className={message?.senderId === recieverProfile?.id ? "message-reciever-container" : "message-sender-container"}>
        <div className="message-owner">
          {message?.senderId === recieverProfile?.id ? (
            <p className="message-owner-name">{recieverProfile?.name}</p>
          ) : (
            <p className="message-owner-name">You</p>
          )}
        </div>
        <div className="message-content">
          <p className="message-text">{message?.message}</p>
        </div>
        <div className="message-time">
          <p className="message-time-text">
            <ReactTimeAgo date={message?.created_at} locale="en-US" />
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default MessageTemplate;
