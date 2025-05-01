import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import newRequest from "../../utils/newRequest";
import {Capacitor} from '@capacitor/core';

const Profile = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    photo: null, // This is not needed unless used somewhere else
    gender: "male",
    role:"Doctor",
    faculty:"Faculty of Science and Technology",
    department:""
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      photo: user.img,
      gender: user.gender,
      role: user.role,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        photo: null,
      });
    }
  };

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);

      formDataToSend.append(
        "password",
        formData.password === undefined ? "" : formData.password,
      );
      formDataToSend.append("name", formData.name);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("role", formData.role);
      if (selectedFile && !Capacitor.isNativePlatform() ) {
        formDataToSend.append("photo", selectedFile);
      }

      let response;
    
    if (Capacitor.isNativePlatform()) {
      response = await newRequest.put(`${BASE_URL}users/usersupdate?id=${user._id}`,
        formDataToSend,
       { headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", 
      }
    });
    } else {
      // Use axios for web platform
      response = await newRequest.put(
        `${BASE_URL}users/usersupdate?id=${user._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        }
      );
    }

    const { message } = Capacitor.isNativePlatform() ? response.data : response.data;
    setLoading(false);
    toast.success(message);
    navigate("/users/profile/me");
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message || "Failed to update profile");
    setLoading(false);
  }
};

  return (
    <div className="mt-10">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-3"
      >
        <div className=" flex flex-col gap-1">
          <label
            htmlFor=""
            className="text-headingColor font-bold text-base leading-7"
          >
            Name: (Not editable)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form-control form-control-sm mt-1"
            aria-readonly
            readOnly
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label
            htmlFor=""
            className="text-headingColor font-bold text-base leading-7"
          >
            Email: (Not editable)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form-control form-control-sm mt-1"
            aria-readonly
            readOnly
          />
        </div>

      

        <div className=" flex flex-col gap-1">
          <label
            htmlFor=""
            className="text-headingColor font-bold text-base leading-7"
          >
            Gender: (Not editable)
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="text-textColor font-semibold text-[15px]
                leading-7 px-4 py-3 focus:outline-none bg-gray-100"
            disabled
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        

        <div className=" flex flex-col gap-1">
          <label
            htmlFor=""
            className="text-headingColor font-bold text-base leading-7"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="New Password"
            className="form-control form-control-sm mt-1"
          />
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
                size={25}
                color="#fff"
              />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;