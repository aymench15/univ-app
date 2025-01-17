import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetDoctorPayments = (doctorId, page = 1, limit = 25) => {
    return useQuery({
        enabled: !!doctorId,
        initialData: { data: [], currentPage: page, totalPages: 0, totalItems: 0 },
        queryKey: ["get-doc-payments", page, limit, doctorId],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/doc-payments`, {
                params: { page, limit, doctorId }
            }))
                .data;
        },
    });
}