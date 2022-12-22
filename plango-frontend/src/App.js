import React from 'react';
//Components
import AppRouter from './AppRouter';
import { NotificationProvider } from './context/notificationContext';
import NotificationBar from './components/Notifications';

function App() {
  return (
    <div>
      <NotificationProvider>
        <NotificationBar />
        <AppRouter/>
      </NotificationProvider>
      {/* <Error msg="Test" /> */}
      {/* <Success msg="Test" /> */}
    </div>
  );
}

export default App;
