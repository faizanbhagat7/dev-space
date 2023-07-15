import React,{useState,useEffect,useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'

const Resume = () => {
    const { activebutton, user,setActivebutton} = useContext(LoginContext);
    useEffect(() => {
        setActivebutton('create resume');
    }, [])
  return (
    <>
        Resume
    </>
  )
}

export default Resume
