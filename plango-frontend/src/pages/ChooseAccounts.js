import React, {useState, useEffect} from "react"
import axiosInstance from "../axios";
import { Button } from "@material-tailwind/react";
import {Link} from "react-router-dom"

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
            <Link key={i} to={`./app/${i+1}`}>
                <Button className="w-50">Account Nr. { i + 1 }</Button>
            </Link>
            )
        }
        return arr;
    }

    return (
        <div>
        {/* Auf dieser Seite werden n Buttons dargestellt die die Accounts sind */}
        <div className="grid h-screen w-full place-items-center">
          <h1>Wir haben { amount } Account gefunden wähle einen aus und starte in die App</h1>
          {renderAccounts()}
        </div>
        </div>
    )
};

export default ChooseAccount;
