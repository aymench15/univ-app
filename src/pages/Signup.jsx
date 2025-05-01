// import React, { useState } from "react";
// import signupImg from "../assets/images/signup.gif";
// import { Link, useNavigate } from "react-router-dom";
// import { BASE_URL } from "../config";
// import { toast } from "react-toastify";
// import HashLoader from "react-spinners/HashLoader";
// import { Capacitor } from "@capacitor/core";
// import { Checkbox } from "rsuite";
// import "rsuite/Checkbox/styles/index.css";

// const Signup = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     password2: "",
//     name: "",
//     PhoneNumber: "",
//     gender: "male",
//     role: "Doctor",
//     faculty: "Faculty of Science and Technology",
//     department: "",
//   });
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewUrl("");
//     }
//   };

//   const handleTermsChange = () => {
//     setTermsAccepted((prev) => !prev);
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.password2) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (!termsAccepted) {
//       toast.error("You must accept the terms and conditions");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();
//       for (const key in formData) {
//         formDataToSend.append(key, formData[key]);
//       }
//       if (selectedFile && !Capacitor.isNativePlatform()) {
//         formDataToSend.append("photo", selectedFile, selectedFile.name);
//       }

//       const res = await fetch(`${BASE_URL}auth/register`, {
//         method: "POST",
//         body: formDataToSend,
//       });

//       const { message } = await res.json();

//       if (!res.ok) {
//         throw new Error(message);
//       }

//       setLoading(false);
//       toast.success(message);
//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//       setErrorMessage(error.message || "Failed to register");
//       toast.error(error.message || "Failed to register");
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="px-5 xl:px-0 my-10">
//       <div className="max-w-[1170px] mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2">
//           <figure className="rounded-l-lg">
//             <img
//               src={signupImg}
//               alt=""
//               className="w-full rounded-l-lg"
//             />
//           </figure>

//           <div className="rounded-l-lg lg:pl-16 py-10">
//             <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
//               Create an <span className="text-primaryColor">Account</span>
//             </h3>
            
//             <form
//               onSubmit={submitHandler}
//               encType="multipart/form-data"
//             >
//               {errorMessage && (
//                   <div className="mb-5 text-red-600 text-sm font-medium">
//                     {errorMessage}
//                   </div>
//                 )}

              
//               <div className="mb-5">
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Full Name"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5">
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Email"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5">
//                 <input
//                   type="text"
//                   name="PhoneNumber"
//                   value={formData.PhoneNumber}
//                   onChange={handleInputChange}
//                   placeholder="Phone Number"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5">
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Password"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5">
//                 <input
//                   type="password"
//                   name="password2"
//                   value={formData.password2}
//                   onChange={handleInputChange}
//                   placeholder="Confirm your password"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5 flex items-center justify-between">
//                 <label
//                   htmlFor=""
//                   className="text-headingColor font-bold text-base leading-7"
//                 >
//                   Gender:
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
//                   >
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </select>
//                 </label>
//               </div>
//               <div className="mb-5 flex items-center justify-between">
//                 <label
//                   htmlFor=""
//                   className="text-headingColor font-bold text-base leading-7"
//                 >
//                   Role:
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
//                   >
//                     <option value="Professor">Professor</option>
//                     <option value="Doctor">Doctor</option>
//                   </select>
//                 </label>
//               </div>
//               <div className="mb-5 flex items-center justify-between">
//                 <label
//                   htmlFor=""
//                   className="text-headingColor font-bold text-base leading-7"
//                 >
//                   Faculty:
//                   <select
//                     name="faculty"
//                     value={formData.faculty}
//                     onChange={handleInputChange}
//                     className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
//                   >
//                     <option value="Faculty of Science and Technology">Faculty of Science and Technology</option>
//                     <option value="Faculty of Exact Sciences, Natural Sciences, and Life Sciences">Faculty of Exact Sciences, Natural Sciences, and Life Sciences</option>
//                     <option value="Faculty of Humanities and Social Sciences">Faculty of Humanities and Social Sciences</option>
//                     <option value="Faculty of Letters and Languages">Faculty of Letters and Languages</option>
//                     <option value="Faculty of Law and Political Sciences">Faculty of Law and Political Sciences</option>
//                     <option value="Faculty of Economic Sciences, Commerce, and Management Sciences">Faculty of Economic Sciences, Commerce, and Management Sciences</option>
//                     <option value="Institute of Sciences and Techniques of Physical and Sports Activities">Institute of Sciences and Techniques of Physical and Sports Activities</option>
//                   </select>
//                 </label>
//               </div>
//               <div className="mb-5">
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleInputChange}
//                   placeholder="Department Name"
//                   className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
//                   required
//                 />
//               </div>
//               <div className="mb-5 flex items-center gap-3">
//                 {Capacitor.isNativePlatform() ? (
//                   <p>You can add a photo via the browser</p>
//                 ) : (
//                   <>
//                     {previewUrl && (
//                       <figure
//                         className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center"
//                       >
//                         <img
//                           src={previewUrl}
//                           alt=""
//                           className="w-full h-full rounded-full object-cover"
//                         />
//                       </figure>
//                     )}
//                     <div className="relative w-[160px] h-[50px]">
//                       <input
//                         type="file"
//                         name="photo"
//                         onChange={handleFileInputChange}
//                         id="customFile"
//                         accept=".jpg, .png"
//                         className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
//                       />
//                       <label
//                         htmlFor="customFile"
//                         className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
//                       >
//                         Add a photo
//                       </label>
//                     </div>
//                   </>
//                 )}
//               </div>
//               <div className="mb-5 flex items-center gap-3">
//                 <Checkbox 
//                   checked={termsAccepted} 
//                   onChange={handleTermsChange} 
//                   name="terms" 
//                 />
//                 <label htmlFor="terms" className="text-sm text-gray-600">
//                   By signing, you accept our
//                   <Link
//                     to="/conditions-terms"
//                     className="px-1 underline"
//                   >
//                     Terms and Conditions
//                   </Link>
//                   .
//                 </label>
//               </div>

//               <div className="mt-7">
//                 <button
//                   disabled={loading}
//                   type="submit"
//                   className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
//                 >
//                   {loading ? (
//                     <HashLoader size={35} color="#fff" />
//                   ) : (
//                     "Sign Up"
//                   )}
//                 </button>
//               </div>
//               <p className="mt-5 text-textColor text-center">
//                 You already have an account?
//                 <Link to="/login" className="text-primaryColor font-medium ml-1">
//                   Log In
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Signup;



import React, { useState } from "react";
import signupImg from "../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { Capacitor } from "@capacitor/core";
import { Checkbox } from "rsuite";
import CascadingSelects from '../components/cascade-select/cascade_selection'

import "rsuite/Checkbox/styles/index.css";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    name: "",
    PhoneNumber: "",
    gender: "male",
    role: "Doctor",

  });
  const [academicSelections, setAcademicSelections] = useState({
    branch: '',
    department: '',
    specialty: '',
    subjectType: '',
    subject: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleTermsChange = () => {
    setTermsAccepted((prev) => !prev);
  };

  const TermsModal = ({ isOpen, onClose }) => {
    return (
      <div
        className={`fixed inset-0 z-50 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white px-8 py-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto w-fit"> {/* إضافة w-fit */}
            <div dir="rtl"> {/* إضافة حاوية dir="rtl" */}
            <h2 className="text-headingColor text-xl font-bold mb-4 text-center">
              تعهد بخصوص إعداد أسئلة إمتحانات مسابقة الكتوراه بعنوان السنة الجامعية 2024-2025
            </h2>
            <p className="text-textColor mb-6 leading-7">
              اتعهد ب :
            </p>
            <ol className="text-textColor mb-6 list-decimal list-inside leading-7">
              <li>
                أن أحافظ على سرية الأسئلة التي أعددتها و أرسلتها عبر منصة بنك الأسئلة.
              </li>
              <li>
                وأن أعلم بأنها من ضمن مقرررات المادة التي كلفت بإقراح أسئلة فيها.
              </li>
              <li>
                وألتزم على عدم نشرها بأي طريقة كانت رقمية أو ورقية و أن لا أترك أي نسخة أو معلومة أو ملف
                متعلقا بها على أي جهاز كمبيوتر أو على الأجهزة الألكترونية المخصصة للحفظ (أقراص مدمجة أو غيرها)
                أو الاتصال (هواتف أو غيرها).
              </li>
              <li>
                كم أتعهد بعدم ارسالها عبر أي بريد الكتروني أو أي وسيلة اتصال ورقية أو رقمية (بلوتوث، ف ت بي، أو
                غيرها) و أن لا أشركها أي كان بطريقة مباشرة أو رقمية مهما كانت الوسيلة (كوسائل التواصل
                الإجتماعي أو غيرها).
              </li>
              <li>وأتعهد بإتلاف أي مسودات خاصة بها بصورة فورية.</li>
            </ol>
            </div>
  
            <h2 className="text-headingColor text-xl font-bold mb-4 text-center">
              Pledge Regarding the Preparation of Doctoral Competition Exam Questions for the Academic Year 2024-2025
            </h2>
            <p className="text-textColor mb-6 leading-7">
              I pledge to:
            </p>
            <ol className="text-textColor mb-6 list-decimal list-inside leading-7">
              <li>
                To maintain the confidentiality of the questions I have prepared and submitted via the Question Bank platform.
              </li>
              <li>
                To ensure that these questions are exclusively based on the syllabus of the subject I have been assigned to propose questions for.
              </li>
              <li>
                To refrain from publishing them in any form, whether digital or printed, and not to leave any copies, information, or files related to them on any computer or electronic storage devices (such as CDs or others) or communication devices (such as phones or others).
              </li>
              <li>
                To avoid sending them through any email or any means of communication, whether paper-based or digital (Bluetooth, FTP, or others), and not to share them with anyone directly or digitally by any means (such as social media or otherwise).
              </li>
              <li>To immediately destroy any drafts related to these questions.</li>
            </ol>
            <div className="text-center">
            <button
              className="bg-primaryColor text-white px-6 py-3 rounded-md font-medium"
              onClick={onClose}
            >
              إغلاق / Close
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      for (const key in academicSelections) {
        formDataToSend.append(key, academicSelections[key]);
      }
   

      const res = await fetch(`${BASE_URL}auth/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to register");
      toast.error(error.message || "Failed to register");
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0 my-10">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <figure className="rounded-l-lg">
            <img
              src={signupImg}
              alt=""
              className="w-full rounded-l-lg"
            />
          </figure>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">Account</span>
            </h3>
            
            <form
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              {errorMessage && (
                  <div className="mb-5 text-red-600 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

              
              <div className="mb-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pr-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-headingColor font-bold text-base leading-7"
                >
                  Role:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-headingColor font-bold text-base leading-7"
                >
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
              </div>
             
          

              <div className="mb-5">
                <CascadingSelects onChange={setAcademicSelections} />
              </div>


              <div className="mb-5 flex items-center gap-3">
  <Checkbox 
    checked={termsAccepted} 
    onChange={handleTermsChange} 
    name="terms" 
  />
  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
    By signing, you accept our
    <button onClick={() => setIsTermsModalOpen(true)} className="px-1 underline">
      Terms and Conditions
    </button>
    .
  </label>
  {isTermsModalOpen && <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />}
</div>


              <div className="mt-7">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                  {loading ? (
                    <HashLoader size={35} color="#fff" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
              <p className="mt-5 text-textColor text-center">
                You already have an account?
                <Link to="/login" className="text-primaryColor font-medium ml-1">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

