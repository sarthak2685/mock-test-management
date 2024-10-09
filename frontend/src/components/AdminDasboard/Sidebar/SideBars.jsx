import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiUsers, FiClipboard, FiBarChart } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // Collapse/Expand Icons

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  const handleLogout = () => {
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse state
  };

  return (
    <aside
      className={`bg-[#007bff] text-white ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-full p-4 flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-2 rounded-md mb-7">
        {!isCollapsed && (
          <span className="text-2xl font-bold text-white">Mock Period</span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white p-1 rounded-md focus:outline-none"
        >
          {isCollapsed ? (
            <HiChevronRight size={24} />
          ) : (
            <HiChevronLeft size={24} />
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-grow">
        {/* Dashboard link */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : "text-white"
            }`
          }
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>
            Dashboard
          </span>
        </NavLink>

        {/* Student Management */}
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiUsers className="mr-2" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>
            Student Management
          </span>
        </NavLink>

        {/* Mock Test Management */}
        <NavLink
          to="/create-test"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiClipboard className="mr-2" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>
            Mock Test Management
          </span>
        </NavLink>

        {/* Performance */}
        <NavLink
          to="/performance"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <FiBarChart className="mr-2" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>
            Performance
          </span>
        </NavLink>

        {/* Separator Line */}
        <hr className="my-4 border-t border-white opacity-50" />
      </nav>

      {/* Log out button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center`}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
