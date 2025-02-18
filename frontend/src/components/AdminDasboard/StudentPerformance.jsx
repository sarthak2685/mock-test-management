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
import config from "../../config";

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

const StudentPerformance = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state
  const { studentId } = useParams();
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState([]);
  const institueName = user.institute_name;
  const [student, setStudent] = useState([]);
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
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "Success Rate (%)",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  });

  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthName = monthNames[currentDate.getMonth()];

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/institute-statistics/?institute_name=${institueName}`,
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
      setTest(data);
      const matchedStudent = data.students.find(
        (student) => student.student_id === studentId
      );

      if (matchedStudent) {
        setStudent(matchedStudent);
      } else {
        setError("Student not found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchWeeklyPerformance = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/weekly-performance/?student_id=${studentId}`,
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
      console.log("Weekly Performance Data:", data);

      // Extract weekly performance and month
      const weeks = data.weekly_performance || [];
      const month = data.month || "Current Month";

      if (weeks.length === 0) {
        console.warn("No weekly performance data available.");
        setLineData({
          labels: ["No Data"],
          datasets: [
            {
              label: "Success Rate (%)",
              data: [0],
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.4,
            },
          ],
        });
        return;
      }

      // Map weeks to Week 1, Week 2, etc., and extract success rates
      const labels = weeks.map((_, index) => `Week ${index + 1}`);
      const successRates = weeks.map((week) => week.success_rate);

      setLineData({
        labels, // Week numbers as labels
        datasets: [
          {
            label: "Success Rate (%)",
            data: successRates, // Success rates as data points
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            tension: 0.4,
          },
        ],
      });

      setWeeklyPerformance(data);
    } catch (err) {
      console.error("Error fetching weekly performance:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyPerformance();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  // Check if student is available
  if (!student) {
    return <div>Student data not found.</div>; // Handle undefined student
  }

  // Data for pie chart (mock tests attempted vs not attempted)
  const pieData = {
    labels: ["Attempted Tests", "Not Attempted"],
    datasets: [
      {
        label: "Mock Tests",
        data: [
          student.total_tests_given,
          test.total_mock_tests - student.total_tests_given,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Data for line chart (monthly success rate performance)

  // Chart options for line and bar charts
  const lineOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: undefined,
      },
    },
  };

  // const barOptions = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       max: 100, // Set maximum y-axis value to 100
  //     },
  //   },
  // };

  return (
    <div className="flex flex-col min-h-screen overflow-auto">
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
              Details for {student.student_name}
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
                Monthly Success Rate Trend for {currentMonthName}
              </h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                {lineData.labels.length > 0 ? (
                  <Line data={lineData} options={lineOptions} />
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
