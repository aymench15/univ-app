// import { useEffect } from 'react';
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import io from 'socket.io-client';
// import Layout from './layout/Layout';
// import './App.css';

// const socket = io('http://localhost:8800');

// function App() {
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });
//   }, []);

//   const queryClient = new QueryClient();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Layout socket={socket} />
//     </QueryClientProvider>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import "./App.css";
import { useNotification } from "./components/Services/notificationContext";
import { useAuth } from "./newApp/modules/auth/useAuth";
import { ScrollToTop } from "./newApp/extra/ScrollToTop";
import { CustomProvider } from "rsuite";
import frFR from "rsuite/locales/fr_FR";
import "react-photo-view/dist/react-photo-view.css";

export const queryClient = new QueryClient();

function App() {
  const { socket } = useNotification();

  const user = useAuth((state) => state.user);

  // useLayoutEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     dispatch({ type: "LOGOUT" });
  //   }
  // }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (socket) {
        socket.emit("setUser", {
          userId: user._id,
          userName: user.name,
        });
      }

      // if (Notification.permission !== 'granted') {
      //   Notification.requestPermission();
      // }
    }
  }, [socket]);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomProvider locale={frFR}>
        <ToastContainer />
        <Layout socket={socket} />
        <ScrollToTop />
      </CustomProvider>
    </QueryClientProvider>
  );
}

export default App;
