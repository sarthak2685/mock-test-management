import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiBarChart } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { FaTimes } from "react-icons/fa"; // Importing Font Awesome close icon
import { HiUserGroup } from "react-icons/hi"; // Importing icons for other sections
import { HiOutlineBell } from "react-icons/hi"; // Notice Board icon
import { HiOutlineClipboardList } from "react-icons/hi";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <aside
      className={`bg-[#007bff] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 z-50 ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      }`}
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="flex items-center justify-between p-2 rounded-md mb-7">
        <span className="text-2xl font-bold text-white">Mock Period</span>

        {/* Show close button only in mobile view */}
        <button
          onClick={toggleSidebar}
          className={`text-white ${isCollapsed ? "hidden" : "block"} md:hidden`}
        >
          <FaTimes className="w-6 h-6" /> {/* Close icon */}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-grow">
        <NavLink
          to="/super-admin"
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
          to="/admin-management"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiUsers className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Admin Management"}</span>
        </NavLink>

        {/* Admins List Section */}
        <NavLink
          to="/admins-list"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <HiUserGroup className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Admins List"}</span>
        </NavLink>

        <NavLink
          to="/create-test"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiBarChart className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Create Test"}</span>
        </NavLink>

        {/* Test Time Section */}

        {/* Notice Board Section */}
        <NavLink
          to="/notice-owner"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <HiOutlineBell className="mr-2" /> {/* Notice Board icon */}
          <span className="block">{isCollapsed ? "" : "Notice Board"}</span>
        </NavLink>
        <NavLink
          to="/test-list"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <HiOutlineClipboardList className="mr-2" /> {/* Notice Board icon */}
          <span className="block">{isCollapsed ? "" : "Test List"}</span>
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

export default Sidebar;
