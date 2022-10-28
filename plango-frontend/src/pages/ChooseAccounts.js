import React, {useState, useEffect} from "react"
import axiosInstance from "../axios";
import SyncLoader from "react-spinners/SyncLoader"
import {Link} from "react-router-dom"
import NavbarMain from "../components/main/NavbarMain";
import { BsFillPencilFill, BsArrowRight } from "react-icons/bs";

function ChooseAccount () {

    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {

          const payload = {
            "user": "tester"
          }
        //   const arr = [];
          try {
            setLoading(true)
            await axiosInstance.post("api/bank/accounts/", payload).then((res) => {
              console.log(res)
              
              setAmount(res.data)
            });
          } catch(errorMessage) {
            setLoading(false)
          }
          setLoading(false)
          
        }
    
        fetchData()
    }, []);

    const renderAccounts = () => {
        const arr = [];
        //setLoading(true);
        for(let i=0; i < amount; i++) {
            arr.push(
              <div className="p-4 border-2 rounded w-full">
                <Link key={i} to={`./app/${i+1}`} className="flex flex-row gap justify-between">
                  <div className="flex flex-row gap-4">
                    <div className="">Account Nr. { i + 1 }</div>
                    <div className="self-center"><BsFillPencilFill /></div>
                  </div>
                    <div className="self-center "><BsArrowRight /></div>
                </Link>
              </div>
            )
        }

        return arr;
        
    }


    
    return (
        <div className="grid h-screen w-full place-items-center">
        {/* Auf dieser Seite werden n Buttons dargestellt die die Accounts sind */}
          <NavbarMain />
          <div className="flex flex-col h-screen w-2/5 place-items-center gap-4 m-10 ">
            <div className="text-lg"><h1>Wähle einen deiner Accounts:</h1></div>
            { loading ? <SyncLoader size="8px" color="lightgrey" /> : renderAccounts()}
          </div>
        </div>
    )
        
};

export default ChooseAccount;
