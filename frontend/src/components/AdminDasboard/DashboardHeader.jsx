import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { FaExclamationTriangle, FaBars } from "react-icons/fa"; // Removed dollar sign import
import config from "../../config";

const DashboardHeader = ({ toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const bellDropdownRef = useRef(null);

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
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setNotifications(data || []); // Set notifications without reversing the order
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
        !bellDropdownRef.current.contains(event.target)
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
        <FaBars className="w-6 h-6" /> {/* Bar icon here */}
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
                      <div className="mr-3">
                        <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-semibold">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          Sent by: Mock Period {/* Static sender text */}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No new notifications</div>
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
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700">{user.name}</span>
          <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
