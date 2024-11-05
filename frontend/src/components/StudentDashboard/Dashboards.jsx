import React, { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeaders";
import Sidebar from "./Sidebar/Sidebarr";
import { FaTrophy } from "react-icons/fa";

const timeToMinutes = (timeString) => {
  const [value, unit] = timeString.split(" ");
  return unit === "mins" ? parseInt(value, 10) : 0; // Convert time to integer minutes
};

const Dashboards = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored User Data:", storedUser);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  let leaderboardData = [
    { id: 1, name: "Self-confident Swan", score: 5, timeTaken: "12 mins" },
    { id: 2, name: "Ambitious Swan", score: 5, timeTaken: "13 mins" },
    { id: 3, name: "Impartial Duck", score: 4, timeTaken: "12 mins" },
    { id: 4, name: "Straightforward Dove", score: 4, timeTaken: "15 mins" },
    { id: 5, name: "Frank Dove", score: 3, timeTaken: "13 mins" },
    { id: 6, name: "Modest Pigeon", score: 3, timeTaken: "15 mins" },
    { id: 10, name: "John Doe", score: 4, timeTaken: "14 mins" }, // Example logged-in user's rank
    { id: 7, name: "Courageous Hawk", score: 5, timeTaken: "11 mins" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  leaderboardData = leaderboardData.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return timeToMinutes(a.timeTaken) - timeToMinutes(b.timeTaken);
  });

  // Update user's rank after sorting
  const userRank = leaderboardData.findIndex(
    (student) => student.name === user?.name // Use user?.name to avoid errors if user is null
  ) + 1;

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

          <div className="p-3 md:p-4">
            <h1 className="text-3xl md:text-3xl font-bold mb-6 text-left">
              Student Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Current Rank</h2>
                <p className="text-xl md:text-2xl font-bold">{userRank}</p>
              </div>

              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Next Test Date</h2>
                <p className="text-xl md:text-2xl font-bold">22 Oct, 2024</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-3">
              <h2 className="text-2xl md:text-2xl font-semibold mb-3 text-gray-800">
                Current Test Leaderboard
              </h2>

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
                        Time Taken
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          student.name === user?.name
                            ? "bg-yellow-100 font-bold"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
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
                                {student.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">
                            {student.score}/5
                          </p>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
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
    </div>
  );
};

export default Dashboards;
