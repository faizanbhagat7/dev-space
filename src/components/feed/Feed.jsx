import React ,{ useState, useEffect, useContext} from 'react'
import { LoginContext } from '../../context/LoginContext'

const Feed = () => {

    const { activebutton, setActivebutton} = useContext(LoginContext);

    useEffect(() => {
        setActivebutton('feed');
    }, [])

  return (
    <>
        Application Feed
    </>
  )
}

export default Feed
