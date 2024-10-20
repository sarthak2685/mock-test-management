import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Sidebar from "./Sidebar/Sidebarr";
import DashboardHeader from "./DashboardHeaders";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentPerformances = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed state data (mock test info and performance)
  const { test, user: loggedInUser } = location.state || {};

  // If no test data is found, navigate back to the previous page
  useEffect(() => {
    if (!test || !loggedInUser) {
      navigate("/performances"); // Redirect if data is missing
    }
  }, [test, loggedInUser, navigate]);

  // Detect window size and update sidebar state accordingly
  const handleResize = () => {
    setIsCollapsed(window.innerWidth < 768); // Collapse sidebar on mobile
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  // Ensure the required properties are defined before accessing them
  const score = test ? test.score : 0;
  const passingScore = test ? test.passingScore : 50; // Default passing score
  const performanceData = test && test.performance ? test.performance : [];
  const subjectsData = test && test.subjects ? test.subjects : [];

  // Data for pie chart (based on test scores)
  const pieData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Test Results",
        data: [
          score >= passingScore ? 1 : 0,
          score < passingScore ? 1 : 0,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Data for line chart (monthly success rate performance)
  const lineData = {
    labels: performanceData.map((_, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: "Success Rate (%)",
        data: performanceData,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  // Data for bar chart (subject-wise performance)
  const barData = {
    labels: subjectsData.map((subject) => subject.name),
    datasets: [
      {
        label: "Score (%)",
        data: subjectsData.map((subject) => subject.score),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Main Performance Content */}
        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          {/* Header */}
          <DashboardHeader user={user || { name: "Guest" }} toggleSidebar={toggleSidebar} />

          <div className="p-2 sm:p-4 max-w-screen-lg mx-auto">
            <h2 className="text-3xl sm:text-3xl font-bold mb-2 text-center">
              Performance Overview
            </h2>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              {loggedInUser.name}'s Performance for {test.name}
            </h3>

            {/* Pie Chart */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">
                Test Results
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">
                Success Rate Trend for {test.name}
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">
                Subject-Wise Performance
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformances;
