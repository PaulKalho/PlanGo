import React, {useState} from "react";
import BankInput from "./BankInput";
import LinkIframe from "../components/cashapp/LinkIframe";
import NavbarMain from "../components/main/NavbarMain";

function BankingIntro() {

  const [page, setPage] = useState(0)
  const [link, setLink] = useState("");

  const componentList = [
    <BankInput page={page} setPage={setPage} setLink={setLink}/>,
    <LinkIframe page={page} setPage={setPage} link={link}/>
  ]
  

  return (
    <div className="grid h-screen place-items-center">
        <NavbarMain />
        {componentList[page]}
    </div>
  )
};

export default BankingIntro;
