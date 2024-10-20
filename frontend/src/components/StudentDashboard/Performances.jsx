import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeaders";
import Sidebar from "./Sidebar/Sidebarr";

const Performances = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const navigate = useNavigate(); // Hook for navigation

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  // Logged-in user performance data
  const loggedInUser = {
    id: 10,
    name: user?.name || "John Doe",
    mockTests: [
      { id: 1, name: "Mock Test 1", duration: "12 mins", rank: 5, performance: [60, 70, 75] },
      { id: 2, name: "Mock Test 2", duration: "15 mins", rank: 3, performance: [80, 85, 90] },
    ],
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

  // Handler to navigate to the test details page
  const handleTestClick = (test) => {
    // Navigate to the chart page for the selected test
    navigate(`/student-performances/${test.id}`, { state: { test, user: loggedInUser } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Main Performance Content */}
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}
        >
          {/* Header */}
          <DashboardHeader user={user || { name: "Guest" }} toggleSidebar={toggleSidebar} />

          <div className="p-4">
            {/* Adjusted heading to 3xl and bold, left-aligned */}
            <h2 className="text-3xl md:text-3xl font-bold mb-2 text-left text-[1.6rem] sm:text-3xl">
              {user?.name || 'sarthak'}'s Performance
            </h2>

            {/* Mock Tests List */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-2xl font-semibold mb-4">Mock Tests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loggedInUser.mockTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-gray-100 rounded-lg p-4 shadow hover:bg-gray-200 transition cursor-pointer"
                    onClick={() => handleTestClick(test)}
                  >
                    <h4 className="text-lg font-bold">{test.name}</h4>
                    <p>Duration: {test.duration}</p>
                    <p>Rank: {test.rank}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .text-base {
            font-size: 0.875rem; /* Smaller text on mobile */
          }

          .px-4 {
            padding-left: 0.5rem; /* Less horizontal padding */
            padding-right: 0.5rem;
          }

          h2 {
            font-size: 1.6rem; /* Adjusted heading size to 1.6rem */
          }

          table {
            display: block; /* Ensure the table is block for scrolling */
            overflow-x: auto; /* Enable horizontal scrolling */
            white-space: nowrap; /* Prevent wrapping */
          }
        }
      `}</style>
    </div>
  );
};

export default Performances;
