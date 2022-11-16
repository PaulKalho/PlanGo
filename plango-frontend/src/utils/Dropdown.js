import React, { useEffect, useState } from "react"
import axiosInstance from '../axios';
import TransactionList from "../components/cashapp/TransactionList";
import { BsArrowLeftShort, BsPlusLg } from "react-icons/bs"

function Dropdown ({transaction, categories, setCategories}) {
    const[isActive, setIsActive] = useState(false)
    const[isLowActive, setIsLowActive] = useState(false)
    const initialAddData = Object.freeze({
        name:  '',
    });
    const[addData, updateAddData] = useState(initialAddData);
    const[group, setGroup] = useState("");
    const[defaultChecked, setDefaultChecked] = useState(true);

    const handleClick = async () => {
        setIsActive(!isActive);
        // console.log(transaction)
        // Get the group of the transaction we selected
        let payload = {
            "transaction_id": transaction.uoi
        }

        axiosInstance
            .post('/api/isgroup/', payload)
            .then(res => {
                //  console.log(res.data);
                setGroup(res.data);
            })
            .catch((err) => {
                // console.log(err)
            })
    }
    const handleLowClick = () => {
        setIsLowActive(!isLowActive);
    }

    const handleSetOutgoings = (e) => {
        // Eine neue Fixausgabe in Datenbank hinterlegen
        e.preventDefault();

        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            mandate_id: transaction.mandateId,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban
        }

        axiosInstance
            .post("/api/outcome/", payload)
            .then((res) => {
                console.log(res);
            })
    }

    const handleSetIncomes = (e) => {
        // Eine neue Fixeinnahme in Datenbank hinterlegen
        e.preventDefault();

        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            mandate_id: transaction.mandateId,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban
        }

        axiosInstance
            .post("/api/income/", payload)
            .then((res) => {
                console.log(res);
            })
    }

    const handleCheckboxChange = (e) => {
        // e.preventDefault();
    }

    const renderCategories = () => {
        // Get all Categories
        // console.log("render")
        const arr = [];
        let activate = false;

        categories.forEach(element => {
            activate = false
            if(element == group) {
                activate = true
                console.log("category found")
            }
            
            arr.push(
                <div className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm">
                        
                    <input type="radio" name="groups" className="mx-2" onChange={handleCheckboxChange} defaultChecked={activate}></input>
                    <label for="checkbox-input">{element}</label>
                
                </div>
            )
        });
        arr.push(<input type="radio" name="groups" className="mx-2" defaultChecked={activate ? false : true} hidden={true}></input>)
        return arr
    }

    // Add Data
    
    const handleChange = (e) => {
        updateAddData({
            ...addData,
            [e.target.name]: e.target.value.trim(),
        })
    }

    const handleAddGroup = (e) => {
        e.preventDefault();
        // updateAddData(initialAddData)

        let payload = {
            name: addData.name
        }

        axiosInstance
            .post("/api/group/", payload)
            .then((res) => {
                console.log(res);
                // Push name to ffrontend array
                setCategories((categories) => [...categories, res.data.name])
                updateAddData(initialAddData)
                setGroup(undefined)
            })

    
    }

    const handleDeleteGroup = (e) => {
        e.preventDefault();
        // updateAddData(initialAddData)

        let payload = {
            name: "Tester"
        }

        axiosInstance
            .post("/api/group/", payload)
            .then((res) => {
                console.log(res);
                // Push name to ffrontend array
                setCategories(categories)
                //updateAddData(initialAddData)
                setGroup(undefined)
            })
    }

  return (
    <div className="relative inline-block text-left flex flex-row">
        <div >
            <button type="button" onClick={handleClick} className=" inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true">
                Optionen
                <svg className="mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        {isActive && (
        <div className="absolute right-0 z-10 mt-11 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div className="py-1" role="none">
                <a onClick={handleSetIncomes} className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Markieren als monatl. Einnahme</a>
                <a onClick={handleSetOutgoings} className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Markieren als monatl. Ausgabe</a>
                <button type="button" onClick={handleLowClick} className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <BsArrowLeftShort size="20" />Kategorisieren
                </button>
                { isLowActive &&
                <div className="absolute -translate-x-full -translate-y-2/3 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="pt-2" role="none">
                        {renderCategories()}
                        {/* <a onClick={handleAddGroup}className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem">Hinzufügen + </a> */}
                        <div class="relative mt-1">
                            <input onChange={handleChange} value={addData.name} id="name" name="name" class="block p-2 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Hinzufügen" required />
                            <button onClick={handleAddGroup} type="submit" class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><BsPlusLg /></button>
                        </div>
                        <button onClick={handleDeleteGroup} type="submit" class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Delete Group</button>

                    </div>
                </div>
                }
            </div>
        </div>
        )}
    </div>
  )
};

export default Dropdown;
