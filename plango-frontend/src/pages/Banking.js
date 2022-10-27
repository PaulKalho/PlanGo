import React from "react"

import balanceTest from "../components/cashapp/balances";

import { Link } from "react-router-dom";

// Components 
import TransactionList from "../components/cashapp/transactionlist";
import NavbarMain from "../components/main/NavbarMain";

function Banking () {
  return (
    <div>
        <NavbarMain />
        <div className="p-5">
            {/* OVERVIEW */}
            <div className="flex gap-5">
                
                <div className="w-1/2 p-5 mb-5 flex gap-9 text-sky-500 underline">
                    <Link to="./fixkosten">Fixkosten</Link>
                    <Link to="./variablekosten">Variablekosten</Link>
                    <Link to="./einkommen">Einkommen</Link>
                    <Link to="./kategorien">Kategorien</Link>
                    <Link to="./statistiken">Statisiken</Link>
                </div>
                <div className="bg-green-800 w-1/4 rounded-xl p-5 mb-5">
                    <h1  className="w-100 w-2 text-white">Kontostand: { balanceTest[0].balances[0].balanceAmount.amount} </h1>
                </div>
                <div className="bg-green-600 w-1/4 rounded-xl p-5 mb-5 ml-auto">
                    <h1  className="w-100 w-2 text-white">Budget: { balanceTest[0].balances[0].balanceAmount.amount} </h1>
                </div>
            </div>
            <TransactionList />
        </div>
    </div>
  )
};

export default Banking;
