import { Breadcrumbs } from "@material-tailwind/react";
import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axios";
import Overview from "../components/cashapp/Overview";
import TransactionList from "../components/cashapp/TransactionList";
import NavbarMain from "../components/main/NavbarMain";


// import React, { Component } from 'react'
import m_Group from "../utils/models/m_Group";
import m_Budget from "../utils/models/procedures/m_Budget";
import m_Transaction from "../utils/models/procedures/m_Transaction";

// export default class BankingMain extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             //Models
//             Categories: new m_Group(),
//             Budget: new m_Budget(),
//             Transactions: new m_Transaction(),

//             //Other states
//             loading: false,
//             accountId: useParams()
//         }
//     }

//     async componentDidMount() {
//         // Init -> Load Data
//         try{
//             this.setState({loading: true});
//             await this.state.Categories.m_Group_FindAll();
//             await this.state.Transactions.m_Transaction_runProcedure(this.state.accountId - 1);
//             //Budget has to be fetched after Transactions!
//             await this.state.Budget.m_Budget_runProcedure(this.state.accountId - 1);
//         }catch(error) {
//             console.log(err)
//         }finally {
//             this.setState({loading: false})
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <NavbarMain />
//                 {/* GET ID FROM URL AND MACHE REQUEST */}
//                 <Breadcrumbs className="bg-transparent">
//                     <Link 
//                         className="hover:underline bg-transparent"
//                         to="/dashboard/cash/accounts/"
//                     >
//                         Accounts wählen
//                     </Link>
//                     <Link                        
//                         className="hover:underline font-bold"
//                     >
//                         Transaktionen
//                     </Link>
//                 </Breadcrumbs>
//                 <Overview budget={this.state.Budget.m_Budget_Data.budget}/>
//                 <TransactionList transactions={this.state.Transactions} loading={loading} categories={categories} setCategories={setCategories}/>
//             </div>

//         )
//     }
// }


function BankingMain() {

    const { accountId } = useParams()
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [budget, setBudget] = useState()
    
    useEffect(() => {
        const Group = new m_Group();
        const Budget = new m_Budget();
        const Transactions = new m_Transaction();

        const initialize = async () => {
            await Transactions.m_Transaction_runProcedure(accountId-1);
            setTransactions(Transactions.m_Transaction_List);

            //Has to be called after Transactions:
            await Budget.m_Budget_runProcedure(accountId-1);
            setBudget(Budget.m_Budget_Data[0].budget);

            await Group.m_Group_FindAll();
            setCategories(Group.m_Group_List);

        }
        
        initialize();
    }, []);
    return (
        <div>
            <NavbarMain />
            {/* GET ID FROM URL AND MACHE REQUEST */}
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
