// import React, { useState, useEffect } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const SubscriptionForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     institute: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({
//     passwordMismatch: false,
//     invalidPhone: false,
//     invalidEmail: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Real-time validation with useEffect
//   useEffect(() => {
//     setErrors({
//       ...errors,
//       passwordMismatch:
//         formData.password &&
//         formData.confirmPassword &&
//         formData.password !== formData.confirmPassword,
//       invalidPhone: formData.phone && !/^[0-9]{10}$/.test(formData.phone),
//       invalidEmail:
//         formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
//     });
//   }, [formData]);

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (errors.passwordMismatch || errors.invalidPhone || errors.invalidEmail)
//       return;
//     setLoading(true);

//     // Simulate server submission
//     setTimeout(() => {
//       alert("Form submitted successfully!");
//       setLoading(false);
//       setFormData({
//         name: "",
//         institute: "",
//         email: "",
//         phone: "",
//         password: "",
//         confirmPassword: "",
//       });
//       setErrors({
//         passwordMismatch: false,
//         invalidPhone: false,
//         invalidEmail: false,
//       });
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="w-full max-w-3xl p-10 bg-gray-100 shadow-xl rounded-lg transform transition duration-500 hover:scale-105">
//         <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
//           Subscription Form
//         </h1>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Name */}
//             <div>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>

//             {/* Institute Name */}
//             <div>
//               <input
//                 type="text"
//                 id="institute"
//                 name="institute"
//                 value={formData.institute}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Enter your institute name"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Enter your email"
//                 autoComplete="email"
//                 aria-invalid={errors.invalidEmail ? "true" : "false"}
//                 required
//               />
//               {errors.invalidEmail && (
//                 <p className="text-sm text-red-500">
//                   Please enter a valid email address.
//                 </p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Enter your phone number"
//                 autoComplete="tel"
//                 aria-invalid={errors.invalidPhone ? "true" : "false"}
//                 required
//               />
//               {errors.invalidPhone && (
//                 <p className="text-sm text-red-500">
//                   Please enter a valid 10-digit phone number.
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Enter your password"
//                 autoComplete="new-password"
//                 required
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
//                 placeholder="Confirm your password"
//                 autoComplete="new-password"
//                 aria-invalid={errors.passwordMismatch ? "true" : "false"}
//                 required
//               />
//               <span
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//               {errors.passwordMismatch && (
//                 <p className="text-sm text-red-500">
//                   Passwords do not match. Please check and try again.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center items-center">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-auto px-10 py-3 ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-500 to-indigo-600"
//               } text-white font-semibold rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300`}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionForm;
