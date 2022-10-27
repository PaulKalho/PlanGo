import React, { useEffect } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"

function TransactionList ({transactions}) {
    return (
        <div>
            <table className="min-w-full">
                <thead className="bg-white border-b">
                    <tr>
                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">Datum</th>
                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">Kreditor</th>
                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">Amount</th>
                        <th></th>
                    </tr>
                </thead>
                {
                    // testData[0].transactions.booked.map(item => {
                    //     return( 
                    //         <tr>
                    //             <td> {item.bookingDate }</td>
                    //             <td> {item.creditorName} </td> 
                    //             <td> {item.transactionAmount.amount} </td>
                    //         </tr>
                    //     )
                    // })
                }
                {
                    
                    //Sort:
                    transactions.sort( (a,b) => {
                        return new Date(b.bookingDate) - new Date(a.bookingDate);
                    }).map(item => {
                        return(
                            <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.creditor}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.value}</td>
                                <td><BsThreeDotsVertical /></td>
                            </tr>
                        )
                    })

                    // testData.transactions.booked.map(item => {
                    //     return <li> {item.creditorName} </li>
                    // })


                    // testData.map(item => {
                    //     return <li>{item.transactions.booked[0].creditorName}</li>
                    // })
                }
            </table>
        </div>
    )
};

export default TransactionList;