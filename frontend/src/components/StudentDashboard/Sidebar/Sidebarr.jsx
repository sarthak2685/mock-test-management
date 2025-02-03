import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { MdOutlineAssignment } from "react-icons/md";
import { useUser } from "../../../components/UserContext/UserContext";
import { BiBookAlt } from "react-icons/bi";

const Sidebarr = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeNavigation = () => {
    document.cookie = "userLoggedIn=true; path=/;";
    navigate("/");
  };

  return (
    <aside
      className={`bg-[#007bff] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 z-50 ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      }`}
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      {/* Header section */}
      <div className="flex items-center justify-between p-2 rounded-md mb-7">
        {/* Home button */}
        <button onClick={handleHomeNavigation} className="focus:outline-none">
          <span className="text-2xl font-bold text-white">Mock Period</span>
        </button>

        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="text-white md:hidden focus:outline-none"
          aria-label="Close Sidebar"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-grow">
        <NavLink
          to="/student-dashboard"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded transition-colors ${
              isActive ? "bg-blue-700" : "hover:bg-blue-600"
            }`
          }
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/Exam-Wise-performance"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded transition-colors ${
              isActive ? "bg-blue-700" : "hover:bg-blue-600"
            }`
          }
        >
          <MdOutlineAssignment className="mr-2" />
          {!isCollapsed && <span>Exam-Wise Performance</span>}
        </NavLink>

        <NavLink
          to="/Subject-wise-performance"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded transition-colors ${
              isActive ? "bg-blue-700" : "hover:bg-blue-600"
            }`
          }
        >
          <BiBookAlt className="mr-2" />
          {!isCollapsed && <span>Subject-wise Performance</span>}
        </NavLink>

        {/* Separator Line */}
        <hr className="my-4 border-t border-white opacity-50" />
      </nav>

      {/* Log out button */}
      <div className="mt-auto mb-20 md:mb-0">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebarr;
