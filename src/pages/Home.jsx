import React, { useEffect } from "react";
import viceRector from "../assets/images/viceRector.png";

import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../newApp/modules/auth/useAuth";
const Home = () => {
  const user = useAuth((state) => state.user);

  return (
    <>
      {/* {user && role === "doctor" ? (
        <DoctorHomePage />
      ) : user && role === "patient" ? (
        <PatientHomePage />
      ) : (
        <DefaultHomePage />
      )} */}
      { user && (user.role === "Doctor" || user.role === "Professor" ) ? (
        <Navigate to={"/users/profile/me"} />
      ) : (
        <DefaultHomePage />
      )}
    </>
  );
};


const DefaultHomePage = () => (
  <>
    {/* Default content for users without a specific role */}
    <section className="hero__section pt-[60px] 2xl:h-[800px] mb-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
          <div>
            <div className="lg:w-[570px]">
              <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
              Welcome to Questions Bank of the Algerian PhD Exams
              </h1>
              <p className="text__para">
              Here you can submit your suggested questions-exercises for the Algerian PhD exams easily and securely.
              </p>
              <Link
                to="/login"
                className="mt-4 btn bg-primaryColor text-white hover:bg-primaryColor"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="flex gap-[30px] justify-end">
            <div>
              <img
                src={viceRector}
                alt=""
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Other default sections */}
  </>
);

export default Home;
