import axios from "axios";
import { create } from "zustand";
import newRequest from "../../../utils/newRequest";

export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  isLoading: !localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
    localStorage.setItem("token", token);
    setAuthToken(token);
    set((state) => ({ ...state, user, token }));
  },
  resetAuth: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setAuthToken(null);
    set((state) => ({ ...state, user: null, token: null }));
  },
  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
}));

export const setAuthToken = (token) => {
  if (token) {
    newRequest.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete newRequest.defaults.headers.common["x-auth-token"];
  }
};
