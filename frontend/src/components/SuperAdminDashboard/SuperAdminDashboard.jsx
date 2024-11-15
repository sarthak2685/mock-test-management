import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import config from "../../config";

const SuperAdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [activeInstitutes, setActiveInstitutes] = useState(0);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.token;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);
  console.log("user", user)


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

        if (Array.isArray(result.data)) {
          setAdmins(result.data);
          setTotalInstitutes(result.data.length);
          setActiveInstitutes(result.data.filter((admin) => admin.licence && admin.licence !== "No Plan").length);
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
      setIsCollapsed(window.innerWidth < 768);
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
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} className="hidden md:block" />

        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left"> Welcome {user ? user.user : "Guest"}</h1>

            {/* Info Cards - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-xs sm:text-lg md:text-base">Total Institutes</h2>
                <p className="text-sm sm:text-xl md:text-2xl font-bold">{totalInstitutes}</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-xs sm:text-lg md:text-base">Active Institutes</h2>
                <p className="text-sm sm:text-xl md:text-2xl font-bold">{activeInstitutes}</p>
              </div>
            </div>

            {/* Institutes List */}
            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-lg sm:text-2xl md:text-2xl font-semibold mb-3 text-gray-800">Institutes List</h2>

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
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-100 transition-colors bg-white">
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-900 font-medium whitespace-no-wrap">{admin.name}</p>
                        </td>
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">{admin.duration || "30 Days"}</p>
                        </td>
                        <td className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                          <p className="text-gray-700 whitespace-no-wrap">
                            {admin.licence || "No Plan"}
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
