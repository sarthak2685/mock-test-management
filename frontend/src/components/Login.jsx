import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import illustrationImage from "../assets/login.webp";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.apiUrl}/admin-student-owner/login/`,
        {
          mobileno: mobileNumber,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Data", response.data.data);

      if (response.data.data && response.data.data.type) {
        // Extract fields from the response
        const { type, user, token, id, name, institute_name } = response.data.data;

        // Consolidate into a single object
        const userData = { type, user, token, id, name, institute_name };

        console.log("Data being saved to localStorage: ", userData);

        // Save the object in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Clear the Data from localStorage
        // localStorage.removeItem("submittedData");
        // localStorage.removeItem("selectedExamDuration");
        // localStorage.removeItem("timerDuration");
        // localStorage.removeItem("start_time");
        // localStorage.removeItem("submissionResult");
        // localStorage.removeItem("testDuration");
        // localStorage.removeItem("end_time");
        // localStorage.removeItem("selectedTestName");
        // localStorage.removeItem("exam_id");

        // Navigation logic
        if (type === "owner") {
          navigate("/super-admin");
          setTimeout(() => window.location.reload(), 0);
        } else if (type === "admin") {
          navigate("/admin");
          setTimeout(() => window.location.reload(), 0);
        } else if (type === "student") {
          navigate("/");
          setTimeout(() => window.location.reload(), 0);
        } else {
          setError("Unknown role. Please contact support.");
        }
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white items-center justify-center p-6">
      <div className="bg-white shadow-lg border border-gray-100 rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Welcome To Mock <strong className="text-[#007bff]">Period</strong>
          </h2>
          <p className="text-gray-500 mb-6 text-center md:text-left">
            Log in to continue using our mock test platform.
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="text"
                id="mobile"
                name="mobile"
                className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>

        <div className="md:w-1/2 bg-white shadow-lg border border-gray-100 rounded-r-lg relative hidden md:flex justify-center items-center illustration-container">
          <div className="absolute inset-0 opacity-10 rounded-r-lg"></div>
          <img
            src={illustrationImage}
            alt="Login Illustration"
            className="relative z-10 h-3/4 object-contain illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
