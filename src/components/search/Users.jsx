import React, { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext.js";
import { useContext } from "react";
import "./Users.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const Users = () => {
  const { user, session, activebutton, setActivebutton } =
    useContext(LoginContext);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .neq("id", user.id);

    if (data) {
      setUsers(data);
      setLoading(false);
    }
    if (error) {
      console.log(error);
    }
  };

  const fetchRecommendedUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .neq("id", user.id)
      .filter("skills", "in", user?.skills)
      .order("id", { ascending: true })
      .limit(10);

    if (data) {
      setRecommendedUsers(data);
    }

    if (recommendedUsers.length < 10) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .textSearch("skills", user?.skills, { type: "plain" })
        .neq("id", user.id)
        .order("id", { ascending: true })
        .limit(10);
      setRecommendedUsers([...recommendedUsers, ...data]);
    }

    if (recommendedUsers.length < 10) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .textSearch("description", user?.skills, { type: "plain" })
        .neq("id", user.id)
        .order("id", { ascending: true })
        .limit(10);
      setRecommendedUsers([...recommendedUsers, ...data]);
    }

    recommendedUsers.map((user) => {
      if (user?.following?.includes(user.id)) {
        recommendedUsers = recommendedUsers.filter(
          (user) => user.id !== user.id
        );
      }
    });

    if (recommendedUsers.length < 10) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .neq("id", user.id)
        .order("id", { ascending: true })
        .limit(10);
      setRecommendedUsers([...recommendedUsers, ...data]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .ilike("name", `%${searchTerm}%`)
      .neq("id", user.id);
    setUsers(data);
    setLoading(false);
    setIsSearching(false);
  };

  console.log(recommendedUsers);

  useEffect(() => {
    setActivebutton("search");
    fetchRecommendedUsers();
  }, []);

  return (
    <>
      {/* 
      <form>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "500px",
            padding: "10px",
            borderRadius: "10px",
            margin: "10px 0px",
          }}
        />
        <button
          type="submit"
          style={{ padding: "10px", borderRadius: "10px", margin: "10px 0px" }}
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Search
        </button>
      </form>

      {loading && <h1>Loading...</h1>}

      {searchTerm.length > 0 &&
        users.map((fetcheduser) => (
          <Link to={`/profile/${fetcheduser.id}`}>
            <div
              className="user-card"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f2f2f2",
                minWidth: "100%",
                margin: "10px",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div className="user-image">
                <img src={fetcheduser.avatar} alt="" width={100} height={100} />
              </div>
              <div className="user-details">
                <div className="user-name">{fetcheduser.name}</div>
                <div className="user-description">
                  {fetcheduser.description}
                </div>
              </div>
            </div>
          </Link>
        ))}

      Recomendatinos
      {searchTerm.length === 0 && (
        <div className="recommendations">
          "You can search for users by their name"
        </div>       
      )} */}

      <div className="search-section">
        <div className="search-section-header">
          <p>Hunt for developers</p>
          <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Search for users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
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

        <div className="search-section-body">
          {searchTerm.length > 0 && isSearching===false  &&
            users?.map((fetcheduser) => (
              <Link to={`/profile/${fetcheduser.id}`}
                style={{textDecoration: "none", color: "black"}}
              >
                <div
                  className="user-card">
                  <div className="user-image">
                    <img
                      src={fetcheduser.avatar}
                      alt=""
                    />
                  </div>
                  <div className="user-details">
                    <div className="fetcheduser-name">{fetcheduser.name}</div>
                    <div className="fetcheduser-description">
                      {fetcheduser.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {
            
              (users?.length === 0 && user!=null)
                 ? (
                <div className="no-user-found">
                  No user found
                </div>
              ):
              (
                <div className="Loading">
                  
                </div>
              )
            }

          {(searchTerm.length === 0 && users===null) && (
            <div className="recommendations">
              Users similar to you
              </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Users;
