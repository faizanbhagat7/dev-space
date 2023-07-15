import React,{useState,useEffect,useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'

const Chat = () => {
    const { activebutton, user,setActivebutton} = useContext(LoginContext);
    useEffect(() => {
        setActivebutton('chat');
    }, [])
  return (
    <>
        Chat
    </>
  )
}

export default Chat
