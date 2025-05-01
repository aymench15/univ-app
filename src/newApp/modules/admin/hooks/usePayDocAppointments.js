import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";
import { queryClient } from "../../../../App";
import { toast } from "react-toastify";

export const usePayDocAppointments = () => {
    return useMutation({
        mutationFn: (id) => newRequest.post(`${BASE_URL}admin/appointments/pay-doc`, {
            doctorId: id
        }),
        onSuccess: (res) => {
            toast.success(res.data.message);
            queryClient.invalidateQueries("get-unpayed-appointments")
        },
    });
};