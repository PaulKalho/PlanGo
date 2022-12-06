import React, { useEffect, useState } from "react"
import axiosInstance from "../../axios";
import NavbarMain from "../main/NavbarMain";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import 'chart.js/auto';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    defaults
  } from 'chart.js';
  import {
    Chart,
    Pie
  } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip);
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
        const arr=[];

        statisticData.forEach((el) => {
            //Set initial pieData for each month!
            const pieData= {
                labels: [],
                datasets: [{
                    label: "Amount",
                    data: [],
                    borderWidth: 1,
                }]
            };
            const date = new Date(el.month);
            console.log(monthNames[date.getMonth()]);
            arr.push(<div key="123">{monthNames[date.getMonth()] + " " + date.getFullYear()}</div>)
            el.group.forEach((group) => {
                pieData.labels.push(group.name);
                pieData.datasets[0].data.push(group.amount);
            })
            arr.push(
            <div className="w-80">
            <Pie 
                data={pieData} 
                options={{
                    maintainAscpectRatio: false,
                }} 
            />
            
            </div>)
            
        })
        return arr
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
            {renderMonths()}      
        </div>
    </div>
  )
};

export default Statistic;
