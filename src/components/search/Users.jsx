import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../backend/supabaseConfig.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext.js";
import "./Users.css";
import Loader from "../loader/Loader.jsx";

const UserCard = ({ u, delay = 0 }) => {
  const avatar = u?.avatar || u?.image;
  return (
    <Link to={`/profile/${u.id}`} style={{ textDecoration: "none" }} className={`user-card stagger-${Math.min(delay + 1, 5)}`}>
      <div className="user-avatar">
        {avatar
          ? <img src={avatar} alt={u.name} />
          : <div className="user-avatar-fallback">{u?.name?.[0]?.toUpperCase()}</div>
        }
      </div>
      <div className="user-info">
        <div className="user-name-text">{u.name}</div>
        <div className="user-desc-text">{u.description || "developer"}</div>
      </div>
      <span className="user-arrow">→</span>
    </Link>
  );
};

const Users = () => {
  const { user, setActivebutton } = useContext(LoginContext);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  const fetchRecommendedUsers = async () => {
    if (!user) return;
    const following = Array.isArray(user?.following) ? user.following : [];
    let list = [];

    const { data: skillMatch } = await supabase
      .from("profiles").select().neq("id", user.id)
      .filter("skills", "ilike", `%${user?.skills || ""}%`).limit(5);
    if (skillMatch) list = [...list, ...skillMatch];

    const { data: recent } = await supabase
      .from("profiles").select("*").neq("id", user.id).order("id", { ascending: false }).limit(5);
    if (recent) list = [...list, ...recent];

    // Dedup + remove already followed
    const seen = new Set();
    const filtered = list.filter(u2 => {
      if (seen.has(u2.id) || following.includes(u2.id)) return false;
      seen.add(u2.id);
      return true;
    });
    setRecommendedUsers(filtered.slice(0, 8));
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    const { data } = await supabase.from("profiles").select().ilike("name", `%${searchTerm}%`).neq("id", user.id);
    setUsers(data || []);
    setLoading(false);
  };

  const handleClear = () => { setSearchTerm(""); setUsers(null); };

  useEffect(() => {
    setActivebutton("search");
    fetchRecommendedUsers();
  }, []);

  return (
    <div className="search-section">
      <div className="search-section-header">
        <p>Explore Devs</p>
        <form className="form" onSubmit={handleSearch}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Search developers..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); if (!e.target.value) setUsers(null); }}
              className="search-input"
            />
          </div>
          <div className="search-icon-container" onClick={handleSearch}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:18}}>⌕</span>
          </div>
        </form>
      </div>

      {loading && <Loader />}

      {!loading && users !== null && (
        <>
          <div className="search-section-label">// results for "{searchTerm}"</div>
          {users.length === 0
            ? <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-muted)',padding:'20px 0'}}>// no users found</div>
            : <div className="users-list">{users.map((u, i) => <UserCard key={u.id} u={u} delay={i} />)}</div>
          }
        </>
      )}

      {users === null && !loading && (
        <>
          <div className="search-section-label">// recommended for you</div>
          <div className="users-list">
            {recommendedUsers.map((u, i) => <UserCard key={u.id} u={u} delay={i} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
