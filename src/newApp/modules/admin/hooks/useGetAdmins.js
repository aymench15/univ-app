import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetAdmins = () => {
    return useQuery({
        initialData: [],
        queryKey: ["get-admins"],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/admins`))
                .data;
        },
    });
};
