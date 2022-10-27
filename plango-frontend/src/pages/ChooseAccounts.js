import React, {useState, useEffect} from "react"
import axiosInstance from "../axios";
import { Button } from "@material-tailwind/react";
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
              
              setAmount(res.data.accounts)
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
        for(let i=0; i < amount; i++) {
            arr.push(
            <div className="">
              <Link key={i} to={`./app/${i+1}`} className="flex p-4 border-2 rounded w-full justify-content-center">
                  <div className="">Account Nr. { i + 1 }</div>
                  <div className="self-center"><BsFillPencilFill /></div>
                  <div className="self-center"><BsArrowRight /></div>
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
          <div className="w-full">{renderAccounts()}</div>
        </div>
        </div>
    )
};

export default ChooseAccount;
