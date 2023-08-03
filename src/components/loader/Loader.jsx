import React from 'react'
import LoaderImage from './loader.gif'

const Loader = () => {
  return (


    <div className="loader" 
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            
        }}
    >
        <img src={LoaderImage} alt="Loading..." width='400px'/>  
    </div>
    
  )
}

export default Loader
