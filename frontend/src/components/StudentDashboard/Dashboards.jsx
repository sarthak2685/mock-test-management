import React, { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeaders";
import Sidebar from "./Sidebar/Sidebarr";
import { FaTrophy } from "react-icons/fa";
import config from "../../config"; // Assuming config contains the API URL

const timeToMinutes = (timeString) => {
  if (
    !timeString ||
    typeof timeString !== "string" ||
    !timeString.includes(" ")
  ) {
    return 0; // Return 0 if the input is invalid or doesn't follow the expected format
  }

  const [value, unit] = timeString.split(" ");
  return unit === "mins" ? parseInt(value, 10) : 0; // Convert time to integer minutes
};

const Dashboards = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching data
  const [existingAnnouncement, setExistingAnnouncement] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const institute = userInfo.institute_name;
  const id = userInfo.id;
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.apiUrl}/student_leader_board/?institute=${institute}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const leaderboard = data.leaderboard || [];
        const currentUser = leaderboard.find(
          (entry) => entry.student_id === id
        );
        setLeaderboardData(leaderboard);
        if (currentUser) {
          setCurrentUserRank(currentUser.rank);
        } else {
          console.warn("User not found in leaderboard.");
          setCurrentUserRank("Not Ranked");
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaderboardData();
    }
  }, [user]);

  // Sort leaderboard data by score and time taken
  const sortedLeaderboard = leaderboardData.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return timeToMinutes(a.timeTaken) - timeToMinutes(b.timeTaken);
  });

  // Update user's rank after sorting
  const userRank =
    sortedLeaderboard.findIndex((student) => student.name === user?.name) + 1;

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/exam-dates/?institute=${institute}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching announcements");
        }

        const data = await response.json();
        setExistingAnnouncement(data.time);
        setDate(data.date);
      } catch (error) {
        console.error("Error fetching announcement data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncementData();
  }, [token]);

  // Handle window resize to collapse the sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Ensure correct state on initial load
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-auto">
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
              Welcome {userInfo.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Current Rank</h2>
                <p className="text-xl md:text-2xl font-bold">
                  {currentUserRank || "Loading..."}
                </p>
              </div>

              <div className="bg-white shadow-md rounded-lg p-3">
                <h2 className="text-base md:text-lg">Next Test Date</h2>
                <div>
                  {isLoading ? (
                    <p>Loading announcement data...</p>
                  ) : (
                    <p className="text-xl md:text-2xl font-bold text-blue-800 mt-2 animate-typewriter">
                      {existingAnnouncement && new Date(date) > new Date() ? (
                        <>
                          <span className="text-gray-500">
                            {new Date(date).toLocaleDateString("en-GB")}
                          </span>{" "}
                          {existingAnnouncement}
                        </>
                      ) : (
                        "COMING SOON"
                      )}
                    </p>
                  )}
                </div>
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
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          Loading leaderboard...
                        </td>
                      </tr>
                    ) : (
                      sortedLeaderboard.map((student, index) => (
                        <tr
                          key={student.student_id}
                          className={`hover:bg-gray-100 transition-colors ${
                            student.student__name === user?.name
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
                            <p className="text-gray-900 whitespace-no-wrap">
                              {student.rank}
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
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
