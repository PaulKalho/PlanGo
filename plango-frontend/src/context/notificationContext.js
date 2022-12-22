import React, { useState } from 'react';

const STATES = {
    SUCCESS: 'success',
    ERROR: 'error',
    SUCCESSCOLOR: 'bg-green-500',
    ERRORCOLOR: 'bg-red-500'
  };

const NotificationContext = React.createContext({
    notification: null,
    notificationText: null,
    color: null,
    success: () => {},
    error: () => {},
    clear: () => {}
  });

const NotificationProvider = (props) => {
    const [notification, setNotification] = useState(null);
    const [notificationText, setNotificationText] = useState(null);
    const [color, setColor] = useState(null);
    const [hidden, setHidden] = useState(false);

    const success = (text) => {
      setNotificationText(text);
      setNotification(STATES.SUCCESS);
      setColor(STATES.SUCCESSCOLOR);
      setHidden(false);
    };
    const error = (text) => {
      setNotificationText(text);
      setNotification(STATES.ERROR);
      setColor(STATES.ERRORCOLOR);
      setHidden(false);
    };
    const clear = () => {
      setNotificationText(null);
      setNotification(null);
      setColor(null);
      setHidden(true);
    };
    return (
      <NotificationContext.Provider
        value={{
          success, error, clear, notification, notificationText, color, hidden
        }}
      >
        {props.children}
      </NotificationContext.Provider>
    );
};

export { NotificationProvider };
export default NotificationContext;