import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useResetPassword = () => {
  return useMutation({
    retry: false,
    mutationFn: ({ token, password, password2 }) => {
      return newRequest.post(`${BASE_URL}auth/reset-password`, {
        token,
        password,
        password2,
      });
    },
  });
};
