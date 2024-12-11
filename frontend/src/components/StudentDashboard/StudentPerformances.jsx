import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Sidebar from "./Sidebar/Sidebarr";
import DashboardHeader from "./DashboardHeaders";
import config from "../../config";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentPerformances = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [performanceData, setPerformanceData] = useState(null); // To hold performance data
  const [loading, setLoading] = useState(true);
  const { category, testName } = useParams(); // Get exam name and test name from the URL
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem("user"))); // useState for loggedInUser
  const token = loggedInUser?.token;

  const navigate = useNavigate();

  // If no exam or test is provided, navigate away
  useEffect(() => {
    if (!category || !testName || !loggedInUser) {
      navigate("/Exam-Wise-performance");
    }
  }, [category, testName, loggedInUser, navigate]);

  // Fetch performance data for the specific test only if performanceData is not already loaded
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!performanceData) { // Check if the data is already loaded
        setLoading(true);
        try {
          const response = await fetch(`${config.apiUrl}/student_performance_single/?student=${loggedInUser.id}`, {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data);

          // Find the specific exam and test data
          if (data[category]) {
            const selectedTest = data[category]?.tests[testName];
            if (selectedTest) {
              setPerformanceData(selectedTest);
            }  else {
              console.error("Test not found for exam:", category, "and test:", testName);
            }
          }
        } catch (error) {
          console.error("Error fetching performance data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPerformanceData();
  }, [category, testName, loggedInUser, token, performanceData]); // Add performanceData as a dependency

  

  // Prepare Pie chart data for attempted vs unattempted questions
  const pieData = {
    labels: ["Attempted", "Unattempted"],
    datasets: [
      {
        label: "Question Status",
        data: [
          performanceData
            ? Object.values(performanceData.subjects).reduce((acc, curr) => acc + curr.questions_attempted, 0)
            : 0, // Total attempted questions
          performanceData
            ? Object.values(performanceData.subjects).reduce(
                (acc, curr) => acc + (curr.total_marks - curr.questions_attempted),
                0
              )
            : 0, // Total unattempted questions
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Prepare Bar chart data for marks obtained in the test
  const marksData = {
    labels: [testName], // Use test name as label for now
    datasets: [
      {
        label: "Marks Obtained",
        data: [
          performanceData
            ? Object.values(performanceData.subjects).reduce((acc, curr) => acc + curr.obtained_marks, 0)
            : 0,
        ],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Prepare the Bar chart data for subject-wise performance
  const subjectData = {
    labels: performanceData ? Object.keys(performanceData.subjects) : [],
    datasets: [
      {
        label: "Marks by Subject",
        data: performanceData
          ? Object.values(performanceData.subjects).map((item) => item.obtained_marks)
          : [],
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Adjust layout for Pie and Bar charts
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

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
            <h2 className="text-3xl sm:text-3xl font-bold mb-2 text-center">Performance Overview</h2>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              {loggedInUser.name}'s Performance for {testName}
            </h3>

            {/* Pie Chart for Attempted vs Unattempted Questions */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">Attempted vs Unattempted</h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Bar Chart for Marks Obtained */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">Marks Obtained</h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Bar data={marksData} options={chartOptions} />
              </div>
            </div>

            {/* Bar Chart for Subject-Wise Performance */}
            <div className="bg-white p-2 sm:p-4 shadow-lg rounded-lg mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-1 text-center">Subject-Wise Performance</h3>
              <div className="h-32 sm:h-40 lg:h-72 w-full sm:w-[80%] lg:w-[60%] mx-auto">
                <Bar data={subjectData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformances;
