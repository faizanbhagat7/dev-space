import React, { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext.js";
import { useContext } from "react";

const Users = () => {
  const { user, session } = useContext(LoginContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1>Users</h1>

      {loading && <h1>Loading...</h1>}
      {users.map((fetcheduser) => (
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
              <div className="user-description">{fetcheduser.description}</div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Users;
