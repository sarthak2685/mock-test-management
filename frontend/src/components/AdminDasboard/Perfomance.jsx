import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars";

const Performance = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  const students = [
    {
      id: 1,
      name: "Alice",
      attemptedTests: 4,
      monthlyPerformance: [60, 70, 80, 90, 85],
      subjectPerformance: [85, 75, 80], // English, Math, GK/GS
    },
    {
      id: 2,
      name: "Bob",
      attemptedTests: 3,
      monthlyPerformance: [55, 65, 70, 75, 60],
      subjectPerformance: [70, 60, 75], // English, Math, GK/GS
    },
  ];

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
            <h2 className="text-xl font-semibold mb-2">Student Performance</h2>

            {/* Students List with Links */}
            <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-base font-medium text-gray-500 uppercase tracking-wider text-center">
                      Student
                    </th>
                    <th className="px-4 py-2 text-base font-medium text-gray-500 uppercase tracking-wider text-center">
                      Tests
                    </th>
                    <th className="px-4 py-2 text-base font-medium text-gray-500 uppercase tracking-wider text-center">
                      Success
                    </th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {student.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {student.attemptedTests}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {(
                          student.monthlyPerformance.reduce((a, b) => a + b) /
                            student.monthlyPerformance.length || 0
                        ).toFixed(2)}
                        %
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <Link
                          to={{
                            pathname: `/student-performance/${student.id}`,
                            state: student, // Passing the student object
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            font-size: 1.25rem; /* Adjusting heading size */
          }
        }
      `}</style>
    </div>
  );
};

export default Performance;
