import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for password visibility toggle
import illustrationImage from '../assets/login.webp'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-white items-center justify-center p-6">
      <div className="bg-white shadow-lg border border-gray-100 rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Welcome To Mock <strong className='text-[#007bff]'>Period</strong>
          </h2>
          <p className="text-gray-500 mb-6 text-center md:text-left">
            Log in to continue using our mock test platform.
          </p>

          <form className="space-y-6">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Username"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-0 text-gray-600 text-sm transition-all"
              >
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              <label
                htmlFor="password"
                className="absolute left-0 top-0 text-gray-600 text-sm transition-all"
              >
              </label>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300">
              Log In
            </button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div> */}
        </div>

        <div className="md:w-1/2 bg-white shadow-lg border border-gray-100 rounded-r-lg relative hidden md:flex justify-center items-center illustration-container">
          <div className="absolute inset-0  opacity-10 rounded-r-lg"></div>
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
