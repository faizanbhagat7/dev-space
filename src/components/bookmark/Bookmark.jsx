import React,{useState,useEffect,useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'


const Bookmark = () => {

    const { activebutton, user,setActivebutton} = useContext(LoginContext);
    useEffect(() => {
        setActivebutton('bookmarks');
    }, [])

    return (
    <>
        Saved Posts
    </>
  )
}

export default Bookmark
