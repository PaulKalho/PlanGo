import React from "react"
import {Link} from "react-router-dom"

function AppItem({icon, title, name, navigate}){

  const path = navigate ? navigate : "";

  return (
    <div className>
        <Link to={
          `./${name}${path}`      
      }>
            <div className="flex flex-col h-auto text-center justify-center bg-slate-200 border rounded-lg px-2 py-12  ">
                <div className="self-center mb-8">{icon}</div>
                <h1>{title}</h1>
            </div>
        </Link>
    </div>

  )
};

export default AppItem