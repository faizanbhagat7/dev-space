import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import "./chat.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader.jsx";

const Chat = () => {
  const { activebutton, user, setActivebutton ,darkMode} = useContext(LoginContext);

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
    setLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select()
      .or(`senderId.eq.${user.id},recieverId.eq.${user.id}`)
      .order("created_at", { ascending: false });

    let recentChatUsers = [];
    if (!error) {
      let recentChatUsersId = [];
      for (let i = 0; i < data.length; i++) {
        if (recentChatUsersId.includes(data[i].senderId)) {
          continue;
        } else if (recentChatUsersId.includes(data[i].recieverId)) {
          continue;
        } else {
          if (data[i].senderId === user.id) {
            recentChatUsersId.push(data[i].recieverId);
          } else {
            recentChatUsersId.push(data[i].senderId);
          }
        }
      }

      for (let i = 0; i < recentChatUsersId.length; i++) {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", recentChatUsersId[i]);
        recentChatUsers.push(userData[0]);
      }
      setRecentChatUsers(recentChatUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    setActivebutton("chat");
    fetchRecentChatUsers();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("chats-realtime")
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
      <div className="chat-section">
        <div className="chat-section-header">
          <div className="chat-user-search-container">
            <form className="form" onSubmit={(e) => handleSubmit(e)}
            style={{
              backgroundColor:darkMode ? '#1f1f1f' : 'white',
              color:darkMode ? 'white' : 'black'
            }}
            >
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Search for users"
                  className="search-input"
                  value={searchTerm}
                  style={{
                    backgroundColor:darkMode ? '#1f1f1f' : 'white',
                    color:darkMode ? 'white' : 'black'
                  }}
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

        <div className="chat-section-body">
          {searchTerm.length > 0 &&
            isSearching === false &&
            searchTerm === previuosSearch &&
            users?.map((fetcheduser) => (
              <Link
                to={`/messagechannel/${fetcheduser.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="recentchat-template"
                style={{
                  backgroundColor:darkMode ? '#1f1f1f' : 'white',
                  color:darkMode ? 'white' : 'black',
                  boxShadow:darkMode?'0px 0px 2px gray':''
                }}
                >
                  <div className="recentchat-image">
                    <img src={fetcheduser.avatar} alt="" />
                  </div>
                  <div className="recentchat-details"
                  style={{
                    backgroundColor:darkMode ? '#1f1f1f' : 'white',
                    color:darkMode ? 'white' : 'black'
                  }}
                  >
                    <div className="recentchat-name">{fetcheduser.name}</div>
                    <div className="recentchat-description">
                      {fetcheduser.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {users?.length === 0 && user != null && searchTerm.length > 0 ? (
            <div className="no-user-found"
            style={{
              color:darkMode ? 'white' : 'black'
            }}
            >No user found</div>
          ) : (
            <div className="Loading"></div>
          )}

          {recentChatUsers?.length > 0 && searchTerm.length === 0 && (
            <div className="recentchats-label">
              <p> Recent Chats </p>
            </div>
          )}
          {
            loading && <Loader />
          }
          {
            recentChatUsers?.length === 0 && searchTerm.length === 0 && !loading && <div 
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "70vh",
                fontSize: "2rem",
                color: "black",
                fontFamily:'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
              }}
            ><div
              style={{
                color:darkMode ? 'white' : 'black'
              }}
            >No recent chats</div></div>
          }
          {recentChatUsers?.length > 0 &&
            searchTerm.length === 0 &&
            recentChatUsers?.map((recentChatUser) => (
              <Link
                to={`/messagechannel/${recentChatUser.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="recentchat-template"
                  style={{
                    backgroundColor:darkMode ? '#1f1f1f' : 'white',
                    color:darkMode ? 'white' : 'black',
                    boxShadow:darkMode?'0px 0px 2px gray':''
                  }}
                >
                  <div className="recentchat-image">
                    <img
                      src={recentChatUser.avatar}
                      alt=""
                    />
                  </div>
                  <div className="recentchat-details">
                    <div className="recentchat-name">{recentChatUser.name}</div>
                    <div className="recentchat-description">
                      {recentChatUser.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Chat;
