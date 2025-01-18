import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext"; // Updated import statement
import HashLoader from "react-spinners/HashLoader.js";
import { useAuth } from "../newApp/modules/auth/useAuth";
import logo from "../assets/images/logo_short.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { setAuth, setLoading: setLoadingAuth } = useAuth(
    ({ setAuth, setLoading }) => ({
      setLoading,
      setAuth,
    }),
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingAuth(true);
    try {
      const res = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        withCredentials: true, // should be there
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.info,
          token: result.token,
          role: result.info.role,
        },
      });

      setLoading(false);
      toast.success(result.message);
      navigate("/");
      setAuth(result.info, result.token);
      setLoadingAuth(false);
      // window.location.reload();
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      toast.error(error.message || "Failed to login"); // Use error.message if available, or a default message
      setLoading(false);
    }
  };
  return (
    <section className="my-10">
      <div
        className="w-full max-w-[570px] mx-auto
      rounded-lg shadow-md p-10 flex flex-col"
      >
        <img
          src={logo}
          className="w-20 h-20 self-center"
        />
        <h3
          className="text-headingColor text-[22px] leading-9
        font-bold mb-4 text-center"
        >
          Login
        </h3>
        <form
          action=""
          onSubmit={submitHandler}
        >
          <div className="mb-5">
            <label className="form__label mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border0[#0066ff61]
              focus:outline-none focus:border-b-primaryColor text-base
              leading-7 text-headingColor placeholder:text-textColor
              rounded-md cursor-pointer"
              value={formData.email}
              required
            />
          </div>
          <div className="mb-5">
            <label className="form__label mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border0[#0066ff61]
              focus:outline-none focus:border-b-primaryColor text-base
              leading-7 text-headingColor placeholder:text-textColor
              rounded-md cursor-pointer"
              value={formData.password}
              required
            />
            <div className="flex items-center justify-end py-1">
              <Link
                to={"/forgotpassword"}
                className="text-xs font-thin text-primaryColor"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="mt-7">
            <button
              disabled={loading && true}
              type="submit"
              className="w-full bg-primaryColor text-white
              text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {loading ? (
                <HashLoader
                  size={35}
                  color="#fff"
                />
              ) : (
                "Log in"
              )}
            </button>
          </div>

          <p className="mt-5 text-textColor text-center">
            Don't have an account?
            <Link
              to="/register"
              className="text-primaryColor font-medium ml-1"
            >
              Create an account
            </Link>
          </p>
       
        </form>
      </div>
    </section>
  );
};

export default Login;
