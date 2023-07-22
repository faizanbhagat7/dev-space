import React, { useState, useEffect } from "react";
import Main from "./Main";
import { supabase } from "./backend/supabaseConfig";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { LoginContext } from "./context/LoginContext";

const App = () => {
  const Session = useSession();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [activebutton, setActivebutton] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const fetchUserProfile = async (Session) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", Session.user.id);
    if (error) {
      console.log(error);
    } else {
      setUser(data[0]);
    }
  };

  const fetchRecommendedUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .neq("id", user?.id)
      .filter("skills", "in", user?.skills)
      .order("id", { ascending: true })
      .limit(6);

    if (data) {
      setRecommendedUsers(data);
    }

    if (recommendedUsers.length < 6) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .textSearch("skills", user?.skills, { type: "plain" })
        .neq("id", user?.id)
        .order("id", { ascending: true })
        .limit(6);
        
      setRecommendedUsers([...recommendedUsers,...data]);
    }

    if (recommendedUsers.length < 6) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .textSearch("description", user?.skills, { type: "plain" })
        .neq("id", user?.id)
        .order("id", { ascending: true })
        .limit(6);
      
        
      setRecommendedUsers([...recommendedUsers,...data]);
    }

    if (recommendedUsers.length < 6) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .neq("id", user?.id)
        .order('created_at', { ascending: false })
        .limit(6);

      setRecommendedUsers([...recommendedUsers, ...data]);
    }


  };

  return (
    <>
      <LoginContext.Provider
        value={{
          user,
          setUser,
          session,
          setSession,
          fetchUserProfile,
          activebutton,
          setActivebutton,
          recommendedUsers,
          fetchRecommendedUsers,
        }}
      >
        <SessionContextProvider supabaseClient={supabase}>
          <Main />
        </SessionContextProvider>
      </LoginContext.Provider>
    </>
  );
};

export default App;
