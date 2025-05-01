import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetDoctorPatients = (doctorUserId, page = 1, limit = 25) => {
    return useQuery({
        enabled: !!doctorUserId,
        initialData: { data: [], currentPage: page, totalPages: 0, totalItems: 0 },
        queryKey: ["get-doc-patients", page, limit, doctorUserId],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/doc-patients`, {
                params: { page, limit, doctorUserId }
            }))
                .data;
        },
    });
};
