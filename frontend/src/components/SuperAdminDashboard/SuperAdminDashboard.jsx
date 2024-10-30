import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar"; // Importing the updated Sidebar

const SuperAdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  const user = {
    name: "John Doe",
  };

  // Example data for institutes with subscription details
  const instituteData = [
    {
      id: 1,
      name: "Tech University",
      duration: "1 Year",
      subscription: "Premium",
    },
    {
      id: 2,
      name: "Green Valley College",
      duration: "6 Months",
      subscription: "Standard",
    },
    {
      id: 3,
      name: "Harbor Institute",
      duration: "2 Years",
      subscription: "Enterprise",
    },
    {
      id: 4,
      name: "Oceanic Academy",
      duration: "1 Year",
      subscription: "Standard",
    },
    {
      id: 5,
      name: "Skyline Institute",
      duration: "3 Months",
      subscription: "Basic",
    },
    {
      id: 6,
      name: "Mountainview College",
      duration: "1 Year",
      subscription: "Premium",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state
  };

  // Effect to handle sidebar visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Collapse sidebar on mobile view
      } else {
        setIsCollapsed(false); // Expand sidebar on desktop view
      }
    };

    // Set initial state based on the current window size
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar: hidden on mobile */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="hidden md:block" // Hide on mobile, show on medium screens and up
        />

        {/* Main Dashboard Content */}
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          {/* Header */}
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-3 md:p-4">
            {/* Adjusted text size for Super Admin Dashboard */}
            <h1 className="text-3xl md:text-3xl font-bold mb-6 text-left">
              Super Admin Dashboard
            </h1>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {/* Card for Total Institutes */}
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Total Institutes</h2>
                <p className="text-xl md:text-2xl font-bold">20</p>
              </div>

              {/* Card for Active Institutes */}
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Active Institutes</h2>
                <p className="text-xl md:text-2xl font-bold">5</p>
              </div>
            </div>

            {/* Institutes List Section */}
            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-2xl md:text-2xl font-semibold mb-3 text-gray-800">
                Institutes List
              </h2>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full leading-normal border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Institute Name
                      </th>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Subscription
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {instituteData.map((institute) => (
                      <tr
                        key={institute.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          institute.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-900 font-medium whitespace-no-wrap">
                            {institute.name}
                          </p>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">
                            {institute.duration}
                          </p>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-700 whitespace-no-wrap">
                            {institute.subscription}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
