import React from "react";
import { NavLink } from "react-router-dom";
import { FiUsers, FiBarChart, FiHelpCircle } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { FaTimes } from "react-icons/fa";
import { HiOutlineBell, HiClock } from "react-icons/hi"; // Notice Board icon
import { FiCalendar } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileAlt } from "react-icons/fa";


const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  // Retrieve subscription days remaining from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const currentDate = new Date(); // Aaj ki date
  const expiryDate = localStorage.getItem("expiry")
    ? new Date(localStorage.getItem("expiry"))
    : null;

  // const expiryDate = user?.expiry ? new Date(user.expiry) : null; // Subscription expiry date
  console.log("DATE", expiryDate);

  const isSubscriptionExpired = expiryDate ? currentDate > expiryDate : true; // If expiryDate is null or invalid, consider it expired

  const handleLogout = () => {
    // Remove user and subscription details from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("plan_taken");
    localStorage.removeItem("expiry");

    console.log("User and subscription details removed from localStorage.");

    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <>
      <ToastContainer />
      <aside
        className={`bg-[#007bff] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-2 rounded-md mb-7">
          <span className="text-2xl font-bold text-white">Mock Period</span>

          {/* Show close button only in mobile view */}
          <button
            onClick={toggleSidebar}
            className="text-white md:hidden" // Ensuring it's hidden on medium screens and up
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : "text-white"
              }`
            }
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            <span className="block">{isCollapsed ? "" : "Dashboard"}</span>
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <FiUsers className="mr-2" />
            <span className="block">
              {isCollapsed ? "" : "Student Management"}
            </span>
          </NavLink>

          <NavLink
            to="/announcement"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <FiCalendar className="mr-2" /> {/* Calendar Icon */}
            <span className="block">{isCollapsed ? "" : "Announcement"}</span>
          </NavLink>
          <NavLink
            to="/test-detail"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <FaFileAlt className="mr-2" />
            <span className="block">{isCollapsed ? "" : "Test Detail"}</span>
          </NavLink>

          <NavLink
            to="/test-time"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <HiClock className="mr-2" />
            <span className="block">{isCollapsed ? "" : "Test Time"}</span>
          </NavLink>

          <NavLink
            to="/performance"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <FiBarChart className="mr-2" />
            <span className="block">{isCollapsed ? "" : "Performance"}</span>
          </NavLink>

          {/* Notice Board Section */}
          <NavLink
            to="/notice-admin"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              } ${isSubscriptionExpired ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onClick={(e) => {
              if (isSubscriptionExpired) {
                e.preventDefault();
                toast.error(
                  "Your subscription has expired. Please renew to access this feature."
                );
              }
            }}
          >
            <HiOutlineBell className="mr-2" /> {/* Notice Board icon */}
            <span className="block">{isCollapsed ? "" : "Notice Board"}</span>
          </NavLink>

          {/* Separator Line */}
          <hr className="my-4 border-t border-white opacity-50" />
        </nav>

        <div className="mt-auto flex flex-col mb-20 md:mb-0">
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex justify-center items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <FiHelpCircle className="h-5 w-5 mr-2" />
            <span className="block">{isCollapsed ? "" : "Help"}</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-2"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            <span className="block">{isCollapsed ? "" : "Log Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;