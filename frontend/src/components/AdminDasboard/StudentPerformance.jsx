import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";

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

const StudentPerformance = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state

  // Detect window size and update sidebar state accordingly
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(false); // Show sidebar on desktop
    } else {
      setIsCollapsed(true); // Hide sidebar on mobile
    }
  };

  useEffect(() => {
    // Set initial sidebar state based on the window size
    handleResize();
    // Add resize event listener
    window.addEventListener("resize", handleResize);
    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  // Dummy students data
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

  // Get the student ID from the URL parameters
  const { id } = useParams();

  // Find the student with the given ID
  const student = students.find((student) => student.id === parseInt(id));

  // Check if student is available
  if (!student) {
    return <div>Student data not found.</div>; // Handle undefined student
  }

  // Destructure the necessary fields from student
  const {
    name: studentName = "Unknown Student",
    attemptedTests = 0,
    monthlyPerformance = [],
    subjectPerformance = [],
  } = student;

  // Calculate totalMockTests based on your logic
  const totalMockTests = 5; // Adjust based on your logic; currently set to 5

  // Data for pie chart (mock tests attempted vs not attempted)
  const pieData = {
    labels: ["Attempted Tests", "Not Attempted"],
    datasets: [
      {
        label: "Mock Tests",
        data: [attemptedTests, totalMockTests - attemptedTests],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Data for line chart (monthly success rate performance)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Success Rate (%)",
        data: monthlyPerformance,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  // Data for bar chart (subject-wise performance in the month)
  const barData = {
    labels: ["English", "Math", "GK/GS"],
    datasets: [
      {
        label: "Score (%)",
        data: subjectPerformance,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Chart options for line and bar charts
  const lineOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set maximum y-axis value to 100
      },
    },
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set maximum y-axis value to 100
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`${isCollapsed ? "hidden" : "block"} md:block`}
        />   
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

          <div className="p-2 sm:p-4 max-w-screen-lg mx-auto">
            {/* Updated headings */}
            <h2 className="text-3xl sm:text-3xl font-bold mb-2 text-center sm:text-center text-[1.6rem]">
              Performance Overview
            </h2>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Details for {studentName}
            </h3>

            {/* Container for Pie Chart */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">
                Mock Tests Attempted
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Container for Line Chart */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">
                Monthly Success Rate Trend
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Container for Bar Chart */}
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

export default StudentPerformance;
