import axios from "axios";
import { BASE_URL } from "../config";
import { useAuth } from "../newApp/modules/auth/useAuth";

const newRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  credentials: "include",
});

// newRequest.interceptors.response.use(
//   (response) => {
//     // If the response is successful, just return it
//     return response;
//   },
//   (error) => {
//     // If the response has an error, check if it's a 401
//     if (error.response && error.response.status === 401) {
//       // Handle the 401 error (Unauthorized)
//       console.log("Unauthorized!");
//       // Redirect to the login page (or any action you'd like to take)
//       localStorage.removeItem("token");
//       const setAuth = useAuth((state) => state.setAuth);
//       setAuth(null, null);
//       window.location.reload();
//     }

//     // Reject the promise to allow further handling by specific error handlers
//     return Promise.reject(error);
//   },
// );

export default newRequest;
