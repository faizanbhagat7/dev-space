import React,{useState,useEffect,useContext} from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from './backend/supabaseConfig'
import { LoginContext } from './context/LoginContext'

const Homepage = () => {
  const Session = useSession()
  const {user,setUser} = useContext(LoginContext)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      alert("Logged out successfully")
    }
  }

  useEffect(() => {
    if (!user || user.id !== Session.user.id){
      fetchUserProfile(Session)
    }
    }, [Session])
    
  const fetchUserProfile = async (Session) => {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', Session.user.id)
    if (error) {
      console.log(error)
    }
    else {
      setUser(data[0])
    }
  }

  if (!user) {
    return (
      <>
     <h1>Loading...</h1>
      </>
    )
  }
  return (
    <>
        <h1>homepage</h1>
        <button onClick={handleLogout}>
          LogOut
        </button> 
        <h1>{user.name}</h1>  
        &nbsp; &nbsp; &nbsp; <img src={user.avatar} alt="avatar" width={100} height={100} style={{borderRadius:"20%",boxShadow:"0px 0px 10px black"}}/>
    </>
  )
}

export default Homepage