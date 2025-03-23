import React from "react";
import { NavLink } from "react-router-dom";
import { FiUsers, FiBarChart, FiHelpCircle } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { FaTimes, FaFileAlt } from "react-icons/fa";
import { HiOutlineBell, HiClock } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentDate = new Date();
  const expiryDate = localStorage.getItem("expiry")
    ? new Date(localStorage.getItem("expiry"))
    : null;

  const isSubscriptionExpired = expiryDate ? currentDate > expiryDate : true;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("plan_taken");
    localStorage.removeItem("expiry");
    window.location.href = "/login";
  };

  return (
    <>
      <aside
        className={`bg-[#007bff] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 z-50 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2 rounded-md mb-7">
          <span className="text-2xl font-bold text-white">Mock Period</span>
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
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
            <span>Dashboard</span>
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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <FiUsers className="mr-2" />
            <span>Student Management</span>
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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <FiCalendar className="mr-2" />
            <span>Announcement</span>
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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <FaFileAlt className="mr-2" />
            <span>Test Detail</span>
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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <HiClock className="mr-2" />
            <span>Test Time</span>
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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <FiBarChart className="mr-2" />
            <span>Performance</span>
          </NavLink>

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
                toast.error("Your subscription has expired. Please renew.");
              }
            }}
          >
            <HiOutlineBell className="mr-2" />
            <span>Notice Board</span>
          </NavLink>

          {/* Separator */}
          <hr className="my-4 border-t border-white opacity-50" />
        </nav>

        {/* Footer Buttons */}
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
            <span>Help</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-2"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
