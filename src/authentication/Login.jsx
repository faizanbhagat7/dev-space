import React,{useState,useffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { supabase } from '../backend/supabaseConfig'


const Login = () => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
    
    const handleLogin = async (event) => {
        event.preventDefault()
        supabase.auth.signInWithPassword({
            email:email,
            password:password
        }).then((data) => {
            navigate("/")
            alert("Logged in successfully")
        }).catch((error) => {
            alert(error)
        })
    }

        

  return (
    <>
        <div style={{ width: "100%", height: "100vh", display: 'flex', justifyContent: "center", alignItems: "center" }}>
            <div style={{border:"2px solid green",padding:"20px"}}>
                <h1>Login</h1>
                <form onSubmit={handleLogin}> 
                    <label htmlFor="email">Email</label><br />
                    <input type="email" value={email} onChange={(event)=>{setEmail(event.target.value)}}/> <br /><br />
                    <label htmlFor="password">Password</label> <br />
                    <input type="password" value={password} onChange={(event)=>{setPassword(event.target.value)}}/> <br /><br />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    </>
  )
}

export default Login