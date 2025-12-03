import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { FaExclamationTriangle, FaBars } from "react-icons/fa"; // Import FaBars icon
import config from "../../config"; // Import config

const Header = ({ toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const mailDropdownRef = useRef(null);
  const bellDropdownRef = useRef(null);
  const [bellNotifications, setBellNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0); // Track unseen notifications
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    role: "guest",
    user: "Guest",
  };
// console.log("user",user)
  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const response = await fetch(`${config.apiUrl}/notifications/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBellNotifications(data);

          // Assume notifications have an `isSeen` property
          const unseen = data.filter((notification) => !notification.isSeen).length;
          setUnseenCount(unseen);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Toggle dropdowns
  const toggleDropdown = (dropdown) => {
    if (dropdown === "bell") {
      // Mark all notifications as seen when opening dropdown
      setBellNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isSeen: true,
        }))
      );
      setUnseenCount(0); // Reset unseen count
    }

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
        setOpenDropdown(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Function to get the corresponding icon for each alert type
  const getAlertIcon = () => {
    return <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />;
  };

  // Get the notifications to show (limit to 3 if not showing all)
  const notificationsToShow = showAllNotifications
    ? bellNotifications
    : bellNotifications.slice(0, 3);

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
          {unseenCount > 0 && ( // Show count only if unseen notifications exist
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {unseenCount}
            </span>
          )}

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
                  notificationsToShow.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start py-2 px-3 border-b last:border-none hover:bg-gray-100 transition"
                    >
                      <div className="mr-3">{getAlertIcon()}</div>
                      <div>
                        <p className="text-gray-700 font-semibold">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          Sent by:{" "}
                          {notification.institute
                            ? `${notification.institute.institute_name} (${notification.institute.name})`
                            : "Unknown Institute"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No new alerts</div>
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
          <span className="font-semibold text-gray-700">{user.user}</span>
          <div className="w-10 h-10 rounded-full bg-neutral-500 text-white flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
