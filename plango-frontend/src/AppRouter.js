import React from "react";

import { BrowserRouter,Routes,Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";

//Components

import HomePage from './pages/HomePage'
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import BankingIntro from "./pages/BankingIntro";
import BankingMain from "./pages/BankingMain";
import ChooseAccount from "./pages/ChooseAccounts";
import Statistic from "./components/cashapp/Statistic";


function AppRouter() {
    return (
    <BrowserRouter>
        <Routes>
            <Route element= {<PublicRoutes />} >
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={ <RegisterPage />} />
            </Route>
            <Route path="/test" element={ <TestPage />} />
            <Route element= {<PrivateRoutes />}>
                <Route path="/dashboard" element={ <Dashboard />} exact />
                <Route path="/dashboard/cash" element= { <BankingIntro /> } exact />
                <Route path="/dashboard/cash/accounts/" element={ <ChooseAccount /> } exact /> 
                <Route path="/dashboard/cash/accounts/app/:accountId" element={ <BankingMain /> } /> 
                <Route path="/dashboard/cash/accounts/app/:accountId/statistik" element={ <Statistic /> } /> 
            </Route>
        </Routes>
    </BrowserRouter>
    )
}

export default AppRouter