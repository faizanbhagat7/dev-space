import React,{useState,useEffect} from 'react'
import Main from './Main'
import {supabase} from "./backend/supabaseConfig"
import {SessionContextProvider,useSession} from "@supabase/auth-helpers-react"
import {LoginContext} from "./context/LoginContext"



const App = () => {
  const Session = useSession()
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  return (
    <>
    <LoginContext.Provider value={{user,setUser,session,setSession}} >
    <SessionContextProvider supabaseClient={supabase}>
      <Main />
    </SessionContextProvider>
    </LoginContext.Provider>
    </>
  )
}

export default App