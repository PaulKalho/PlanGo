import React, { useState } from "react"
import axiosInstance from '../axios';
import TransactionList from "../components/cashapp/TransactionList";
import { BsArrowLeftShort } from "react-icons/bs"

function Dropdown ({transaction}) {
    const[isActive, setIsActive] = useState(false)
    const[isLowActive, setIsLowActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive);
    }

    const handleLowClick = () => {
        setIsLowActive(!isLowActive);
    }

    const renderCategories = () => {
        // Get all Categories
        let categories = ['Essen', 'Einkaufen', 'Trinken'];
        const arr = [];
        categories.forEach(element => {

            arr.push(
                <div className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm">
                        
                    <input type="checkbox" className="mx-2"></input>
                    <label for="checkbox-input">{element}</label>
                
                </div>
            )
        });

        return arr
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
                    <div className="py-1" role="none">
                        {renderCategories()}
                
                    </div>
                </div>
                }
            </div>
        </div>
        // <div id="dropdown" class="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
        //     <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
        //         <li>
        //             <a href="#"  class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
        //         </li> 
        //     </ul>
        //     <li>
        //     <button id="doubleDropdownButton" data-dropdown-toggle="doubleDropdown" data-dropdown-placement="right-start" type="button" class="flex justify-between items-center py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dropdown<svg aria-h   idden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></button>
        //     <div id="doubleDropdown" class="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
        //         <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
        //         <li>
        //             <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Overview</a>
        //         </li>
        //         <li>
        //             <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My downloads</a>
        //         </li>
        //         <li>
        //             <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Billing</a>
        //         </li>
        //         <li>
        //             <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rewards</a>
        //         </li>
        //         </ul>
        //     </div>
        // </li>
        // </div>
        
        )}
    </div>
  )
};

export default Dropdown;
