import React, { useState, useEffect, useContext } from "react";
import "./messagechannel.css";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link, useParams } from "react-router-dom";
import Loader from "../loader/Loader.jsx";
import { LoginContext } from "../../context/LoginContext";

const MessageChannel = () => {
  const { user } = useContext(LoginContext);
  const { recieverId } = useParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState([]);
  const [recieverProfile, setRecieverProfile] = useState(null);

  const handleSubmit = async (e) => {
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
    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", recieverId);
    if (!error) {
        setRecieverProfile(data[0]);
    }
}

  const fetchMessages = async () => {
    const { data, error } = await supabase
        .from("chats")
        .select()
        .eq("senderId", user.id)
        .eq('recieverId', recieverId)
        .order("created_at", { ascending: false });
    if (!error) {
        setMessages(data);
        console.log(data);
    }
    else{
        console.log(error);
    }

    };

    useEffect(() => {
        fetchRecieverProfile()
        fetchMessages();
    }, [recieverId]);
    
    



  return (
    <>
      <h1>Message Channel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message here"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Send
        </button>
      </form>

        <h2>
            {
                recieverProfile && recieverProfile.name
            }
        </h2>

      {
        messages.map((message) => {
            return (
                <div className="message">
                <h3>{message.message}</h3>
                </div>
            )
            })
      }
    </>
  );
};

export default MessageChannel;
