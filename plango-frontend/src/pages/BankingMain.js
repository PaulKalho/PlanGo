import { Breadcrumbs } from "@material-tailwind/react";
import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axios";
import TransactionList from "../components/cashapp/TransactionList";
import NavbarMain from "../components/main/NavbarMain";

function BankingMain() {

    const { accountId } = useParams()
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([""])

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                // accountId - 1 da im backend als arrayPos behandelt wird
                "id": accountId-1,
                "user": "tester"
            }
            
            const arr = [];
            try {
                setLoading(true)
                await axiosInstance.post("api/bank/transactions/", payload).then((res) => {
                    console.log(res.data.transactions.booked);
                    //setTransactions(res.data.transactions)
                    //console.log(transactions)

                    let resultBooked = res.data.transactions.booked
                    resultBooked.map((transaction) => {
                        arr.push({
                            date: transaction.bookingDate,
                            creditor: transaction.creditorName,
                            value: transaction.transactionAmount.amount,
                        }) 

                        setTransactions(arr);
                    })
                }).catch(err => {
                    console.log(err);
                });
            } catch(err) {
                console.log(err)
                setLoading(false)
            }
            setLoading(false)  
        }
        fetchData()
    }, []);
    return (
        <div>
            <NavbarMain />
            {/* GET ID FROM URL AND MACHE REQUEST */}
            <Breadcrumbs className="bg-transparent">
                <Link 
                    className="hover:underline bg-transparent"
                    to="/dashboard/cash/accounts/"
                >
                    Accounts wählen
                </Link>
                <Link                        
                    className="hover:underline font-bold"
                >
                    Transaktionen
                </Link>
            </Breadcrumbs>
            <TransactionList transactions={transactions} loading={loading} />
        </div>
    )

};

export default BankingMain;
