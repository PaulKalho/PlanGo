import React, {useState} from "react"
import GridLoader from "react-spinners/GridLoader"
import Dropdown from "../../utils/Dropdown";

function TransactionList ({transactions , loading, categories, setCategories}) {
    //4 Options: fixAusgabe, fixEinnahme, kategorisiert, standart
    const [changeColor, setChangeColor] = useState("bg-white-500")
    if(!loading) {
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

                        //Sort:
                        transactions.sort( (a,b) => {
                            return new Date(b.date) - new Date(a.date);
                        }).map(item => {
                            // console.log(item)
                            //Idee: In array pushen der state ist und gerenderd wird. State ändern in child component
                            return(
                                    
                                        <tr className={`${item.isFixOutcome ? 'bg-red-500' : ''}${item.isFixIncome ? 'bg-green-700' : ''}${item.group ? 'bg-blue-50' : ''} w-full border-b transition duration-300 ease-in-out hover:bg-grey-100`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.value < 0 ? item.creditor : item.debitor}</td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.value ? item.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : item.value}</td>
                                            <td>
                                                <Dropdown transaction={item} categories={categories} setCategories={setCategories} setChangeColor={setChangeColor}/>        
                                            </td>
                                        </tr>
                                    
                            )
                        })
                    }
                </table>
            </div>
        )
    
    }else {
        return (
            <div className="grid h-screen place-items-center">
                <GridLoader loading={loading} />
            </div>
        )
    }
};

export default TransactionList;
