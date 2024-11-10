import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiBarChart } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { FaTimes } from "react-icons/fa"; 

const Sidebarr = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    // Navigate to the login page
    navigate("/login");
  };

  const handleHomeNavigation = () => {
    // Set login cookies here
    document.cookie = "userLoggedIn=true; path=/;";

    // Navigate to the home page
    navigate("/");
  };
  return (
    <aside
      className={`bg-[#007bff] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      }`}
    >
    
      <div className="flex items-center justify-between p-2 rounded-md mb-7">
      <button onClick={handleHomeNavigation}>
          <span className="text-2xl font-bold text-white">Mock Period</span>
        </button>
                {/* Show close button only in mobile view */}
        <button
          onClick={toggleSidebar}
          className={`text-white ${isCollapsed ? "hidden" : "block"} md:hidden`}
          aria-label="Close Sidebar"
        >
          <FaTimes className="w-6 h-6" /> {/* Close icon */}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-grow">
        <NavLink
          to="/student-dashboard"
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
          to="/student-performance"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiBarChart className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Performance"}</span>
        </NavLink>

        {/* Separator Line */}
        <hr className="my-4 border-t border-white opacity-50" />
      </nav>

      {/* Log out button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          <span className="block">{isCollapsed ? "" : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebarr;
