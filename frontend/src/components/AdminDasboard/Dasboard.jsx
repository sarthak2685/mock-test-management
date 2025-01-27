import React, { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars"; // Importing the updated Sidebar
import { FaTrophy } from "react-icons/fa"; // Icons for leaderboard
import { AiOutlineClockCircle } from "react-icons/ai"; // Icon for expiry date
import config from "../../config";
import axios from "axios";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan

  const user = JSON.parse(localStorage.getItem("user")); // Fetch user from localStorage
  const token = user.token;

  const institueName = user.institute_name;
  console.log("user", user, institueName);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/institute-statistics/?institute_name=${institueName}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
      setLeaderboard(data.leaderboard.leaderboard || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPerformanceData();
  }, []);

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

  const handleRenewClick = () => {
    setModalVisible(true); // Show modal when renewal is clicked
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan); // Set the selected plan
    setModalVisible(false); // Close the modal after selection
    alert(`Selected Plan: ${plan.name}`);
  };

  const [plans, setPlans] = useState([]);
  // const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch plans from the API
  useEffect(() => {
    if (modalVisible) {
      const fetchPlans = async () => {
        try {
          const response = await fetch(`${config.apiUrl}/licences`, {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setPlans(data); // Assuming the API response is an array of plans
        } catch (error) {
          console.error("Failed to fetch plans:", error);
        }
      };
      fetchPlans();
    }
  }, [modalVisible, config.apiUrl, token]);

  const [modalMessage, setModalMessage] = useState(""); // Added
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false); // Added
  const [isModalOpen, setIsModalOpen] = useState(false); // Added

  const handlePayment = async () => {
    try {
      // Create Razorpay order
      const { data: order } = await axios.post(
        `${config.apiUrl}/create-order/`,
        {
          amount: parseInt(selectedPlan.licence_price) * 100, // Amount in paisa
        }
      );

      const options = {
        key: "rzp_live_D3C0vsHhEkuMCH", // Replace with Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: "Subscription Payment",
        description: `Plan: ${selectedPlan.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${config.apiUrl}/verify-payment/`,
              response,
              {
                params: {
                  email: user?.email_id, // Include email as a query parameter
                },
              }
            );

            if (verifyResponse.data.status === "Payment Verified") {
              // Update the admin's plan in the backend
              const updatePlanResponse = await axios.put(
                `${config.apiUrl}/vendor-admin-crud/?id=${user.id}`,
                {
                  licence: selectedPlan.id,
                  email_id: user?.email_id || "",
                  institute_name: user?.institute_name || "",
                  mobile_no: user?.mobile_no || "",
                  name: user?.name || "",
                  password_encoded: user?.password_encoded || "",
                }
              );

              if (updatePlanResponse.status === 200) {
                setModalMessage(
                  `Payment Successful! Plan updated to ${selectedPlan.name}.`
                );
                setIsPaymentSuccess(true);
                setIsModalOpen(true); // Show the modal with success message

                // Store the updated values in localStorage
                localStorage.setItem("plan_taken", selectedPlan.name);
                localStorage.setItem("expiry", updatePlanResponse.data.expiry);

                // Close the plan selection modal and reload the page after 3 seconds
                setTimeout(() => {
                  setIsModalOpen(false);
                  setModalVisible(false); // Close the plan selection modal
                  // window.location.reload(); // Reload the page
                }, 3000);
              } else {
                throw new Error("Plan update failed");
              }
            } else {
              setModalMessage("Payment verification failed. Please try again.");
              setIsPaymentSuccess(false);
              setIsModalOpen(true); // Show the modal with failure message
            }
          } catch (error) {
            console.error("Verification error:", error);
            setModalMessage("Something went wrong during verification.");
            setIsPaymentSuccess(false);
            setIsModalOpen(true); // Show the modal with error message
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setModalMessage("Something went wrong! Please try again.");
      setIsPaymentSuccess(false);
      setIsModalOpen(true); // Show the modal with error message
    }
  };

  // Retrieving subscription plan and expiry date from localStorage
  const subscriptionPlan = localStorage.getItem("plan_taken") || "Basic Plan";
  const planExpiryDate = localStorage.getItem("expiry");
  const isPlanExpired = planExpiryDate
    ? new Date(planExpiryDate) < new Date()
    : false;

  return (
    <div className="flex flex-col min-h-screen overflow-auto">
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar: hidden on mobile */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="hidden md:block"
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
            {/* Welcome Message */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">
              Welcome {user ? user.institute_name : "Guest"}
            </h1>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {/* Card for Subscription Plan */}
              <div
                className={`shadow-md rounded-lg p-4 border-l-4 ${
                  isPlanExpired
                    ? "bg-red-100 border-red-500"
                    : "bg-green-100 border-green-500"
                }`}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Subscription Plan
                </h2>
                <p className="text-lg md:text-xl font-bold">
                  {subscriptionPlan}
                </p>
                <div className="flex items-center mt-2">
                  <AiOutlineClockCircle
                    className={`mr-2 ${
                      isPlanExpired ? "text-red-500" : "text-green-500"
                    }`}
                    size={20}
                  />
                  <p
                    className={`text-sm md:text-base ${
                      isPlanExpired ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    Expiry Date:{" "}
                    {planExpiryDate
                      ? new Date(planExpiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                {isPlanExpired && (
                  <>
                    <p className="text-red-500 mt-2 text-sm">
                      Your subscription has expired. Please renew to continue.
                    </p>
                    <button
                      onClick={handleRenewClick}
                      className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Renew Plan
                    </button>
                  </>
                )}
              </div>

              {/* Other Stats Cards */}
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Total Students</h2>
                <p className="text-xl md:text-2xl font-bold">
                  {userData.total_students}
                </p>
              </div>

              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Active Tests</h2>
                <p className="text-xl md:text-2xl font-bold">
                  {userData.total_mock_tests}
                </p>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-2xl md:text-2xl font-semibold mb-3 text-gray-800">
                Leaderboard
              </h2>
              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full leading-normal border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <div className="flex items-center">
                            {index === 0 && (
                              <FaTrophy className="text-yellow-500 w-4 h-4 md:w-5 md:h-5 mr-1" />
                            )}
                            {index === 1 && (
                              <FaTrophy className="text-gray-400 w-4 h-4 md:w-5 md:h-5 mr-1" />
                            )}
                            {index === 2 && (
                              <FaTrophy className="text-orange-500 w-4 h-4 md:w-5 md:h-5 mr-1" />
                            )}
                            {index >= 3 && (
                              <span className="text-gray-600 font-bold w-4 md:w-5 mr-1 text-center">
                                {index + 1}
                              </span>
                            )}
                            <div className="ml-2">
                              <p className="text-gray-900 font-medium whitespace-no-wrap">
                                {student.student_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">
                            {student.total_obtained}
                          </p>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-700 font-semibold whitespace-no-wrap">
                            {student.rank}
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

      {/* Modal for plan selection */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full sm:w-[900px] max-w-[90%]">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
              Select a Plan
            </h2>
            {plans.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-10">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`w-full sm:w-[280px] p-8 border-2 rounded-3xl text-center transform transition-all duration-300 ease-in-out ${
                      selectedPlan && selectedPlan.id === plan.id
                        ? "shadow-xl scale-105"
                        : "hover:shadow-lg"
                    } ${
                      plan.id % 3 === 0
                        ? "bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400"
                        : ""
                    } 
                 ${
                   plan.id % 3 === 1
                     ? "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400"
                     : ""
                 } 
                 ${
                   plan.id % 3 === 2
                     ? "bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400"
                     : ""
                 }`}
                  >
                    <p className="text-2xl font-semibold text-gray-800">
                      {plan.name}
                    </p>
                    <p className="text-lg text-gray-600 mt-3">
                      ₹{plan.licence_price}
                    </p>
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`mt-5 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedPlan && selectedPlan.id === plan.id
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {selectedPlan && selectedPlan.id === plan.id
                        ? "Selected"
                        : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">Loading plans...</p>
            )}
            <div className="mt-8 flex justify-between items-center gap-10">
              {selectedPlan && (
                <button
                  onClick={handlePayment}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 focus:outline-none transition-all duration-300"
                >
                  Pay Now
                </button>
              )}
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 focus:outline-none transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success or Error Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3
              className={`text-xl font-semibold mb-4 ${
                isPaymentSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPaymentSuccess ? "Success!" : "Error!"}
            </h3>
            <p className="text-gray-700">{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
