import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useConfirmDoc = () => {
  return useMutation({
    mutationKey: ["confirm-doc"],
    mutationFn: async ({ id }) => {
      return await newRequest.post(`${BASE_URL}admin/accept`, {
        doctorId: id,
      });
    },
  });
};
export const useRefuseDoc = () => {
  return useMutation({
    mutationKey: ["refuse-doc"],
    mutationFn: async ({ id }) => {
      return await newRequest.post(`${BASE_URL}admin/refuse`, {
        doctorId: id,
      });
    },
  });
};
