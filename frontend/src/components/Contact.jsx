import React, { useState } from "react";
import { toast } from "react-toastify";
import config from "../config";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiUrl}/contact-us/`;

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      message: formData.message,
      mobile_no: formData.phoneNumber,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // Success toast
      toast.success("Your ticket has been submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Reset form fields after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit the form:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">
       <Helmet>
        <title>Contact Us - Support Ticket</title>
        <meta name="description" content="Submit your support ticket and get assistance from our team." />
        <meta name="keywords" content="support, contact, help, customer service" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Need Help? Open a Ticket
        </h1>
        <p className="text-gray-600 mt-2">
          Submit Your Support Ticket. We will be with you as soon as we are
          able.
        </p>
      </div>

      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg opacity-30"></div>

        <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-1"
                htmlFor="email"
              >
                Business Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-1"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-1"
              htmlFor="message"
            >
              What are you looking for?
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Type your message here"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ContactForm;
