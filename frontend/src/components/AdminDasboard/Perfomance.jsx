import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars";
import config from "../../config";

const Performance = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const [loading, setLoading] = useState(true);
  const institueName = user.institute_name;

  const [students, setStudents] = useState([]);

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

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/institute-statistics/?institute_name=${institueName}`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-auto">
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
              Student Performance
            </h2>

            {/* Students List with Links */}
            <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                  <tr>
                    <th className="px-4 py-2 text-base font-medium text-white uppercase tracking-wider text-center">
                      Student
                    </th>
                    <th className="px-4 py-2 text-base font-medium text-white uppercase tracking-wider text-center">
                      Tests
                    </th>
                    <th className="px-4 py-2 text-base font-medium text-white uppercase tracking-wider text-center">
                      Success
                    </th>
                    <th className="px-4 py-2 text-right text-white"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {student.student_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {student.total_tests_given}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-base text-center">
                        {student.success_percentage}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <Link
                          to={{
                            pathname: `/student-performance/${student.student_id}`,
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

export default Performance;
