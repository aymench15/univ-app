import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../config";
import newRequest from "../../../../utils/newRequest";

export const useForgotPassword = () => {
  return useMutation({
    retry: false,
    mutationFn: ({ email }) => {
      return newRequest.post(`${BASE_URL}auth/forgot-password`, { email });
    },
  });
};
