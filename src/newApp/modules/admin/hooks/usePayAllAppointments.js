import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";
import { queryClient } from "../../../../App";
import { toast } from "react-toastify";

export const usePayAllAppointments = () => {
    return useMutation({
        mutationFn: () => newRequest.post(`${BASE_URL}admin/appointments/pay-all`),
        onSuccess: (res) => {
            toast.success(res.data.message);
            queryClient.invalidateQueries("get-unpayed-appointments")
        },
    });
};