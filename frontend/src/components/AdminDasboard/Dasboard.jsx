import React, { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars"; // Importing the updated Sidebar
import { FaTrophy } from "react-icons/fa"; // Icons for leaderboard

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  const user = {
    name: "John Doe",
  };

  // Example leaderboard data with marks and time taken
  const leaderboardData = [
    { id: 1, name: "Self-confident Swan", score: "5/5", timeTaken: "12 mins" },
    { id: 2, name: "Ambitious Swan", score: "5/5", timeTaken: "13 mins" },
    { id: 3, name: "Impartial Duck", score: "4/5", timeTaken: "12 mins" },
    { id: 4, name: "Straightforward Dove", score: "4/5", timeTaken: "15 mins" },
    { id: 5, name: "Frank Dove", score: "3/5", timeTaken: "13 mins" },
    { id: 6, name: "Modest Pigeon", score: "3/5", timeTaken: "15 mins" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state
  };

  // Effect to handle sidebar visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is less than 768px (Bootstrap's md breakpoint)
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
            isCollapsed ? "ml-0" : "ml-64" // Adjust margin based on collapse state
          }`}
        >
          {/* Header */}
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-6">
            <h1
              className={`text-3xl font-semibold mb-6 ${
                isCollapsed ? "text-left" : "text-left"
              }`}
            >
              Admin Dashboard
            </h1>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Card for Total Students */}
              <div
                className={`bg-white shadow-md rounded-lg p-4 ${
                  isCollapsed ? "text-left" : "text-left"
                }`}
              >
                <h2 className="text-xl">Total Students</h2>
                <p className="text-3xl font-bold">20</p>
              </div>

              {/* Card for Active Tests */}
              <div
                className={`bg-white shadow-md rounded-lg p-4 ${
                  isCollapsed ? "text-left" : "text-left"
                }`}
              >
                <h2 className="text-xl">Active Tests</h2>
                <p className="text-3xl font-bold">5</p>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div
              className={`bg-white shadow-lg rounded-lg p-6 ${
                isCollapsed ? "text-left" : "text-left"
              }`}
            >
              {/* Heading only appears in desktop view */}
              {!isCollapsed && (
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Leaderboard
                </h2>
              )}
              <table className="min-w-full leading-normal border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      {isCollapsed ? "Participants" : "Participants"}
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      {isCollapsed ? "Score" : "Score"}
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      {isCollapsed ? "Time Taken" : "Time Taken"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-gray-100 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                          {/* Trophy for 1st, 2nd, and 3rd place */}
                          {index === 0 && (
                            <FaTrophy className="text-yellow-500 w-6 h-6 mr-2" />
                          )}
                          {index === 1 && (
                            <FaTrophy className="text-gray-400 w-6 h-6 mr-2" />
                          )}
                          {index === 2 && (
                            <FaTrophy className="text-orange-500 w-6 h-6 mr-2" />
                          )}

                          {/* Rank display */}
                          {index >= 3 && (
                            <span className="text-gray-600 font-bold w-6 mr-2 text-center">
                              {index + 1}
                            </span>
                          )}

                          {/* Participant name */}
                          <div className="ml-2">
                            <p className="text-gray-900 font-medium whitespace-no-wrap">
                              {student.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 font-bold whitespace-no-wrap">
                          {student.score}
                        </p>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <p className="text-gray-700 whitespace-no-wrap">
                          {student.timeTaken}
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
  );
};

export default Dashboard;
