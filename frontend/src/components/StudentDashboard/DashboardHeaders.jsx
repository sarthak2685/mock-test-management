import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { FaUser, FaBars } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const DashboardHeaders = ({ toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const bellDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dummy alert data
  const alerts = [
    "Mock test tomorrow: something important",
    "Your profile has been updated successfully.",
    "New mock tests have been added.",
    "Reminder: Submit your assignment by Friday.",
  ];

  // Toggle dropdowns
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {
    type: "guest",
    user: "Guest",
    name: "Guest" // Default name for guest
  };
  const userName = user.name;
  const generateAvatarColor = (userName) => {
    // Generate a color based on the user's name (or any unique property)
    const hash = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const saturation = Math.abs(hash) % 50 + 50; // Saturation between 50-100% to get vibrant colors
    const lightness = Math.abs(hash) % 30 + 40; // Lightness between 40-70% for variation but keeping it bright
    const color = `hsl(0, ${saturation}%, ${lightness}%)`;
    return color;
  };

  const avatarColor = generateAvatarColor(user.name);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        bellDropdownRef.current &&
        userDropdownRef.current &&
        !bellDropdownRef.current.contains(event.target) &&
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

  return (
    <header className="bg-white shadow-lg flex items-center justify-between p-4 relative">
      {/* Sidebar toggle button */}
      <button onClick={toggleSidebar} className="text-gray-600 lg:hidden mr-4" aria-label="Toggle Sidebar">
        <FaBars className="w-6 h-6" />
      </button>

      <div className="flex-grow" />

      <div className="flex items-center space-x-6">
        {/* Bell Icon */}
        <div className="relative cursor-pointer" ref={bellDropdownRef}>
          <FiBell className="text-gray-600 w-6 h-6" onClick={() => toggleDropdown("bell")} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {alerts.length}
          </span>
          {openDropdown === "bell" && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div className="p-4 text-sm">
                <h4 className="font-semibold mb-2 text-blue-500">Alerts Center</h4>
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="p-3 text-gray-600 border-b border-gray-200">
                      {alert}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No new alerts</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Dropdown */}
        <div className="relative cursor-pointer" ref={userDropdownRef}>
        <div className="flex items-center space-x-2" onClick={() => toggleDropdown("user")}>
      <span className="font-semibold text-gray-700">{user.name}</span>
      <div
        className="w-10 h-10 rounded-full text-white flex items-center justify-center"
        style={{ backgroundColor: avatarColor }}
      >
        {!user.image && (user.name ? user.name.charAt(0).toUpperCase() : "G")}
      </div>
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

export default DashboardHeaders;
