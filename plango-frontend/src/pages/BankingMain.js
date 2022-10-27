import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import TransactionList from "../components/cashapp/TransactionList";

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
                    console.log(res.data.transactions);
                    //setTransactions(res.data.transactions)
                    //console.log(transactions)

                    let resultBooked = res.data.transactions.transactions.booked
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

    if(loading) {
        return(
            <h1>LOADING...</h1>
        )
    }else {
        return(
            <div>
            {/* GET ID FROM URL AND MACHE REQUEST */}
                <TransactionList transactions={transactions} />
            </div>
        )
    }

};

export default BankingMain;
