import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../../config";
import newRequest from "../../../../utils/newRequest";

export const useGetMeeting = (meetingId) => {
    return useQuery({
        enabled: !!meetingId,
        queryKey: ["get-meeting", meetingId],
        queryFn: async () => {
            return (await newRequest.get(`${BASE_URL}admin/meeting/${meetingId}`)).data;
        },
    });
}