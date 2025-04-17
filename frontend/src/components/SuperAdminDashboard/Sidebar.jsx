import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiUsers, FiBarChart } from "react-icons/fi";
import { HomeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { FaTimes } from "react-icons/fa";
import { HiUserGroup, HiOutlineBell, HiOutlineClipboardList } from "react-icons/hi";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
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
        <button
          onClick={toggleSidebar}
          className={`text-white ${isCollapsed ? "hidden" : "block"} md:hidden`}
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

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

        <NavLink
          to="/notice-owner"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <HiOutlineBell className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Notice Board"}</span>
        </NavLink>

        {/* ✅ Updated Test List link */}
        <NavLink
          to="/test-list"
          className={`flex items-center py-2 px-4 mt-4 rounded hover:bg-blue-700 ${
            isActive("/test-list") || isActive("/view") || isActive("/chapter-view") ? "bg-blue-700" : ""
          }`}
        >
          <HiOutlineClipboardList className="mr-2" />
          <span className="block">{isCollapsed ? "" : "Test List"}</span>
        </NavLink>

        <hr className="my-4 border-t border-white opacity-50" />
      </nav>

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

export default Sidebar;
