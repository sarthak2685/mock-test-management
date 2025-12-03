import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import illustrationImage from "../assets/Login.png";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/login`,
        {
          email: mobileNumber,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
console.log("response",response)
      if (response.data && response.data.role) {
        // Extract fields from the response
      const userData = {
    token: response.data.token,
    email: response.data.email,
    name: response.data.name,
    role: response.data.role,
    type: response.data.type,
    id: response.data.id,
    instituteId: response.data.instituteId,
  };

  localStorage.setItem("user", JSON.stringify(userData));

  // Redirect based on role
  if (response.data.role === "SUPERADMIN") {
    navigate("/super-admin");
  } else if (response.data.role === "ADMIN") {
    navigate("/admin");
    // setTimeout(() => window.location.reload(), 0);
  } else if (response.data.role === "STUDENT") {
    navigate("/");
    // setTimeout(() => window.location.reload(), 0);
  } 
      } else {
        setError("Account Expired. Please Renew");
      }
    } catch (error) {
      setError("Login failed. username or Password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiUrl}/send-otp/`, { email });
      setOtpSent(true);
      toast.success("Otp sent successfully");
      setError(null);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${config.apiUrl}/reset-password/`, {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success("Your password has been changed successfully!");
      setIsForgotPassword(false);
      setOtpSent(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <>
    <Helmet>
  <title>Login - Mock Period</title>
  <meta name="description" content="Log in to access your Mock Period account and take practice tests." />
</Helmet>
      <div className="flex min-h-screen bg-white items-center justify-center p-6">
        <div className="bg-white shadow-lg border border-gray-100 rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
              Welcome To Mock <strong className="text-[#007bff]">Period</strong>
            </h2>
            <p className="text-gray-500 mb-6 text-center md:text-left">
              {isForgotPassword
                ? "Reset your password to regain access."
                : "Log in to continue using our mock test platform."}
            </p>

            {isForgotPassword ? (
              otpSent ? (
                <form className="space-y-6" onSubmit={handleResetPassword}>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
                  >
                    Reset Password
                  </button>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
                  >
                    Send OTP
                  </button>
                </form>
              )
            ) : (
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
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
  type="submit"
  disabled={loading}
  className={`w-full bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300 flex items-center justify-center ${
    loading ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {loading ? (
    <div className="flex items-center space-y-1 gap-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid"></div>
      <p className="text-sm font-medium">Logging into Mock Period...</p>
    </div>
  ) : (
    "Log In"
  )}
</button>

              </form>
            )}
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
    </>
  );
};

export default Login;
