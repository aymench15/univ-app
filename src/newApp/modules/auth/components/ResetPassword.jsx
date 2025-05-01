import React, { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";
import logo from "../../../../assets/images/logo_short.png";
import { useResetPassword } from "../hooks/useResetPassword";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
    token,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { mutateAsync, isPending } = useResetPassword();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await mutateAsync(formData);
      toast.success("Password reseted successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password";
      toast.error(errorMessage|| "Failed to reset password"); 
    }
  };

  if (!token) return <Navigate to={"/login"} />;

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
          Set your new password
        </h3>
        <form
          action=""
          onSubmit={submitHandler}
        >
          <div className="mb-5">
            <label className="form__label mb-1">Nouveau mot de passe</label>
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
          </div>
          <div className="mb-5">
            <label className="form__label mb-1">
              Confirmer votre mot de passe
            </label>
            <input
              type="password"
              name="password2"
              placeholder=""
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border0[#0066ff61]
              focus:outline-none focus:border-b-primaryColor text-base
              leading-7 text-headingColor placeholder:text-textColor
              rounded-md cursor-pointer"
              value={formData.password2}
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
                "Confirmer"
              )}
            </button>
          </div>

          <p className="mt-5 text-textColor text-center">
            Vous vous rappelez de votre mot de passe?
            <Link
              to="/login"
              className="text-primaryColor font-medium ml-1"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
