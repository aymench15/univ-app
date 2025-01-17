import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetPatients = (page = 1, limit = 25) => {
    return useQuery({
        initialData: { data: [], currentPage: page, totalPages: 0, totalItems: 0 },
        queryKey: ["get-patients", page, limit],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/patients`, {
                params: { page, limit }
            }))
                .data;
        },
    });
};
