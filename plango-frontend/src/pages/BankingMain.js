import { Breadcrumbs } from "@material-tailwind/react";
import React, {useEffect, useState, useContext} from "react";
import { Link, useParams } from "react-router-dom";
import Overview from "../components/cashapp/Overview";
import TransactionList from "../components/cashapp/TransactionList";
import NavbarMain from "../components/main/NavbarMain";
import NotificationContext from "../context/notificationContext";

import m_Group from "../utils/models/m_Group";
import m_Budget from "../utils/models/procedures/m_Budget";
import m_Transaction from "../utils/models/procedures/m_Transaction";




function BankingMain() {

    const { accountId } = useParams()
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [budget, setBudget] = useState()
    const notificationCtx = useContext(NotificationContext);

    //Modells:
    const Group = new m_Group();
    const Budget = new m_Budget();
    const Transactions = new m_Transaction();
    
    useEffect(() => {
        
        const initialize = async () => {
            try{
                setLoading(true)
                await Transactions.m_Transaction_runProcedure(accountId-1);
                setTransactions(Transactions.m_Transaction_List);

                //Has to be called after Transactions:
                await Budget.m_Budget_runProcedure(accountId-1);
                setBudget(Budget.m_Budget_Data.budget);

                await Group.m_Group_FindAll();
                setCategories(Group.m_Group_List);
            }catch(error) {
                notificationCtx.error(error.message)
                console.log(error)
            }finally {
                setLoading(false)
            }  
        }
        
        initialize();
    }, []);
    return (
        <div>
            <NavbarMain />
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
            <Overview budget={budget}/>
            <TransactionList transactions={transactions} loading={loading} categories={categories} setCategories={setCategories}/>
        </div>
    )

};

export default BankingMain;
