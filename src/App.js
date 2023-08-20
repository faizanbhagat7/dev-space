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
  const [darkMode, setDarkMode] = useState(false);
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
          darkMode,
          setDarkMode
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
