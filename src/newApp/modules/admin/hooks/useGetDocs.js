import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";

export const useGetDocs = () => {
  return useQuery({
    initialData: [],
    queryKey: ["get-docs"],
    queryFn: async () => {
      return (await newRequest.get(`${BASE_URL}admin/doctors`))
        .data;
    },
  });
};
