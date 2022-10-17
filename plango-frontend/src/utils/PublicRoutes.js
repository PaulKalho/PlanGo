import { Outlet, Navigate } from "react-router-dom"
import React from "react"

const PublicRoutes = ({children, ...rest}) => {
    let auth = {'token': false}
    if(localStorage.getItem('access_token')) {
        auth.token = true;
    }else {
        auth.token = false;
    }

    return(
        auth.token ? <Navigate to="/dashboard" /> : <Outlet/>
    )
}

export default PublicRoutes;
