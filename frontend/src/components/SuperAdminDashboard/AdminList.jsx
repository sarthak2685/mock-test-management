import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import axios from "axios";
import config from "../../config";
import { FaTimes, FaRegSave } from "react-icons/fa";
import {
  MdSubscriptions,
  MdCreditCard,
  MdError,
  MdCheckCircle,
  MdInfo,
} from "react-icons/md";

const AdminList = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For modal data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState("");
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/users/role/ADMIN`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        if (Array.isArray(result)) {
          setAdmins(result);
        } else {
          console.error("Expected an array but received:", result);
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

  const openModal = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(false);
  };

  const isSubscriptionExpiring = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const oneWeekLater = new Date(
      currentDate.setDate(currentDate.getDate() + 7)
    );
    return expiry <= oneWeekLater;
  };

  // Save Changes Function
  const saveChanges = async (fetchAdmins) => {
    if (!selectedAdmin || !selectedSubscriptionPlan) {
      alert("Please select both admin and subscription plan");
      return;
    }

    // Prepare the payload with proper validation
    const payload = {
      email_id: selectedAdmin?.email_id || "",
      institute_name: selectedAdmin?.institute_name || "",
      licence: selectedSubscriptionPlan,
      mobile_no: selectedAdmin?.mobile_no || "",
      name: selectedAdmin?.name || "",
      password_encoded: selectedAdmin?.password_encoded || "",
    };

    // Validate fields
    const validationErrors = {};
    Object.keys(payload).forEach((key) => {
      if (!payload[key]) {
        validationErrors[key] = ["This field is required."];
      }
    });

    // Show validation errors
    if (Object.keys(validationErrors).length > 0) {
      alert(`Validation Errors: ${JSON.stringify(validationErrors, null, 2)}`);
      return;
    }

    try {
      const response = await axios.put(
        `${config.apiUrl}/vendor-admin-crud/?id=${selectedAdmin.id}`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Subscription plan updated successfully!");
        closeModal();

        // Ensure fetchAdmins is passed correctly
        if (typeof fetchAdmins === "function") {
          fetchAdmins(); // Call the fetchAdmins function if it exists
        } else {
          console.error("fetchAdmins is not a function");
        }
        window.location.reload();
      } else {
        console.error("Failed to update subscription plan:", response.data);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("There was an error saving the changes. Please try again later.");
    }
  };

  // const API_BASE_URL = "https://mockexam.pythonanywhere.com/licences";

  const fetchPlans = async () => {
    if (!token) {
      console.log("No token found, unable to fetch subscription plans.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/licences`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (Array.isArray(result)) {
        setSubscriptionPlans(result);
      } else {
        console.error("no plan available", result);
      }
    } catch (error) {
      console.log("Error fetching subscription plans:", error);
      if (error.response) {
        console.log("Error Response:", error.response); // Check the response error
      }
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []); // Run once when the component mounts

  return (
    <div className="">
      <div className="">
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
            <h1 className="text-xl md:text-3xl font-bold mb-4 text-left">
              Admin List
            </h1>

            <div className="bg-white shadow-lg rounded-lg p-3">
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full leading-normal border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                        Institute Name
                      </th>
                      <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => {
                      const isExpired =
                        new Date(admin.date_expiry) < new Date(); // Check if expired
                      return (
                        <tr
                          key={admin.id}
                          className="hover:bg-gray-100 transition-colors bg-white"
                        >
                          <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-900 font-medium whitespace-no-wrap">
                              {admin.name}
                            </p>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-900 font-medium whitespace-no-wrap">
                              {admin.instituteName}
                            </p>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <p className="text-gray-900 font-bold whitespace-no-wrap">
                              {admin.plans && admin.plans
                                ? `${admin.plans} Month`
                                : ""}
                            </p>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            <div className="flex items-center">
                              <p
                                className={`text-xs sm:text-sm font-semibold ${
                                  isExpired ? "text-red-500" : "text-green-500"
                                } whitespace-no-wrap`}
                              >
                                {admin.plans && admin.plans
                                  ? `${admin.plans}`
                                  : "No Plan"}
                              </p>
                              <span
                                className={`ml-2 text-xs font-medium ${
                                  isExpired ? "text-red-500" : "text-green-500"
                                }`}
                              >
                                {isExpired
                                  ? "(Expired)"
                                  : `- Active until ${new Date(
                                      admin.date_expiry
                                    ).toLocaleDateString()}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-3 border-b border-gray-200 text-xs sm:text-sm md:text-sm">
                            {/* Conditional Button for Update/Renew */}
                            <button
                              className={`${
                                isExpired ? "bg-red-500" : "bg-blue-500"
                              } text-white py-1 sm:py-2 px-2 sm:px-4 rounded-md transition duration-300`}
                              onClick={() => openModal(admin)}
                            >
                              {isExpired ? "Renew" : "Update"}
                            </button>
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
      {isModalOpen && selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md px-2 sm:px-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-2xl relative overflow-hidden transform transition-all duration-300 sm:rounded-2xl">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center focus:outline-none bg-gray-100 hover:bg-gray-200 shadow-md"
              onClick={closeModal}
              title="Close Modal"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Modal Title */}
            <h2 className="text-xl  font-bold mb-4 text-center text-blue-700 tracking-tight sm:text-3xl">
              <MdSubscriptions className="inline-block mr-2 text-lg sm:text-2xl" />
              Update Subscription
            </h2>

            {/* Grid for Institute and Expiry Sections */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mb-6">
              {/* Institute Name Card */}
              <div className="p-3 sm:p-4 border rounded-md shadow bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-1">
                  Institute Name
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedAdmin.name}
                </p>
              </div>

              {/* Subscription Expiry Card */}
              <div className="p-3 sm:p-4 border rounded-md shadow bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm sm:text-base font-medium text-gray-600">
                    Subscription Expiry
                  </h3>
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      new Date(selectedAdmin.date_expiry) < new Date()
                        ? "bg-red-400 text-white"
                        : "bg-green-400 text-white"
                    }`}
                  >
                    {new Date(selectedAdmin.date_expiry) < new Date() ? (
                      <MdError className="mr-1 text-sm" />
                    ) : (
                      <MdCheckCircle className="mr-1 text-sm" />
                    )}
                    {new Date(selectedAdmin.date_expiry) < new Date()
                      ? "Expired"
                      : "Active"}
                  </div>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {new Date(selectedAdmin.date_expiry).toLocaleDateString()}
                </p>

                {/* Days Remaining with Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm sm:text-base font-medium text-gray-700">
                      Days Remaining:
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                      {Math.max(
                        0,
                        Math.floor(
                          (new Date(selectedAdmin.date_expiry) - new Date()) /
                            (1000 * 3600 * 24)
                        )
                      )}
                    </p>
                    <span className="text-xs sm:text-sm text-gray-600">
                      days
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        new Date(selectedAdmin.date_expiry) < new Date()
                          ? "bg-red-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          Math.max(
                            0,
                            (new Date(selectedAdmin.date_expiry) - new Date()) /
                              (1000 * 3600 * 24)
                          ) / 3.65
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mb-4 px-3 sm:px-4 py-3 border rounded-md bg-gray-50 shadow-sm">
              {new Date(selectedAdmin.date_expiry) < new Date() ? (
                <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                  <MdError className="text-red-500 mr-2" />
                  Your subscription expired on{" "}
                  <span className="font-medium text-gray-800 ml-1">
                    {new Date(selectedAdmin.date_expiry).toLocaleDateString()}
                  </span>
                  . Renew now to avoid interruptions.
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                  <MdInfo className="text-blue-500 mr-2" />
                  Your subscription is active. Ensure to renew before{" "}
                  <span className="font-medium text-gray-800 ml-1">
                    {new Date(selectedAdmin.date_expiry).toLocaleDateString()}
                  </span>
                  .
                </p>
              )}
            </div>

            {/* Subscription Plan Section */}
            <div className="mb-4 p-3 sm:p-4 border rounded-md shadow bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2">
                Subscription Plan
              </h3>
              <div className="relative">
                <select
                  value={selectedSubscriptionPlan || ""}
                  onChange={(e) => setSelectedSubscriptionPlan(e.target.value)}
                  className="border border-gray-300 py-2 px-3 pl-10 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="" disabled>
                    Select Subscription Plan
                  </option>
                  {Array.isArray(subscriptionPlans) &&
                  subscriptionPlans.length > 0 ? (
                    subscriptionPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name || "Unnamed Subscription"}
                      </option>
                    ))
                  ) : (
                    <option disabled>No plans available</option>
                  )}
                </select>
                <MdCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 font-medium flex items-center"
                onClick={saveChanges}
              >
                <FaRegSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
