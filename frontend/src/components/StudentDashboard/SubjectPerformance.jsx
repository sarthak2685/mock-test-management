import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeaders";
import Sidebar from "./Sidebar/Sidebarr";
import config from "../../config";

const SubjectPerformance = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const navigate = useNavigate(); // Hook for navigation
  const [mockTests, setMockTests] = useState([]); // State for mock tests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };
  const userInfo = JSON.parse(localStorage.getItem("user"))
  const id = userInfo.id;
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/student_performance_single_chapter/?student=${id}`,
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
      setMockTests(data.data.all_exam_performance || []); 
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
  console.log("User Info: ", userInfo);

  // Handler to navigate to the test details page
  const handleTestClick = (test) => {
    // Navigate to the chart page for the selected test
    navigate(`/student-performances/${test.exam_id || test.test_name}`, { state: { test, user: userInfo } });
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
              {userInfo?.name || ''}'s Performance
            </h2>

            {/* Mock Tests List */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-2xl font-semibold mb-4">Mock Tests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-gray-100 rounded-lg p-4 shadow hover:bg-gray-200 transition cursor-pointer"
                    onClick={() => handleTestClick(test)}
                  >
                    <h4 className="text-lg font-bold">{test.test_name}</h4>
                    <p>Domain Name: <span className="font-bold">{test.exam_name || "N/A"}</span></p>
                    <p>Rank: <span className="font-bold">{test.rank?.[0]?.rank || "N/A"}</span></p>
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

export default SubjectPerformance;
