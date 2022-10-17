import { Outlet, Navigate } from "react-router-dom"
import React from "react"

// TODO: 
// VALIDATE ACCESSTOKEN

const PrivateRoutes = ({children, ...rest}) => {
    let auth = {'token': false}
    if(localStorage.getItem('access_token')) {
        auth.token = true;
    }else {
        auth.token = false;
    }

    return(
        auth.token ? <Outlet/> : <Navigate to="/" />
    )
}

export default PrivateRoutes;
