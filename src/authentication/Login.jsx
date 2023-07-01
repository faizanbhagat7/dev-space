import React from 'react'
import {Link} from 'react-router-dom'

const Login = () => {
  return (
    <>
        <div style={{ width: "100%", height: "100vh", display: 'flex', justifyContent: "center", alignItems: "center" }}>
            <div style={{border:"2px solid green",padding:"20px"}}>
                <h1>Login</h1>
                <form>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" name="email" id="email" /> <br /><br />
                    <label htmlFor="password">Password</label> <br />
                    <input type="password" name="password" id="password" /> <br /><br />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    </>
  )
}

export default Login