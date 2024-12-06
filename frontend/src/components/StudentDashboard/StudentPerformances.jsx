import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// Register the necessary components
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
  const [performanceData, setPerformanceData] = useState(null); // To hold the performance data from API
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  const { test, user: loggedInUser } = location.state || {};
  // console.log("Logged In User:", loggedInUser); 

  const currentUser = loggedInUser || JSON.parse(localStorage.getItem("user"));
  console.log("Current User:", currentUser);  

  useEffect(() => {
    if (!test || !currentUser) {
      navigate("/performances"); 
    }
  }, [test, currentUser, navigate]);


  const test_name = test.test_name;
  // console.log("k", test_name)

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.apiUrl}/student_performance_single/?student_id=${loggedInUser.id}`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        
        // Log the fetched data to check structure
        console.log("Fetched Data:", data);
  
        if (data && Array.isArray(data.data.all_exam_performance)) {
          const selectedTest = data.data.all_exam_performance.find((exam) => {
            console.log("Exam test_name:", exam.test_name, "Test Name:", test_name); // Debugging log
            return exam.test_name === test_name; // Ensure test_name exists
          });
  
          if (selectedTest) {
            setPerformanceData(selectedTest);
          } else {
            console.error("Test not found for test_name:", test_name);
          }
        } else {
          console.error("all_exam_performance is not an array or is undefined");
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPerformanceData();
  }, [test, currentUser, token]);
  
  

  // Prepare the Pie chart data for attempted vs unattempted questions
  const pieData = {
    labels: ["Attempted", "Unattempted"],
    datasets: [
      {
        label: "Question Status",
        data: [
          performanceData
            ? performanceData.performance.reduce((acc, curr) => acc + curr.attempted, 0)
            : 0, // Total attempted questions
          performanceData
            ? performanceData.performance.reduce((acc, curr) => acc + (curr.total_questions - curr.attempted), 0)
            : 0, // Total unattempted questions
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Prepare the Bar chart data for marks obtained in the test
  const marksData = {
    labels: [test_name], // Use test name as label for now
    datasets: [
      {
        label: "Marks Obtained",
        data: [performanceData ? performanceData.performance.reduce((acc, curr) => acc + curr.marks, 0) : 0],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Prepare the Bar chart data for subject-wise performance
  const subjectData = {
    labels: performanceData ? performanceData.performance.map((item) => item.question__for_exam_subjects_o__name) : [],
    datasets: [
      {
        label: "Marks by Subject",
        data: performanceData
          ? performanceData.performance.map((item) => item.marks)
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
              {loggedInUser.name}'s Performance for {test.name}
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
