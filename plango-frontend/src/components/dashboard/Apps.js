import React from 'react'
import NavbarMain from '../main/NavbarMain'
import AppItem from './AppItem'
import {BsFillPlugFill, BsListTask, BsCashCoin, BsFillCloudFill, BsFillAlarmFill} from "react-icons/bs"

function Apps() {
    return (
    <div className='w-full p-4'>
        <div className='grid grid-cols-4 gap-4'>
            <AppItem icon={<BsFillPlugFill size={35}/>} title="Server überwachung" name="server"/>
            <AppItem icon={<BsListTask size={35}/>} title="Todo Liste" name="todo"/>
            <AppItem icon={<BsCashCoin size={35}/>} title="Cash List" name="cash"/>
            <AppItem icon={<BsFillCloudFill size={35}/>} title="Cloud" name="cloud"/>
            <AppItem icon={<BsFillAlarmFill size={35}/>} title="Sehr wichtig" name="important"/>
        </div>
    </div>
    )
}

export default Apps

