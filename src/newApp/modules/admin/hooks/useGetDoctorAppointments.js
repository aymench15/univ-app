import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetDoctorAppointments = (doctorUserId, page = 1, limit = 25) => {
    return useQuery({
        initialData: { data: [], currentPage: page, totalPages: 0, totalItems: 0 },
        queryKey: ["get-doc-appointments", doctorUserId, page, limit],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/doc-appointments`, {
                params: { page, limit, doctorUserId }
            }))
                .data;
        },
    });
};
