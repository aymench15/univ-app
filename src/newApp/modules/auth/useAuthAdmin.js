import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { BASE_URL } from "../../../config";
import { setAuthToken, useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export const useAuthAdmin = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);
  const setAuth = useAuth((state) => state.setAuth);
  return useMutation({
    mutationKey: ["auth-admin"],
    mutationFn: async ({ name, password }) => {
      return await newRequest.post(`${BASE_URL}auth/adminLogin`, {
        name,
        password,
      });
    },
    onSuccess: ({ data }) => {
      setAuth({ role: 'admin' }, data.token);
      navigate("/admin/dashboard");
    },
    onError: (e) => {
      toast.error(e.response.data.message);
    },
  });
};

export const useRegisterAdmin = (redirect = true) => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["register-admin"],
    mutationFn: async ({ name, password }) => {
      return await newRequest.post(`${BASE_URL}auth/adminRegister`, {
        name,
        password,
      });
    },
    onSuccess: ({ data }) => {
      if (redirect)
        navigate("/admin-login");
    },
    onError: (e) => {
      toast.error(e.response.data.message);
    },
  });
};
