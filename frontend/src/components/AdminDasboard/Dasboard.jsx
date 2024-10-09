import React from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars";
import { FaTrophy } from "react-icons/fa"; // Add react-icons for icons

const Dashboard = () => {
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <div className="flex-grow">
          {/* Header */}
          <DashboardHeader user={user || { name: "Guest" }} />
          <h1 className="text-3xl font-semibold mb-4 p-6">Admin Dashboard</h1>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-6">
            {/* Card for Total Students */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl">Total Students</h2>
              <p className="text-3xl font-bold">20</p>
            </div>

            {/* Card for Active Tests */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl">Active Tests</h2>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="p-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Time Taken
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((student, index) => (
                    <tr key={student.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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

                          {/* Number rank for 4th place and beyond */}
                          {index >= 3 && (
                            <span className="text-gray-600 font-bold w-6 mr-2 text-center">
                              {index + 1}
                            </span>
                          )}

                          {/* Participant name */}
                          <div className="ml-2">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {student.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {student.score}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
  );
};

export default Dashboard;
