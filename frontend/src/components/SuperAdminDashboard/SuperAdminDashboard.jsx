import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";

const SuperAdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    console.log("Stored User Data:", storedUser); // Log stored data

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Parse the stored user data
      setUser(parsedUser); // Set the user state
    }
  }, []);

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
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="hidden md:block"
        />

        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-3xl font-bold mb-6 text-left">
              Super Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Total Institutes</h2>
                <p className="text-xl md:text-2xl font-bold">20</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Active Institutes</h2>
                <p className="text-xl md:text-2xl font-bold">5</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-2xl md:text-2xl font-semibold mb-3 text-gray-800">
                Institutes List
              </h2>

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
