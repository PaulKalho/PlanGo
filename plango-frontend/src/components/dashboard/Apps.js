import React, { useEffect, useState } from 'react'
import AppItem from './AppItem'
import {BsFillPlugFill, BsListTask, BsCashCoin, BsFillCloudFill, BsFillAlarmFill} from "react-icons/bs"
import axiosInstance from '../../axios'
import ClipLoader from "react-spinners/ClipLoader"


function Apps({setErrors}) {
    const[bankLoading, setBankLoading] = useState(false);
    const[navigate, setNavigate] = useState(""); 

    useEffect(() => {
        const isAuthBank = async () => {
            try {
              setBankLoading(true)
              await axiosInstance.get("api/bank/checkacc/").then((res) => {
                let result = res.data.accounts;
                    
                if(result > 0) {
                    setNavigate("/accounts");
                }
                    
              })
            } catch(err) {
              setErrors(err)
              setBankLoading(false)
            } finally {
              setBankLoading(false)
            }
          }
          isAuthBank();
    }, []);

    return (
    <div className='w-full p-4'>
        <div className='grid grid-cols-4 gap-4'>
            <AppItem icon={<BsFillPlugFill size={35}/>} title="Server überwachung" name="server"/>
            <AppItem icon={<BsListTask size={35}/>} title="Todo Liste" name="todo"/>
            { !bankLoading ?<AppItem icon={<BsCashCoin size={35}/>} title="Cash List" name="cash" navigate={navigate}/>: <ClipLoader loading={bankLoading} /> }
            <AppItem icon={<BsFillCloudFill size={35}/>} title="Cloud" name="cloud"/> 
            <AppItem icon={<BsFillAlarmFill size={35}/>} title="Sehr wichtig" name="important"/>
        </div>
    </div>
    )
}

export default Apps

