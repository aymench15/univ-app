import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../newApp/modules/auth/useAuth";
import newRequest from "../utils/newRequest";
const useFecthData = (url) => {
  const user = useAuth((state) => state.user);
  const {
    data: { data },
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["adazdazdaz"],
    queryFn: async () => {
      return await newRequest.post(
        url,
        {
          id: user._id,
        },
        {
          withCredentials: true, // should be there
          credentials: "include",
        },
      );
    },
  });
  return {
    data,
    loading,
    error,
  };
};

export default useFecthData;
