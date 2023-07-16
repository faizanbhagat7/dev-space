import React, { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext.js";
import { useContext } from "react";

const Users = () => {
  const { user, session, activebutton, setActivebutton } =
    useContext(LoginContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState([]);

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
    // check similarities in words
    // if there are no similarities then fetch the users with the same skills
    // if there are similarities then fetch the users with the same skills and the same interests
    // const { data, error } = await supabase
    //   .from("profiles")
    //   .select()
    //   .neq("id", user.id)
    //   .ilike("skills", `%${user?.skills}.split(" ")%`)
    //   .ilike("description", `%${user?.description}.split(" ")%`)
    //   .textSearch("skills", user?.skills, { type: "plain" })
    //   .textSearch("description", user?.description, { type: "plain" })
    //   .order("id", { ascending: true })
    //   .limit(10);

    // if (data) {
    //   setRecommendedUsers(data);
    // }

    const {data , error} = await supabase
      .from("profiles")
      .select()
      .neq("id", user.id)
      .filter("skills",'in',user?.skills)
      .order("id", { ascending: true })
      .limit(10);
      
      if (data) {
        setRecommendedUsers(data);
      }

    // if (recommendedUsers.length < 10) {
    //   const { data, error } = await supabase
    //     .from("profiles")
    //     .select()
    //     .neq("id", user.id)
    //     .order("id", { ascending: true })
    //     .limit(10);
    //   if (data) {
    //     setRecommendedUsers([...recommendedUsers, ...data]);
    //   }
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .ilike("name", `%${searchTerm}%`)
      .neq("id", user.id);
    setUsers(data);
    setLoading(false);
  };

  console.log(recommendedUsers);

  useEffect(() => {
    setActivebutton("search");
    fetchRecommendedUsers();
  }, []);

  return (
    <>
      <h1>Users</h1>

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

      {/* Recomendatinos */}
      {searchTerm.length === 0 && (
        <div className="recommendations">
          "You can search for users by their name"
        </div>
      )}
    </>
  );
};

export default Users;
