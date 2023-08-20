import React, { useState, useEffect, useContext } from "react";
import "./messagechannel.css";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link, useParams } from "react-router-dom";
import Loader from "../loader/Loader.jsx";
import { LoginContext } from "../../context/LoginContext";
import SendIcon from "@mui/icons-material/Send";
import MessageTemplate from "./MessageTemplate";
import ScrollToBottom from 'react-scroll-to-bottom';

const MessageChannel = () => {
  const { user, setActivebutton ,darkMode} = useContext(LoginContext);
  const { recieverId } = useParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState([]);
  const [recieverProfile, setRecieverProfile] = useState(null);
  

  const handleSubmit = async (e) => {
    if (sendMessage.trim() === "") return;
    e.preventDefault();
    const { data, error } = await supabase.from("chats").insert([
      {
        senderId: user.id,
        recieverId: recieverId,
        message: sendMessage,
      },
    ]);
    if (!error) {
      setSendMessage("");
    }
  };

  const fetchRecieverProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", recieverId);
    if (!error) {
      setRecieverProfile(data[0]);
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .in("recieverId", [recieverId, user.id])
      .in("senderId", [recieverId, user.id])
      .order("created_at", { ascending: true });
    if (!error) {
      setMessages(data);
      console.log(data);
    } else {
      console.log(error);
      alert(error.message);
    }
    
  };

  useEffect(() => {
    setActivebutton("chat");
    fetchRecieverProfile();
    fetchMessages();
  }, [recieverId]);

  useEffect(() => {
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "chats",
          event: "INSERT",
        },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);


  return (
    <>
      <div className="messageChannel-container"
      style={{
        backgroundColor: darkMode ? "#1f1f1f" : "white",
        color: darkMode ? "white" : "black",
      }}
      >
        <div className="messageChannel-header">
          <Link
            to={`/profile/${recieverId}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div className="reciever-info">
              <div className="reciever-avatar">
                <img src={recieverProfile?.avatar} alt="" />
              </div>
              <div className="reciever-name-desc">
                <p className="reciever-name">{recieverProfile?.name}</p>
                <p className="reciever-desc">{recieverProfile?.description}</p>
              </div>
            </div>
          </Link>
        </div>
        <ScrollToBottom className="messageChannel-body" >
          {loading ? (
            <Loader />
          ) : (
            messages?.map((message) => (
              <div className="message-container">
                <MessageTemplate
                  message={message}
                  recieverProfile={recieverProfile}
                />
              </div>
            ))
          )}
        </ScrollToBottom>

        <div className="messageChannel-footer">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <div className="input-text">
                <input
                  type="text"
                  placeholder="Type a message ..."
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                />
              </div>
              <div className="input-send">
                <SendIcon onClick={handleSubmit} className="send-icon" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MessageChannel;
