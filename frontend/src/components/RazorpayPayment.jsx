import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import config from "../config";

const RazorpayPayment = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [formData, setFormData] = useState({
    name: "",
    institute_name: "",
    email_id: "",
    mobile_no: "",
    password_encoded: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    invalidPhone: false,
    invalidEmail: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const checkPhoneNumber = async () => {
      try {
        if (formData.mobile_no && /^[0-9]{10}$/.test(formData.mobile_no)) {
          const response = await axios.get(`${config.apiUrl}/check-number/`, {
            params: { mobile_no: formData.mobile_no },
          });
          // Handle API response
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneExists: response.data.exists,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, phoneExists: false }));
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404 && data.message === "EXISTS") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              phoneExists: true,
            }));
          }
        } else {
          console.error("Error checking phone number:", error);
        }
      }
    };
  
    checkPhoneNumber();
  }, [formData.mobile_no]);
  


  useEffect(() => {
    setErrors({
      passwordMismatch: formData.password_encoded !== formData.confirmPassword,
      invalidPhone:
        formData.mobile_no && !/^[0-9]{10}$/.test(formData.mobile_no),
      invalidEmail:
        formData.email_id &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id),
    });
  }, [formData]);

  const postFormData = async () => {
    try {
      const payload = {
        ...formData,
        licence: selectedPlan.id,
      };

      const response = await axios.post(
        `${config.apiUrl}/vendor-admin-crud/`,
        payload
      );

      if (response.status === 200) {
        setModalMessage("Payment Successful! User Created.");
        setIsUserCreated(true); // User creation successful
      } else {
        setModalMessage("Payment successful but User Creation Failed.");
        setIsUserCreated(false); // User creation failed
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setModalMessage(
        "Payment was successful, but an error occurred while creating user. Please try again."
      );
      setIsUserCreated(false); // User creation failed
    }
  };

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post(
        `${config.apiUrl}/create-order/`,
        {
          amount: parseInt(selectedPlan.price.replace("₹", "")) * 100,
        }
      );

      const options = {
        key: "rzp_live_D3C0vsHhEkuMCH", // Replace with your Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: formData.name,
        description: "Subscription Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyResponse = await axios.post(
            `${config.apiUrl}/verify-payment/`,
            response,
            {
              params: {
                email: formData.email_id, // Include email as a query parameter
              },
            }
          );

          if (verifyResponse.data.status === "Payment Verified") {
            setIsPaymentSuccess(true);
            setModalMessage("Payment Successful! Creating Your Account...");
            setIsModalOpen(true); // Open the modal only after payment success
            await postFormData(); // Post data after successful payment verification
          } else {
            setModalMessage("Please check the payment details.");
            setIsPaymentSuccess(false);
            setIsModalOpen(true); // Open the modal if verification fails
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email_id,
          contact: formData.mobile_no,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setModalMessage("Something went wrong! Please try again.");
      setIsPaymentSuccess(false);
      setIsModalOpen(true); // Open the modal if there's a payment error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.passwordMismatch || errors.invalidPhone || errors.invalidEmail)
      return;

    setLoading(true);
    await handlePayment();
    setLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
    setIsPaymentSuccess(false);
    setIsUserCreated(false);
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-3xl p-10 bg-white shadow-xl rounded-lg border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Subscription Form
        </h1>

        {/* Plan Display UI */}
        <div className="mb-6 border border-blue-500 rounded-xl p-6 flex justify-between items-center bg-gray-50">
          <div className="text-lg md:text-xl font-semibold text-blue-600">
            <p>Your selected plan:</p>
            <p className="text-2xl font-bold">{selectedPlan?.name}</p>
          </div>
          <div className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-lg">
            <p className="font-semibold text-center">{selectedPlan?.price}</p>
          </div>
        </div>

        {/* Form Start */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <input
                type="text"
                id="institute_name"
                name="institute_name"
                value={formData.institute_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Enter your institute name"
                required
              />
            </div>
            <div>
              <input
                type="email"
                id="email_id"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Enter your email"
                required
              />
              {errors.invalidEmail && (
                <p className="text-sm text-red-500">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <div>
              <input
                type="tel"
                id="mobile_no"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Enter your phone number"
                required
              />
              {errors.invalidPhone && (
                <p className="text-sm text-red-500">
                  Please enter a valid 10-digit phone number.
                </p>
              )}
               {errors.phoneExists && (
                <p className="text-sm text-red-500">
                  Phone number already exists.
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password_encoded"
                name="password_encoded"
                value={formData.password_encoded}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400 hover:shadow-lg"
                placeholder="Confirm your password"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.passwordMismatch && (
                <p className="text-sm text-red-500">Passwords do not match.</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-auto px-10 py-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300`}
            >
              {loading ? "Processing..." : "Submit and Pay"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-2xl font-semibold mb-4">Payment Status</h2>
            <p className="text-lg mb-4">{modalMessage}</p>
            {isUserCreated && (
              <p className="text-lg font-semibold text-green-600">
                User created successfully!
              </p>
            )}
            {/* <p className="text-lg mt-4">
              If you have any queries or issues, you may contact the owner at
              the contact number provided.
            </p> */}
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
