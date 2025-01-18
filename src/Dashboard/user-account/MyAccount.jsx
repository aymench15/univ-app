import React, { useContext, useState, useEffect } from "react";

import { authContext } from "../../context/AuthContext";
import Profile from "./Profile";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../newApp/modules/auth/useAuth";
import newRequest from "../../utils/newRequest";
import { NO_USER_IMAGE } from "../../utils/utils";

const MyAccount = () => {
  const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("settings");
  const [imageSrc, setImageSrc] = useState(NO_USER_IMAGE);
  const resetAuth = useAuth((state) => state.resetAuth);

  const handleLogout = () => {
    resetAuth();
    dispatch({
      type: "LOGOUT",
    });
    // window.location.reload();
  };

  const user = useAuth((state) => state.user);

  const {
    data: { data },
    error,
    isError,
    isFetching: isLoading,
  } = useQuery({
    queryKey: ["myprofile"],
    initialData: { data: null },
    queryFn: async () => {
      return await newRequest.post(
        `${BASE_URL}users/profile/me`,
        {
          id: user._id,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            //'Authorization' : `Bearer ${token}`,
          },
        },
      );
    },
  });

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(user.img);
        if (!response.ok) {
          setImageSrc(NO_USER_IMAGE);
          throw new Error("Image failed to load");
        }
        setImageSrc(response.url);
      } catch (error) {
        setImageSrc(NO_USER_IMAGE);
        console.error(error);
      }
    };

    loadImage();
  }, [imageSrc]);

  return (
    <div className="max-w-[1170px] px-5 mx-auto my-10">
      {isLoading && !isError && <Loading />}

      {isError && !isLoading && <Error errMessage={error.message} />}

      {!isLoading && !isError && data && (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="pb-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              {/* <figure
                className="w-[100px] h-[100px] rounded-full
                    border-2 border-solid border-primaryColor"
              >
                <img
                  src={user.img ?? NO_USER_IMAGE}
                  alt=""
                  className="w-full h-full rounded-full"
                />
              </figure> */}
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                <img
                  src={imageSrc}
                  alt={imageSrc}
                  className="w-full h-full rounded-full"
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = NO_USER_IMAGE; // fallback image
                  }}
                />
              </figure>
            </div>

            <div className="text-center mt-4">
              <h3
                className="text-[18px] leading-[30px] text-headingColor
                    font-bold"
              >
                {data.name}
              </h3>
              <p
                className="text-textColor text-[15px] leading-6
                    font-medium"
              >
                {data.email}
              </p>
          
            </div>

            <div className="mt-[50px] md:mt-[100px]">
              <button
                className="w-full bg-[#181a1e] p-3 text-base leading-7
                    rounded-md text-white"
                onClick={handleLogout}
              >
                Log Out
              </button>
              {/* <button className='w-full bg-red-600 p-3 text-base leading-7
                    rounded-md text-white mt-4'>
                        Delete Account
                    </button> */}
            </div>
          </div>

          <div className="md:col-span-2 md:px-[30px]">
            <div className="flex flex-wrap gap-3">
           
    
              <button
                onClick={() => setTab("settings")}
                className={` ${
                  tab === "settings" && "bg-primaryColor text-white font-normal"
                } py-2 px-5 rounded-md text-headingColor
                    font-semibold text-base leading-7 border border-solid border-primaryColor`}
              >
                Settings
              </button>
            </div>
            {tab === "settings" && <Profile user={data} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
