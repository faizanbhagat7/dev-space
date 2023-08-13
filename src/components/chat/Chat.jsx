import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import "./chat.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader.jsx";

const Chat = () => {
  const { activebutton, user, setActivebutton } = useContext(LoginContext);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [previuosSearch, setPreviousSearch] = useState("");
  const [recentChatUsers, setRecentChatUsers] = useState([]);

  const handleSubmit = async (e) => {
    setPreviousSearch(searchTerm);
    e.preventDefault();
    setIsSearching(true);
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .ilike("name", `%${searchTerm}%`)
      .neq("id", user.id);

    let userList = [];
    for (let i = 0; i < data.length; i++) {
      if (user.following.includes(data[i].id)) {
        userList.push(data[i]);
      }
    }
    setUsers(userList);
    setLoading(false);
    setIsSearching(false);
  };

  const fetchRecentChatUsers = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select()
      .or(`senderId.eq.${user.id},recieverId.eq.${user.id}`)
      .order("created_at", { ascending: false });
      
      if (!error)
      {
        new Set(data.map((chat) => chat.senderId === user.id ? chat.recieverId : chat.senderId)).forEach(async (id) => {
          const { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("id", id);
          if (!error) {
            setRecentChatUsers((prev) => [...prev, data[0]]);

            // remove duplicates
            setRecentChatUsers((prev) => [...new Set(prev.map((user) => user.id))].map((id) => prev.find((user) => user.id === id)));
          }
        } );
      }
  };


  useEffect(() => {
    setActivebutton("chat");
    fetchRecentChatUsers();
  }, []);

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
          fetchRecentChatUsers();
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="chat-section-container">
        <div className="chat-section">
          <div className="chat-section-header">
            <div className="chat-user-search-container">
              <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Search for users"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
                <div className="search-icon-container">
                  <PersonSearchIcon
                    className="search-icon"
                    type="submit"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="chat-section-body-container">
            <div className="chat-section-body">
              {searchTerm.length > 0 &&
                isSearching === false &&
                searchTerm === previuosSearch &&
                users?.map((fetcheduser) => (
                  <Link
                    to={`/messagechannel/${fetcheduser.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <div className="user-card">
                      <div className="user-image">
                        <img src={fetcheduser.avatar} alt="" />
                      </div>
                      <div className="user-details">
                        <div className="fetcheduser-name">
                          {fetcheduser.name}
                        </div>
                        <div className="fetcheduser-description">
                          {fetcheduser.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              {users?.length === 0 && user != null ? (
                <div className="no-user-found">No user found</div>
              ) : (
                <div className="Loading"></div>
              )}
              {recentChatUsers?.length > 0 &&
                searchTerm.length === 0 &&
                recentChatUsers?.map((recentChatUser) => (
                  <Link
                    to={`/messagechannel/${recentChatUser.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <h2>{recentChatUser.name}</h2>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
