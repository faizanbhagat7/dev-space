import React, { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext.js";
import { useContext } from "react";
import "./Users.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const Users = () => {
  const { user, session, activebutton, setActivebutton , recommendedUsers, fetchRecommendedUsers} =
    useContext(LoginContext);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [previuosSearch, setPreviousSearch] = useState("");

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
    setUsers(data);
    setLoading(false);
    setIsSearching(false);
  };

  console.log(recommendedUsers);

  useEffect(() => {
    setActivebutton("search");
    if (recommendedUsers.length === 0) {
      fetchRecommendedUsers();
    }
  }, []);

  return (
    <>
      <div className="search-section">
        <div className="search-section-header">
          <p>Explore Developers</p>
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
          {searchTerm.length > 0 &&
            isSearching === false &&
            searchTerm === previuosSearch &&
            users?.map((fetcheduser) => (
              <Link
                to={`/profile/${fetcheduser.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="user-card">
                  <div className="user-image">
                    <img src={fetcheduser.avatar} alt="" />
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

          {users?.length === 0 && user != null ? (
            <div className="no-user-found">No user found</div>
          ) : (
            <div className="Loading"></div>
          )}

          {searchTerm.length === 0 && users === null && (
            <div className="recommendations">
              {
                  recommendedUsers.length !== 0 && (
              <div className="recommendations-header">
                <p>Recommended for you</p>
              </div>
                  )}
              
              <div className="recommendations-body">
                {recommendedUsers?.map((recommendedUser) => (
                  <Link
                    to={`/profile/${recommendedUser.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <div className="recomended-user-card">
                      <div className="recomended-user-image">
                        <img src={recommendedUser.avatar} alt=""
                        />
                      </div>
                      <div className="recomended-user-details">
                        <div className="recomended-user-name">
                          {recommendedUser.name}
                        </div>
                        <div className="recomended-user-description">
                          {recommendedUser.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
