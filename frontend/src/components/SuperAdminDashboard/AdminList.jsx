import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import axios from "axios";
import config from "../../config";

const AdminList = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [admins, setAdmins] = useState([]);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;


  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/vendor-admin-crud/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Fetched Data:", result);

        // Assuming result.data contains the list of admins with subscription info
        if (Array.isArray(result.data)) {
          setAdmins(result.data);
        } else {
          console.error("Expected an array but received:", result.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [token]);

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
    const oneWeekLater = new Date(currentDate.setDate(currentDate.getDate() + 7));
    return expiry <= oneWeekLater;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} className="hidden md:block" />

        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">Admin List</h1>

            {/* Institutes List */}
            <div className="bg-white shadow-lg rounded-lg p-3">

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
                    {admins.map((admin) => {

                      return (
                        <tr key={admin.id} className="hover:bg-gray-100 transition-colors bg-white">
                          <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-900 font-medium whitespace-no-wrap">{admin.name}</p>
                          </td>
                          <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-900 font-bold whitespace-no-wrap">
                              {admin.licence && admin.licence.licence_expiry ? admin.licence.licence_expiry : ""} Month

                            </p>
                          </td>
                          <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-700 whitespace-no-wrap">
                              {admin.licence && admin.licence.name ? admin.licence.name : "No Plan"}
                            </p>
                          </td>
                          <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
  {(() => {
    const expiryDate = admin.date_expiry; // Fetch expiry date from the API
    const today = new Date();
    const expiry = new Date(expiryDate);
    const formattedExpiryDate = expiry.toISOString().split('T')[0];

    if (expiry < today) {
      // Expired
      return (
        <div className="flex items-center space-x-2">
          <button className="bg-red-500 text-white py-2 px-4 rounded-md">Renew</button>
          <p className="text-red-500 text-xs mb-0">
            Expired on {formattedExpiryDate}.
          </p>
        </div>
      );
    } else if (isSubscriptionExpiring(expiryDate)) {
      // About to expire
      return (
        <div className="flex items-center space-x-2">
          <button className="bg-red-500 text-white py-2 px-4 rounded-md">Renew</button>
          <p className="text-red-500 text-xs mb-0">
            Subscription is expiring on {formattedExpiryDate}.
          </p>
        </div>
      );
    } else {
      // Active
      return (
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Update</button>
      );
    }
  })()}
</td>


                        </tr>
                      );
                    })}
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
