import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";
import logo from "../../../../assets/images/logo_short.png";
import { useForgotPassword } from "../hooks/useForgotPassword";

export const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { mutateAsync, isPending } = useForgotPassword();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await mutateAsync(formData);
      toast.success("Email sent successfully, please check your inbox");
    } catch (error) { // Log the error for debugging purposes
      toast.error(error.response.data.message || "Failed to send email"); // Use error.message if available, or a default message
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
          Reset your password
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

          <div className="mt-7">
            <button
              disabled={isPending && true}
              type="submit"
              className="w-full bg-primaryColor text-white
              text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {isPending ? (
                <HashLoader
                  size={35}
                  color="#fff"
                />
              ) : (
                "Envoyer l'email"
              )}
            </button>
          </div>

          <p className="mt-5 text-textColor text-center">
            Do you remember your password?
            <Link
              to="/login"
              className="text-primaryColor font-medium ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
