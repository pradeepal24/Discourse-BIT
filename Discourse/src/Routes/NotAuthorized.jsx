import React from "react";
import image from '../assets/404.png'
import { Link } from "react-router-dom";
const NotAuthorized = () =>{
    return(
        <div style={{textAlign:'center',marginTop:'10%'}} >
            
            
            <Link to="/" style={{fontFamily:'sans-serif',fontWeight:'bold', fontSize:'900',textDecoration: "none", color: "black" }}>
            <p>Click ➡️</p>
           <p style={{fontFamily:'sans-serif',fontWeight:'bold', fontSize:'900',color:'blue' }} > Return to login page !
            </p> 
            </Link>
            <img src={image} alt="error" />
        </div>
    )
}
export default NotAuthorized;