// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthContextProvider } from './context/AuthContext'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthContextProvider>
//         <ToastContainer
//           theme='dark'
//           position='top-right'
//           autoClose={5000}
//           closeOnClick
//           pauseOnHover={false}
//         />
//           <App />
//         </AuthContextProvider>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "rsuite/dist/rsuite.min.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext";
import { NotificationProvider } from "./components/Services/notificationContext.jsx";
import moment from "moment";
import localization from "moment/dist/locale/fr";

// import { config } from "dotenv";

// config();

moment.updateLocale("fr", localization);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <NotificationProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <App />
        </NotificationProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
