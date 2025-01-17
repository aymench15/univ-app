import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { BASE_URL } from "../../../config";
import { setAuthToken, useAuth } from "./useAuth";
import { useContext } from "react";
import { authContext } from "../../../context/AuthContext";

export const useLoad = () => {
  const { setAuth, setLoading } = useAuth((state) => state);
  const { dispatch } = useContext(authContext);

  return useMutation({
    mutationKey: ["load"],
    retry: false,
    mutationFn: async () => {
      try {
        setAuthToken(localStorage.getItem("token"));
        setLoading(true);
        const res = await newRequest.get(`${BASE_URL}auth/load`);
        dispatch("LOGIN_SUCCESS", {
          user: res.data.info,
          token: res.data.token,
          role: res.data.info.role,
        });
        setAuth(res.data.info, res.data.token);
        return res;
      } catch (err) {
        console.error(err);
        setAuth(null, null);
        dispatch("LOGOUT");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      //   setAuth(null, null);
      //   dispatch("LOGOUT");
    },
  });
};
