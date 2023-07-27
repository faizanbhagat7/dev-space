import React,{useState,useEffect,useContext} from 'react'
import './FollowersPage.css'
import { LoginContext } from '../../context/LoginContext'
import { supabase } from '../../backend/supabaseConfig'
import { Link } from 'react-router-dom'

const FollowersPage = () => {
    const {user} = useContext(LoginContext)
    const [followers,setFollowers] = useState([])

    const fetchFollowerProfiles = async () => {
        const {data,error} = await supabase
        .from('profiles')
        .select()
        .in('id',user?.followers)
        if(error){
            console.log(error)
            return
        }
        setFollowers(data)
    }

    useEffect(() => {
        fetchFollowerProfiles()
    }, [])

    return (
    <>
        <div className='followers-container'>
    {
        user?.followers?.length === 0 ? <h1>No followers yet</h1> : <h1>Followers</h1>
    }
    
         {followers.length > 0 &&
            followers?.map((fetcheduser) => (
              <Link
                to={`/profile/${fetcheduser.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="follower-card">
                  <div className="follower-image">
                    <img src={fetcheduser.avatar} alt="" />
                  </div>
                  <div className="follower-details">
                    <div className="follower-name">{fetcheduser.name}</div>
                  </div>
                </div>
              </Link>
            ))}

</div>
    </>
  )
}

export default FollowersPage
