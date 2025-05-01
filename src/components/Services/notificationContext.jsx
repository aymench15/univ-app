import React, { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://umkb.com' , {
     
      transports: ["websocket"],
      secure: true,
      rejectUnauthorized: false, 
      withCredentials: true,
    });
    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    newSocket.on('notification', (notification) => {

      // In-app notification
      toast(`New message from ${notification.userName}: ${notification.message}`, {
        type: 'info',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification(`New message from ${notification.userName}`, {
          body: notification.message,
        });
      }
    });

    return () => newSocket.close();
  }, []);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
