import React,{useState,useEffect,useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'

const Test = () => {
    const { activebutton, user,setActivebutton} = useContext(LoginContext);
    useEffect(() => {
        setActivebutton('tests');
    }, [])
  return (
    <>
        Test
    </>
  )
}

export default Test
