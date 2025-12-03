import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { FaExclamationTriangle, FaBars, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const DashboardHeader = ({ toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const bellDropdownRef = useRef(null);
  const userDropdownRef = useRef(null); // Added this ref
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    type: "guest",
    user: "Guest",
  };

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/notifications/`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Custom sorting logic (sort by 'priority' field, descending order)
      const sortedNotifications = data?.sort((a, b) => {
        return b.priority - a.priority; // Sort by 'priority' (higher value first)
      });

      setNotifications(sortedNotifications || []); // Set sorted notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Toggle dropdowns
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        bellDropdownRef.current &&
        !bellDropdownRef.current.contains(event.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Get the notifications to show (limit to 3 if not showing all)
  const notificationsToShow = showAllNotifications
    ? notifications
    : notifications.slice(0, 3);

  return (
    <header className="bg-white shadow-lg flex items-center justify-between p-4 relative">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 lg:hidden mr-4"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      <div className="flex-grow" />

      <div className="flex items-center space-x-6">
        {/* Bell Icon */}
        <div className="relative cursor-pointer" ref={bellDropdownRef}>
          <FiBell
            className="text-gray-600 w-6 h-6"
            onClick={() => toggleDropdown("bell")}
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>

          {openDropdown === "bell" && (
            <div
              className={`${
                window.innerWidth < 768
                  ? "fixed right-2 w-64"
                  : "absolute right-0 mt-2 w-80"
              } bg-white border border-gray-200 shadow-md rounded-lg z-50`}
            >
              <div className="p-4 text-sm">
                <h4 className="font-semibold mb-2 text-blue-500">
                  Alerts Center
                </h4>
                {notificationsToShow.length > 0 ? (
                  notificationsToShow.map((notification, index) => (
                    <div
                      key={index}
                      className="flex items-start py-2 px-3 border-b last:border-none hover:bg-gray-100 transition"
                    >
                      <div className="mr-3 flex items-center justify-center">
                        {/* Triangle Icon */}
                        <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-semibold">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          Sent by: {user.institute_name || "Unknown Institute"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600 flex items-center">
                    <FaExclamationTriangle className="text-gray-400 w-5 h-5 mr-2" />
                    No new notifications
                  </div>
                )}
                <div
                  className="text-blue-500 text-sm font-semibold cursor-pointer hover:underline mt-2"
                  onClick={() => setShowAllNotifications((prev) => !prev)}
                >
                  {showAllNotifications
                    ? "Show Less Notifications"
                    : "Show All Notifications"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="relative cursor-pointer" ref={userDropdownRef}>
          <div
            className="flex items-center space-x-2"
            onClick={() => toggleDropdown("user")}
          >
          {user.pic &&
                  user.pic !==
                    "/media/uploads/questions/option_4_uFtm5qj.png" ? (
                    <img
                      src={`${config.apiUrl}${user.pic}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#007bff] flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : ""}
                    </div>
                  )}
          </div>

          {openDropdown === "user" && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div
                className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <FaUser className="text-gray-700 w-5 h-5 mr-2" />
                <span className="text-gray-700">Profile</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
