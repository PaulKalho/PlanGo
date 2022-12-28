import React, { useEffect, useState, useContext } from "react"
import axiosInstance from "../../axios";
import NavbarMain from "../main/NavbarMain";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import 'chart.js/auto';
import NotificationContext from "../../context/notificationContext";

//Models 
import m_BarData from "../../utils/models/procedures/m_BarData";
import m_PieData from "../../utils/models/procedures/m_PieData";


import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    defaults
  } from 'chart.js';
  import {
    Chart,
    Pie,
    Bar
  } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip);
function Statistic () {
    

    const { accountId } = useParams()
    const [statisticData, setStatisticData] = useState([])
    const [barData, setBarData] = useState([])
    const [loading, setLoading] = useState(false)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const notificationCtx = useContext(NotificationContext);


    const PieData = new m_PieData();
    const BarData = new m_BarData();

    useEffect(() => {
        // Load transactionIntermediates, Groups
        // TODO: Backend-Endpunkt der eine SQL Abrage macht die das zurückgibt: (JOIN TRANSACTION INTERMEDIATE WITH )
        // group-name | amount | month |
        // ------------------------------
        // Sparen     | 345    | JUN   |
        // Test       | 245    | JUN   |
        // Gockel     | 150    | MAI   |


        const initialize = async () => {
            try {
                setLoading(true)
                await PieData.m_PieData_runProcedure(accountId-1);
                await BarData.m_BarData_runProcedure(accountId-1);

                //Set States:
                setStatisticData(PieData.m_PieData_Data);
                setBarData(BarData.m_BarData_Data);
            } catch (error) {
                console.log(error);
                notificationCtx.error(error);
            } finally {
                setLoading(false)
            }
        }

        initialize()
    }, [])


    const renderMonths = () => {
        const arr=[];
        if(loading === false) {
            statisticData.forEach((el, index) => {
                //Set initial pieData for each month!
                const pieData= {
                    labels: [],
                    datasets: [{
                        label: "Amount",
                        data: [],
                        borderWidth: 1,
                    }]
                };
                let labels = ['Einkommen', 'Ausgaben']
                let barDataComputed={
                    labels,
                    datasets: [
                        {
                            label: 'Monat',
                            data: [] 
                        }   

                    ]
                }
                console.log(index)
                const date = new Date(el.month);
                console.log(monthNames[date.getMonth()]);
                console.log(barData[index])
                
                // Month
                arr.push(<div key={monthNames[date.getMonth()] + date.getFullYear }>{monthNames[date.getMonth()] + " " + date.getFullYear()}</div>)
                
                // Build Pie Data
                el.group.forEach((group) => {
                    pieData.labels.push(group.name);
                    pieData.datasets[0].data.push(group.amount);
                })
                barData[index].data.forEach((el) => {
                    barDataComputed.datasets[0].data.push(el.income)
                    barDataComputed.datasets[0].data.push(Math.abs(el.expenses))
                })

                arr.push(
                <div className="inline-flex">
                    <div className="w-80">
                    <Pie 
                        data={pieData} 
                        options={{
                            maintainAscpectRatio: false,
                        }} 
                    />
                    

                    </div>
                    <div className="w-100">
                        <Bar
                            data={barDataComputed}
                            options={{
                                maintainAspectRatio: false,
                            }}
                    />
                    </div>
                </div>
                )
                
            })
        }else {
            arr.push(
                <div>
                    Building your Statistic-Data...
                </div>
            )
        }
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
