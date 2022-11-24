import React, { useEffect, useState } from "react"
import axiosInstance from "../../axios";
import NavbarMain from "../main/NavbarMain";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";

function Statistic () {
    const { accountId } = useParams()
    const [statisticData, setStatisticData] = useState([])
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        // Load transactionIntermediates, Groups
        // TODO: Backend-Endpunkt der eine SQL Abrage macht die das zurückgibt: (JOIN TRANSACTION INTERMEDIATE WITH )
        // group-name | amount | month |
        // ------------------------------
        // Sparen     | 345    | JUN   |
        // Test       | 245    | JUN   |
        // Gockel     | 150    | MAI   |

        const fetchData = async () => {
            // TransactionIntermediates (we only want the amount per group)
            // 
            axiosInstance
                .get('api/statistics/')
                .then( res => {
                    console.log(res);
                    setStatisticData(res.data);
                })
        }

        fetchData()
    }, [])

    const renderMonths = () => {
        const arr = []
        //console.log(statisticData)

        for (const firstLayerProperty in statisticData) {
            
        }

        // statisticData.forEach(element => {
        //     console.log(element)
        //     //let date = new Date(element)
        //     // element.forEach(IGroup => {
                
        //     // })
        //     //arr.push(<div>{monthNames[date.getMonth()]}</div>)
                
        // })
        
        return arr;
    }
  return (
    <div>
      <div>
            <NavbarMain />
            <Breadcrumbs className="bg-transparent">
                <Link 
                    className="hover:underline bg-transparent"
                    to="/dashboard/cash/accounts/"
                >
                    Accounts wählen
                </Link>
                <Link                        
                    className="hover:underline"
                    to={"/dashboard/cash/accounts/app/" + accountId + "/"}
                >
                    Transaktionen
                </Link>
                <Link
                    className="hover:underline font-bold"
                >
                    Statistik
                </Link>
            </Breadcrumbs>
            {/* Es soll jeder Monat angezeigt werden und die Statistiken dazu */}
            {/* Wie werden die Monate geladen?
                Es werden für den user alle transactiongroup intermediate geholt und nach Monat gruppiert
                TODO: monat aus fixausgaben/income wieder rausnehmen
            */}
            {renderMonths()}

        </div>
    </div>
  )
};

export default Statistic;
