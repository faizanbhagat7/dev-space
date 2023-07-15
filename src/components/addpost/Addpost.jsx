import React,{useState,useEffect,useContext} from 'react'
import {LoginContext} from '../../context/LoginContext'

const Addpost = () => {

    const { activebutton, user,setActivebutton} = useContext(LoginContext);

    useEffect(() => {
        setActivebutton('add post');
    }, [])
    
  return (
    <>
    
    </>
)
}

export default Addpost
