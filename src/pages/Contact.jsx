import React, { useState, useEffect } from "react";
import newRequest from "../utils/newRequest"
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';
import { BASE_URL } from "../config"; 

const Contact = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setSubject("");
    setMessage("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !subject || !message) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false); 
      return;
    }

    try {
      const response = await newRequest.post(`${BASE_URL}contact/contact-us`, {
        email,
        subject,
        message,
      });
      console.log(response.data);
      toast.success("Message sent successfully!");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <section className="my-10">
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Nous contacter</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Fill out the form and we will get back to you as soon as possible
        </p>
        <form
          action="#"
          className="space-y-8"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="form__label"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="form-control form-control-sm mt-1"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="form__label"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="write the subject or title"
              className="form-control form-control-sm mt-1"
              value={subject} // Bind value to state
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="form__label"
            >
              Your Message
            </label>
            <textarea
              rows="6"
              id="message"
              placeholder="your message here"
              className="form-control form-control-sm mt-1"
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primaryColor text-white
                  text-[18px] leading-[30px] rounded-lg px-4 py-3"
            disabled={loading}
          >
            {loading ? <HashLoader size={35} color='#fff'/> : "Submit"} 
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;