import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useOngoingAppointments = (page = 1, limit = 25) => {
    return useQuery({
        enabled: true,
        initialData: {
            data: [], currentPage: page, totalPages: 0, totalItems: 0
        },
        queryKey: ["get-ongoing-appointments", page, limit],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/appointments/ongoing`, {
                params: { page, limit }
            }))
                .data;
        },
    });
}