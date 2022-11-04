import React, { useState } from "react"
import axiosInstance from '../axios';
import TransactionList from "../components/cashapp/TransactionList";

function Dropdown ({transaction}) {
    const[isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive);
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
    <div className="relative inline-block text-left">
        <div>
            <button type="button" onClick={handleClick} className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true">
                Optionen
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        {isActive && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div className="py-1" role="none">
                <a onClick={handleSetIncomes} className="text-gray-700 hover:bg-black block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Monatl. Einname markieren</a>
                <a onClick={handleSetOutgoings} className="text-gray-700 hover:bg-black block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Monatl. Ausgabe markieren</a>
                <a href="#" className="text-gray-700 hover:bg-black block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Kategorisieren</a>
            </div>
        </div>
        )}
        
    </div>
  )
};

export default Dropdown;
