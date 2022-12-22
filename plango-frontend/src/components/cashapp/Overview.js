import React, { useState } from "react"
import { useEffect } from "react";
import axiosInstance from "../../axios"
import { BsFillPieChartFill, BsArrowBarRight } from "react-icons/bs"
import {Link} from "react-router-dom"



function Overview ({budget}) {
  const[loading, setLoading] = useState(false);
  const[totalInc, setTotalInc] = useState(0);
  const[totalOut, setTotalOut] = useState(0);

  useEffect(() => {
    // Load fixIncome and fixOutcome and calc total
    const fetchData = async () => {
      try{
        await axiosInstance
              .get("api/income/")
              .then(res => {
                console.log("Income:" + res);
                let amount = 0;
                let income = res.data
                income.map((element) => {
                  amount += parseFloat(element.amount)
                })
                setTotalInc(amount.toFixed(2));
              })
              .catch(err => {
                console.log(err)
              })
        
        await axiosInstance
              .get("api/outcome/")
              .then(res => {
                console.log("Outcome:" + res.data);
                const outcome = res.data

                let amount = 0
                outcome.map((element) => {
                  amount += parseFloat(element.amount)
                })

                setTotalOut(amount.toFixed(2));
              })
              .catch(err => {
                console.log(err)
              })
            
      }catch(err){
        console.log(err)
        setLoading(false)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-row border-solid">
        <div className="p-5 border-black ">
          <div className="border p-5 flex flex-col text-center rounded-md bg-red-400">
              <h1>Fixe Ausgaben:</h1>
              <div className="font-bold">{totalOut}</div>
          </div>
        </div>
        <div className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center rounded-md bg-green-400">
                <h1>Fixe Einnahmen:</h1>
                <div className="font-bold">{totalInc}</div>
            </div>
        </div>
        <Link to="statistik" className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center rounded-md">
                <div className="flex flex-row items-center"><h1>Statistiken </h1><BsArrowBarRight size={20}/></div>
                <div className="mx-auto"><BsFillPieChartFill size={25}/></div>
            </div>
        </Link>
        <div className="p-5 border-black">
          <div className="border p-5 flex-col text-center rounded-md">
            <h1>Restbudget pro Tag:</h1>
            <div className="font-bold">{budget}</div>
          </div>
        </div>
    </div>
  )
};

export default Overview;
