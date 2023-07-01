import React,{useState,useEffect,useContext} from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from './backend/supabaseConfig'
import { LoginContext } from './context/LoginContext'

const Homepage = () => {
  const Session = useSession()
  const {user,setUser,session,setSession} = useContext(LoginContext)
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
      alert("Logged out successfully")
    }
  }
  console.log("This is a user",user)
  return (
    <>
        <h1>homepage</h1>
        <button onClick={handleLogout}>
          LogOut
        </button>
    </>
  )
}

export default Homepage