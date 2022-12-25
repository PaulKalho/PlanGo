import React, { useContext, useState } from "react";
import Apps from "../components/dashboard/Apps";
import Calendar from "../components/dashboard/Calendar";
import ToDo from "../components/dashboard/TodoList";
import NavbarMain from "../components/main/NavbarMain";
import NotificationContext from "../context/notificationContext";

function Dashboard() {
    const [error, setError] = useState([])
    return(
        <div>
            {/* {notificationCtx.success("erfolgreich hinzugefügt")} */}
            <NavbarMain />
            <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
                <div className="py-4">
                    <h1 className='font-medium leading-tight text-3xl mt-0 mb-2 text-blue-600'>Dashboard:</h1>
                    <div className="h-max w-full grid grid-cols-[60%_40%]">   
                        <Calendar />
                        <ToDo />
                        <div className="col-span-full">
                            <Apps setErrors={setError}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard