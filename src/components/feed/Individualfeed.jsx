import React,{useState,useEffect} from 'react'
import './Individualfeed.css'
import {supabase} from '../../backend/supabaseConfig'
import {useParams} from 'react-router-dom'
import Feedcard from './Feedcard'
import Loader from '../loader/Loader'
import { Feed } from '@mui/icons-material'


const Individualfeed = () => {

    const {postId} = useParams()
    const [feed, setFeed] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [openCommentDefault, setOpenCommentDefault] = useState(true);

    const getFeed = async () => {
        setFetching(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq('id',postId)
    
        setFeed(data);
        setFetching(false);
      };

    useEffect(() => {
        getFeed()
    }, [])

    return (<>
    
    {feed.length > 0 ? (
        <div className="post-container">
          {
            feed?.map((post) => <Feedcard feed={post} getFeed={getFeed} openCommentDefault={openCommentDefault} setOpenCommentDefault={setOpenCommentDefault} />)
          }
        </div>
      ) : fetching && (
        <Loader />
      )}

    </>
  )
}

export default Individualfeed