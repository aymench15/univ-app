import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import UploaderPage from "../pages/Doctors/UploaderPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import MyAccount from "../Dashboard/user-account/MyAccount";
import ProtectedRoute from "./ProtectedRoute";
import { AdminLogin } from "../newApp/modules/auth/components/AdminLogin";
import { Admins } from "../newApp/modules/admin/pages/Admins";

import { ForgotPassword } from "../newApp/modules/auth/components/ForgotPassword";
import { ResetPassword } from "../newApp/modules/auth/components/ResetPassword";
import { AdminRegister } from "../newApp/modules/auth/components/AdminRegister";
import { AdminLayout } from "../newApp/modules/admin/layout/AdminLayout";
import { AdminDashboard } from "../newApp/modules/admin/pages/AdminDashboard";
import { AdminPatients } from "../newApp/modules/admin/pages/Patients";
import TermsAndConditions from "../pages/conditions_terms";
import EmailList from "../newApp/modules/admin/pages/admin-emails"
const Routers = ({ socket }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/home"
        element={<Home />}
      />
      <Route
        path="/uploader"
        element={
          <ProtectedRoute allowedRoles={["Doctor", "Professor"]}>
            <UploaderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/forgotpassword"
        element={<ForgotPassword />}
      />
      <Route
        path="/resetpassword/:token"
        element={<ResetPassword />}
      />
      <Route
        path="/register"
        element={<Signup />}
      />
      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* <Route
        path="/take-appointment"
        element={
          <ProtectedRoute allowedRoles={["Doctor","Professor"]}>
            <Appointments />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/users/profile/me"
        element={
          <ProtectedRoute allowedRoles={["Doctor", "Professor"]}>
            <MyAccount />
          </ProtectedRoute>
        }
      />

   

      <Route
        path="admin-register"
        element={<AdminRegister />}
      />
      <Route
        path="admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="admins"
          element={<Admins />}
        />
        <Route
          path="patients"
          element={<AdminPatients />}
        />
           <Route
          path="emails"
          element={<EmailList />}
        />
        
        <Route
          path="*"
          element={<Navigate to="/admin/dashboard" />}
        />
      </Route>

  

      <Route
        path="/conditions-terms"
        element={<TermsAndConditions />}
      />
    </Routes>
  );
};

export default Routers;
