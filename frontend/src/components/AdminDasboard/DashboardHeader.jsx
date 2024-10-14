import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import {
  FaFileAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaBars,
} from "react-icons/fa"; // Import Font Awesome icons

const DashboardHeader = ({ user, toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const mailDropdownRef = useRef(null);
  const bellDropdownRef = useRef(null);

  // Mock notification data (replace with real data)
  const bellNotifications = [
    {
      id: 1,
      alert: "A new monthly report is ready to download!",
      time: "December 12, 2019",
      type: "report",
    },
    {
      id: 2,
      alert: "$290.29 has been deposited into your account!",
      time: "December 7, 2019",
      type: "deposit",
    },
    {
      id: 3,
      alert: "We've noticed unusually high spending for your account.",
      time: "December 2, 2019",
      type: "spending",
    },
  ];

  // Toggle dropdowns
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click was outside of both dropdowns
      if (
        openDropdown &&
        mailDropdownRef.current &&
        bellDropdownRef.current &&
        !mailDropdownRef.current.contains(event.target) &&
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

  // Function to get the corresponding icon for each alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case "report":
        return <FaFileAlt className="text-blue-500 w-4 h-4" />; // Reduced size
      case "deposit":
        return <FaDollarSign className="text-green-500 w-4 h-4" />; // Reduced size
      case "spending":
        return <FaExclamationTriangle className="text-yellow-500 w-4 h-4" />; // Reduced size
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-lg flex items-center justify-between p-2 relative">
      {" "}
      {/* Reduced padding */}
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 lg:hidden mr-2" /* Adjusted margin */
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-4 h-4" /> {/* Smaller bar icon */}
      </button>
      <div className="flex-grow" />
      <div className="flex items-center space-x-4">
        {" "}
        {/* Reduced spacing */}
        {/* Bell Icon */}
        <div className="relative cursor-pointer" ref={bellDropdownRef}>
          <FiBell
            className="text-gray-600 w-4 h-4" /* Smaller icon */
            onClick={() => toggleDropdown("bell")}
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {bellNotifications.length}
          </span>

          {openDropdown === "bell" && (
            <div
              className={`${
                // Adjust positioning for mobile view
                window.innerWidth < 768
                  ? "fixed right-2 w-44" // Adjusted width for mobile
                  : "absolute right-0 mt-1 w-60" // For desktop view
              } bg-white border border-gray-200 shadow-md rounded-lg z-50`}
            >
              <div className="p-2 text-xs md:text-sm">
                {" "}
                {/* Added padding for dropdown content */}
                <h4 className="font-semibold mb-1 text-blue-500">
                  Alerts Center
                </h4>
                {bellNotifications.length > 0 ? (
                  bellNotifications.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start py-2 px-2 border-b last:border-none hover:bg-gray-100 transition" // Added padding to alert items
                    >
                      <div className="mr-2">{getAlertIcon(alert.type)}</div>
                      <div>
                        <p className="text-gray-700 font-semibold text-xs md:text-sm">
                          {" "}
                          {/* Small for mobile, normal for larger screens */}
                          {alert.alert}
                        </p>
                        <span className="text-xs md:text-sm text-gray-500">
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-600">No new alerts</div>
                )}
                <div className="text-blue-500 text-xs md:text-sm font-semibold cursor-pointer hover:underline mt-1">
                  Show All Alerts
                </div>
              </div>
            </div>
          )}
        </div>
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {" "}
          {/* Reduced spacing */}
          <span className="font-semibold text-gray-700 text-xs md:text-sm">
            {user.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs md:text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
