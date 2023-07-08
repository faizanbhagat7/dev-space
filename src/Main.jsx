import React,{useState,useEffect,useContext} from 'react'
import Register from './authentication/Register'
import Login from './authentication/Login'
import {Routes,Route} from 'react-router-dom'
import {LoginContext} from './context/LoginContext'
import Homepage from "./Homepage"
import {useSession} from '@supabase/auth-helpers-react'
import { supabase } from './backend/supabaseConfig'

const Main = () => {
  const {user,setUser} = useContext(LoginContext) 
  const Session = useSession()


  if(Session!=null && Session.user!=null && Session.user.email!=null ){
    return <Homepage />
  }
  // console.log(Session)
 
  return (
    <>
    <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="*" element={<Login/>}/>
    </Routes>  
    </>
  )
}

export default Main