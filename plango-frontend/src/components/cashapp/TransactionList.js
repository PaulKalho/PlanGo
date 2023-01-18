import React, {useState} from "react"
import GridLoader from "react-spinners/GridLoader"
import Dropdown from "../../utils/Dropdown";
import {BsAsterisk } from "react-icons/bs"



function TransactionList ({transactions , loading, categories, setCategories, hidden}) {
    //Wird genutzt um die Farbe einer Transaktion zu changen
    const [changeColor, setChangeColor] = useState("");
    const [thisItemHidden, setThisItemHidden] = useState(true);
    const [ItemValue, setItemValue] = useState("<BsAsteriks />");
    console.log(transactions)
    const showHidden = () => {
        setThisItemHidden(!thisItemHidden);
        // console.log(item);
    }

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
                            item.hidden = hidden;
                            // console.log(item)
                            //Idee: In array pushen der state ist und gerenderd wird. State ändern in child component
                            return(
                                    
                                        <tr className={`${item.isFixOutcome ? 'bg-red-500' : ''}${item.isFixIncome ? 'bg-green-700' : ''}${item.group ? 'bg-blue-50' : ''} w-full border-b transition duration-300 ease-in-out hover:bg-grey-100`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.value < 0 ? item.creditor : item.debitor}</td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" ><div onClick={ () => {item.hidden = !item.hidden; console.log(item);} }>{item.hidden ? (<BsAsterisk />) : (item.value ? item.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : item.value)}</div></td>
                                            {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" ><div onClick={}>{hidden ? ItemValue : item.value}</div></td> */}
                                            
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
