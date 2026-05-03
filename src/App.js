import React, { useState } from "react";
import Main from "./Main";
import { supabase } from "./backend/supabaseConfig";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { LoginContext } from "./context/LoginContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [activebutton, setActivebutton] = useState(null);

  const fetchUserProfile = async (session) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!data) {
      // auto-create profile
      await supabase.from("profiles").insert([
        { id: session.user.id, name: "New User" }
      ]);
    }

    setUser(data);
  };

  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
        fetchUserProfile,
        activebutton,
        setActivebutton
      }}
    >
      <SessionContextProvider supabaseClient={supabase}>
        <Main />
      </SessionContextProvider>
    </LoginContext.Provider>
  );
};

export default App;
