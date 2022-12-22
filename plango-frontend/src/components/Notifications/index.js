import React from 'react';
import { useContext } from 'react';
import NotificationContext from '../../context/notificationContext';

const NotificationBar = () => {
  const notificationCtx = useContext(NotificationContext);

  return (
    notificationCtx.notification !== null && (
    <div class="mx-auto sm:w-3/4 md:w-2/4 fixed inset-x-0 bottom-5" id="signin-success-message">
        <div class={ `${notificationCtx.color} px-6 py-4 my-4 rounded-md text-lg flex items-center w-full`}>
        <svg viewBox="0 0 24 24" class="text-black-600 w-10 h-10 sm:w-5 sm:h-5 mr-3">
                    <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path>
                </svg>
        <span class="text-black-800">{notificationCtx.notificationText}</span>
        <button onClick={() => {notificationCtx.clear()}}>X</button>
        </div>
    </div>
    )
  );
};

export default NotificationBar;