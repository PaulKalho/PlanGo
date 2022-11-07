import React, { useState } from "react"
import { useEffect } from "react";
import axiosInstance from "../../axios"


function Overview () {
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
                setTotalInc(amount);
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
                setTotalOut(amount);
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
        <div className="p-5 flex flex-col text-center">
            <h1>Fixe Ausgaben:</h1>
            <div>{totalOut}</div>
        </div>
        <div className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center">
                <h1>Fixe Einnahmen:</h1>
                <div>{totalInc}</div>
            </div>
        </div>
        <div className="self-end border-solid p-5 border-black">Statistiken -</div>
    </div>
  )
};

export default Overview;
