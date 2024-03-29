import React, { useState, useContext } from "react"
import { BsArrowLeftShort, BsPlusLg, BsFillTrashFill } from "react-icons/bs"
import NotificationContext from "../context/notificationContext";

import m_Group from "./models/m_Group";
import m_FixIncome from "./models/m_FixIncome";
import m_FixOutcome from "./models/m_FixOutcome";
import m_TransactionGroupIntermediate from "./models/m_TransacGroupIntermediate";

function Dropdown ({transaction, categories, setCategories, setChangeColor}) {
    const[isActive, setIsActive] = useState(false)
    const[isLowActive, setIsLowActive] = useState(false)
    const initialAddData = Object.freeze({
        name:  '',
    });
    const[addData, updateAddData] = useState(initialAddData);
    const[checkNone, setCheckNone] = useState(false);
    const[loading, setLoading] = useState(false);
    const notificationCtx = useContext(NotificationContext);

    // Models
    const Group = new m_Group();
    const Income = new m_FixIncome();
    const Outcome = new m_FixOutcome();
    const TransactionGroup = new m_TransactionGroupIntermediate();


    function makeid() {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleClick = () => {
        setIsActive(!isActive);
    }
    const handleLowClick = () => {
        setIsLowActive(!isLowActive);
    }

    const handleSetOutgoings = async (e) => {
        // Eine neue Fixausgabe in Datenbank hinterlegen
        e.preventDefault();

        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            mandate_id: transaction.mandateId,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban,
            transaction_date: transaction.date
        }

        try {
            setLoading(true);
            await Outcome.m_FixOutcome_insert(payload);
            transaction.isFixOutcome = true;
            setChangeColor(makeid())
            notificationCtx.success("Es wurde eine FixAusgabe hinzugefügt!");
        } catch (error) {
            notificationCtx.error("Beim hinzufügen ist etwas schiefgelaufen!");
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteOutgoing = async () => {
        console.log(transaction)
        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban,
        }

        try {
            await Outcome.m_FixOutcome_deleteBy(payload);
            transaction.isFixOutcome = false;
            setChangeColor(makeid());
            notificationCtx.success("Fixe Ausgabe wurde erfolgreich gelöscht!")
        } catch (error) {
            notificationCtx.error("Beim Löschen ist etwas schiefgelaufen!");
        } finally {
            setLoading(false);
        }    

    }

    const handleSetIncomes = async (e) => {
        // Eine neue Fixeinnahme in Datenbank hinterlegen
        e.preventDefault();

        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            mandate_id: transaction.mandateId,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban,
            transaction_date: transaction.date
        }

        try {
            setLoading(true)
            await Income.m_FixIncome_insert(payload);
            transaction.isFixIncome = true;
            //Trigger rerender of list:
            setChangeColor(makeid())
            notificationCtx.success("Es wurde eine FixEinnahme hinzugefügt!")
        } catch (error) {
            notificationCtx.error(error.response.data.non_field_errors);
        } finally {
            setLoading(false)
        }
        
    }

    const renderDeleteInOut = () => {
        const arr = []
        if(transaction.isFixIncome) {
            arr.push(
                <div>
                    <a onClick={handleDeleteIncomes} className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Fixe Einnahme entfernen</a>
                </div>
            )
        }
        else if(transaction.isFixOutcome) {
            arr.push(
                <div>
                    <a onClick={handleDeleteOutgoing} className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Fixe Ausgabe entfernen</a>
                </div>
            )
        }
        
        return arr
    }

    const handleDeleteIncomes = async () => {
        let payload = {
            creditorName: transaction.creditor,
            debtorName: transaction.debitor, 
            amount: transaction.value,
            creditor_iban: transaction.creditorIban,
            debtor_iban: transaction.debtorIban,
        }

        try {
            setLoading(true);
            await Income.m_FixIncome_deleteBy(payload);
            transaction.isFixIncome = false;
            setChangeColor(makeid());
            notificationCtx.success("FixAusgabe wurde erfolgreich gerlöscht!")
        } catch (error) {
            notificationCtx.error("Beim Löschen ist etwas schiefgelaufen!")
        } finally {
            setLoading(false)
        }        
    }

    const handleCheckboxChange = async (e) => {
        // This function adds a transaction to transactionGroupIntermediate (and deletes old ones)
        // TODO: notificationctx functionality hinzufügen

        if(transaction.group != null) {
            //Delete old group path
            const payload = {
                uoi: transaction.uoi
            }

            try {
                setLoading(true)
                await TransactionGroup.m_TransactionGroupIntermediate_deleteBy(payload);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }

        if(e.target.value === "") {
            //Wenn die value null ist, dann soll keine gruppierung vorgenommen werden
            transaction.group = null;
        }else{
            const values=e.target.value.split("#");
            let groupId = values[0];
            let groupName = values[1];

            let payload = { 
                transaction_id: transaction.uoi,
                month: transaction.date,
                amount: transaction.value,
                group: groupId,
            }

            try {
                setLoading(true);
                await TransactionGroup.m_TransactionGroupIntermediate_insert(payload)
                    .then( () => {
                        setCheckNone(false);
                        transaction.group = groupName;
                        setChangeColor(makeid());
                        notificationCtx.success("Die Transaktion wurde gruppiert!");
                    })
    
            } catch(error) {
                notificationCtx.error("Beim Gruppieren ist etwas schiefgelaufen!");
            } finally {
                setLoading(false);
            }
            
                
        }

        
    }

    const renderCategories = () => {
        // Get all Categories
        // console.log("render")
        const arr = [];
        let activate = false;
        let noneActivated = true;
        categories.forEach(element => {
            activate = false;
            if(element.name === transaction.group) {
                activate = true
                noneActivated = false;   
            }

            arr.push(
                <div>
                    <div className={element.name !== "hidden" ? "cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" : ""} hidden>
                        <input type="radio" name="groups" value={element.id + '#' + element.name} className="mx-2" onChange={handleCheckboxChange} defaultChecked={activate}></input>
                        <label for="checkbox-input" >{element.name}</label>
                    </div>
                    <div onClick={() => handleDeleteGroup(element.id)}><BsFillTrashFill size={15}/></div>
                </div>

            )
        });
        arr.push(
        <div className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm">
            <input type="radio" name="groups" value={null} className="mx-2" onChange={handleCheckboxChange} defaultChecked={noneActivated}></input>
            <label for="checkbox-input" >Keine Gruppe</label>
        </div>)
        return arr
    }
    
    const handleChange = (e) => {
        updateAddData({
            ...addData,
            [e.target.name]: e.target.value.trim(),
        })
    }


    async function handleDeleteGroup (id) {
        // Diese Funktion soll Gruppen löschen können:
        try{
            setLoading(true);
            await Group.m_Group_deleteOne(id)
                    .then( () => {
                        const categoriesMin = categories.filter(el => el.id !== id);
                        setCategories(categoriesMin);
                        notificationCtx.success("Gruppe erfolgreich gelöscht!")
                    })
        }catch (error) {
            notificationCtx.error(error.message);
        }finally {
            setLoading(false)
        }
        
    }

    const handleAddGroup = async (e) => {
        e.preventDefault();

        let payload = {
            name: addData.name
        }

        try {
            setLoading(true);
            await Group.m_Group_insert(payload)
                .then(() => {
                    let newCategories = {
                        id: Group.m_GroupObj.id,
                        name: Group.m_GroupObj.name
                    }

                    setCategories((categories) => [...categories, newCategories]);
                    updateAddData(initialAddData)
                    notificationCtx.success("Gruppe wurde erfolgreich hinzugefügt")
                })
        } catch (error) {
            notificationCtx.error(error.message)
        } finally {
            setLoading(false);
        }        

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
                <a onClick={handleSetIncomes} href="fix" className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Markieren als monatl. Einnahme</a>
                <a onClick={handleSetOutgoings} href="fix" className="cursor-pointer text-gray-700 hover:bg-cyan-200 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Markieren als monatl. Ausgabe</a>
                {renderDeleteInOut()}
                <button type="button" onClick={handleLowClick} className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <BsArrowLeftShort size="20" />Kategorisieren
                </button>
                { isLowActive &&
                <div className="absolute -translate-x-full -translate-y-2/3 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="pt-2" role="none">
                        {renderCategories()}
                        <div className="relative mt-1">
                            <input onChange={handleChange} value={addData.name} id="name" name="name" className="block p-2 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Hinzufügen" required />
                            <button onClick={handleAddGroup} type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><BsPlusLg /></button>
                        </div>
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
