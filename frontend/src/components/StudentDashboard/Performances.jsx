import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeaders";
import Sidebar from "./Sidebar/Sidebarr";
import config from "../../config";

const Performances = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const navigate = useNavigate(); // Hook for navigation
  const [mockTests, setMockTests] = useState([]); // State for mock tests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const id = userInfo.id;
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const institute = userInfo.institute_name;
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/student_performance_single/?student_id=${id}&institute_name=${institute}`,
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
      const domain_Score = data.analysis;

      // Process exam categories (e.g., SSC CHSL, SSC MTS, etc.)
      const processedData = Object.keys(domain_Score).map((category) => {
        const tests = domain_Score[category]?.tests || {};
        const testArray = Object.keys(tests).map((testName) => ({
          name: testName,
          rank: tests[testName]?.rank || "N/A",
          subjects: tests[testName]?.subjects || {},
        }));
        return { category, tests: testArray };
      });

      setMockTests(processedData);
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

  // Handler to navigate to the test details page
  const handleTestClick = (test, category) => {
    navigate(`/student-performances/${category}/${test.name}`, {
      state: { test, category, user: userInfo },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Main Performance Content */}
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          {/* Header */}
          <DashboardHeader
            user={user || { name: "Guest" }}
            toggleSidebar={toggleSidebar}
          />

          <div className="p-4">
            {/* Adjusted heading to 3xl and bold, left-aligned */}
            <h2 className="text-3xl md:text-3xl font-bold mb-2 text-left text-[1.6rem] sm:text-3xl">
              {userInfo?.name || ""}'s Performance
            </h2>

            {/* Mock Tests List */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-2xl font-semibold mb-4">Mock Tests</h3>
              {/* Iterate over exam categories */}
              {mockTests.map((examCategory, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-xl font-bold mb-4">
                    {examCategory.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {examCategory.tests.map((test, idx) => (
                      <div
                        key={`${examCategory.category}-${idx}`}
                        className="relative bg-gradient-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer w-44"
                        onClick={() =>
                          handleTestClick(test, examCategory.category)
                        }
                      >
                        <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {test.rank !== "N/A"
                            ? `Rank: ${test.rank}`
                            : "Unranked"}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {test.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
