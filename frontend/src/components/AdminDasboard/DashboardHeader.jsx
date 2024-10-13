import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiMail } from "react-icons/fi";
import {
  FaFileAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaBars,
} from "react-icons/fa"; // Import Font Awesome bar icon
import { HiBars3 } from "react-icons/hi2"; // This import is no longer needed

const DashboardHeader = ({ user, toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const mailDropdownRef = useRef(null);
  const bellDropdownRef = useRef(null);

  // Mock notification data (replace with real data)
  const mailNotifications = [
    {
      id: 1,
      message: "Hi there! I am wondering if you ...",
      sender: "Emily Fowler",
      time: "58m",
    },
    {
      id: 2,
      message: "I have the photos that you ordered ...",
      sender: "Jae Chun",
      time: "1d",
    },
    {
      id: 3,
      message: "Last month's report looks great, I ...",
      sender: "Morgan Alvarez",
      time: "2d",
    },
    {
      id: 4,
      message: "Am I a good boy? The reason I ask ...",
      sender: "Chicken the Dog",
      time: "2w",
    },
  ];

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
        return <FaFileAlt className="text-blue-500 w-6 h-6" />;
      case "deposit":
        return <FaDollarSign className="text-green-500 w-6 h-6" />;
      case "spending":
        return <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />;
      default:
        return null;
    }
  };

  // Function to generate a random avatar URL if none is provided
  const generateRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${randomId}/32`;
  };

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
        {/* Mail Icon */}
        {/* Uncomment if you want to include the mail notifications */}
        {/* <div className="relative cursor-pointer" ref={mailDropdownRef}>
          <FiMail
            className="text-gray-600 w-6 h-6"
            onClick={() => toggleDropdown("mail")}
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {mailNotifications.length}
          </span>

          {openDropdown === "mail" && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div className="p-4 text-sm">
                <h4 className="font-semibold mb-2 text-blue-500">Message Center</h4>
                {mailNotifications.length > 0 ? (
                  mailNotifications.map((mail) => (
                    <div
                      key={mail.id}
                      className="flex items-center py-2 px-3 border-b last:border-none hover:bg-gray-100 transition"
                    >
                      <img
                        src={mail.avatar || generateRandomAvatar()} // Use provided avatar or generate a random one
                        alt={mail.sender}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div className="flex-grow">
                        <p className="text-gray-700 font-semibold">{mail.sender}</p>
                        <p className="text-gray-500 text-sm">{mail.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{mail.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No new messages</div>
                )}
                <div className="text-blue-500 text-sm font-semibold cursor-pointer hover:underline mt-2">
                  Read More Messages
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* Bell Icon */}
        <div className="relative cursor-pointer" ref={bellDropdownRef}>
          <FiBell
            className="text-gray-600 w-6 h-6"
            onClick={() => toggleDropdown("bell")}
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {bellNotifications.length}
          </span>

          {openDropdown === "bell" && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div className="p-4 text-sm">
                <h4 className="font-semibold mb-2 text-blue-500">
                  Alerts Center
                </h4>
                {bellNotifications.length > 0 ? (
                  bellNotifications.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start py-2 px-3 border-b last:border-none hover:bg-gray-100 transition"
                    >
                      <div className="mr-3">{getAlertIcon(alert.type)}</div>
                      <div>
                        <p className="text-gray-700 font-semibold">
                          {alert.alert}
                        </p>
                        <span className="text-xs text-gray-500">
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No new alerts</div>
                )}
                <div className="text-blue-500 text-sm font-semibold cursor-pointer hover:underline mt-2">
                  Show All Alerts
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700">{user.name}</span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
