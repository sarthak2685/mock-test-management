import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";

const AdminList = () => {
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
      subscriptionEnd: "2024-11-20", // Expiring soon
    },
    {
      id: 2,
      name: "Green Valley College",
      duration: "6 Months",
      subscription: "Standard",
      subscriptionEnd: "2024-11-25", // Expiring soon
    },
    {
      id: 3,
      name: "Harbor Institute",
      duration: "2 Years",
      subscription: "Enterprise",
      subscriptionEnd: "2025-06-15", // Not expiring soon
    },
    {
      id: 4,
      name: "Sunshine Academy",
      duration: "3 Years",
      subscription: "Basic",
      subscriptionEnd: "2024-12-10", // Expiring soon
    },
    {
      id: 5,
      name: "Mountain College",
      duration: "1 Year",
      subscription: "Premium",
      subscriptionEnd: "2025-05-01", // Not expiring soon
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

  // Function to check if subscription is expiring in the next week
  const isSubscriptionExpiring = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const oneWeekLater = new Date(
      currentDate.setDate(currentDate.getDate() + 7)
    );
    console.log("Expiry:", expiry, "One Week Later:", oneWeekLater); // Log for debugging
    return expiry <= oneWeekLater;
  };

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

          <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">
              Admin List
            </h1>

            {/* Institutes List */}
            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-lg sm:text-2xl md:text-2xl font-semibold mb-3 text-gray-800">
                Institutes List
              </h2>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full leading-normal border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Institute Name
                      </th>
                      <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Test row for showing the Renew button */}
                    <tr className="hover:bg-gray-100 transition-colors bg-white">
                      <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                        <p className="text-gray-900 font-medium whitespace-no-wrap">
                          Test Institute
                        </p>
                      </td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                        <p className="text-gray-900 font-bold whitespace-no-wrap">
                          1 Year
                        </p>
                      </td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                        <p className="text-gray-700 whitespace-no-wrap">
                          Premium
                        </p>
                      </td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="bg-red-500 text-white py-2 px-4 rounded-md mb-2">
                            Renew
                          </button>
                          <p className="text-red-500 text-xs mb-0">
                            Subscription is expiring on 2024-11-20.
                          </p>
                        </div>
                      </td>
                    </tr>

                    {/* Dynamic rows for institutes */}
                    {instituteData.map((institute) => (
                      <tr
                        key={institute.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          institute.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-900 font-medium whitespace-no-wrap">
                            {institute.name}
                          </p>
                        </td>
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">
                            {institute.duration}
                          </p>
                        </td>
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-700 whitespace-no-wrap">
                            {institute.subscription}
                          </p>
                        </td>
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          {/* Conditional Button Rendering */}
                          {isSubscriptionExpiring(institute.subscriptionEnd) ? (
                            <div className="flex items-center space-x-2">
                              <button className="bg-red-500 text-white py-2 px-4 rounded-md">
                                Renew
                              </button>
                              <p className="text-red-500 text-xs">
                                Subscription is expiring on{" "}
                                {institute.subscriptionEnd}.
                              </p>
                            </div>
                          ) : (
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-md">
                              Update
                            </button>
                          )}
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

export default AdminList;
