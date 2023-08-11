import React,{useState,useEffect,useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'
import {supabase} from '../../backend/supabaseConfig'
import {useParams} from 'react-router-dom'
import Loader from '../loader/Loader'
import './bookmark.css'
import Feedcard from '../feed/Feedcard'

const Bookmark = () => {

    const [fetching, setFetching] = useState(false)
    const [savedPosts, setSavedPosts] = useState([])
    const {profileId} = useParams()

    useEffect(() => {
        fetchSavedPosts()
    }, [savedPosts])

    const fetchSavedPosts = async () => {
        setFetching(true)
        const {data,error} = await supabase
        .from('bookmarks')
        .select('postId')
        .eq('userId',profileId)
        .order('created_at', { ascending: false })
        if(error){
            setFetching(false)
            console.log(error)
            return
        }
        if(data?.length > 0){
            const posts = []
            for(let i=0;i<data.length;i++){
                const {data:post,error:postError} = await supabase
                .from('posts')
                .select('*')
                .eq('id',data[i].postId)
                if(postError){
                    setFetching(false)
                    console.log(postError)
                    return
                }
                posts.push(post[0])
            }
            setSavedPosts(posts)
            setFetching(false)
            return
        }
        setFetching(false)
        return
    }

    // console.log(savedPosts)

    return (
    <>
         {savedPosts.length > 0 ? (
        <div className="bookmarkFeed-container">
          {savedPosts?.map((post) => (
            <Feedcard feed={post} getFeed={fetchSavedPosts} />
          ))}
        </div>
      ) : fetching ? (
        <Loader />
      ) : (
        <div className='noFeed-text'>
        <div >There are no posts saved </div>
        </div>
      )}
    </>
  )
}

export default Bookmark
