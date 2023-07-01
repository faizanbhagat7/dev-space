import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from "../backend/supabaseConfig"
import { LoginContext } from '../context/LoginContext'
import { useSession } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'


const Register = () => {
    const { user, setUser, session, setSession } = useContext(LoginContext)
    const Session = useSession()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async (event) => {
        event.preventDefault()
        supabase.auth.signUp({
            email: email,
            password: password
        }).then((data) => {
            supabase.from('profiles').insert(
                { id: data.data.user.id,
                     name: username,
                     avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPZNFpkJSy6LmJ9T9pg7QXLlU-eLWyblScCc1qaDXORkI5fqoQ9-AigZxvBjWjM_J_eEE&usqp=CAU"                  
                    }
            ).then((data) => {
                navigate("/")
                alert("User created successfully")
            }).catch((error) => {
                alert(error)
            })
        }).catch((error) => {
            alert(error)
        }
        )
    }


    return (
        <>
            <div style={{ width: "100%", height: "100vh", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                <div style={{ border: "2px solid green", padding: "20px" }}>
                    <h1>Register</h1>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="username">Username</label><br />
                        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} /><br /> <br />
                        <label htmlFor="email">Email</label><br />
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /> <br /><br />
                        <label htmlFor="password">Password</label> <br />
                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /> <br /><br />
                        <button type="submit">Register</button>
                    </form>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </>
    )
}

export default Register