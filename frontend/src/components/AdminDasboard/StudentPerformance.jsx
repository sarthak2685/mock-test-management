import React from "react";
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
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader user={user || { name: "Guest" }} />

                <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-screen-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center underline">Performance Overview</h2>
                    <h3 className="text-lg font-semibold mb-6 text-center">Details for {studentName}</h3>

                    {/* Container for Pie Chart */}
                    <div className="bg-white p-6 shadow-lg rounded-lg mb-8 w-[104%]" >
                        <h3 className="text-md font-semibold mb-2 text-center">Mock Tests Attempted</h3>
                        <div className="h-72"> {/* Adjust the height here */}
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Container for Line Chart */}
                    <div className="bg-white p-6 shadow-lg rounded-lg mb-8 w-[104%]">
                        <h3 className="text-md font-semibold mb-2 text-center">Monthly Success Rate Trend</h3>
                        <div className="h-72">
                            <Line data={lineData} options={lineOptions} />
                        </div>
                    </div>

                    {/* Container for Bar Chart */}
                    <div className="bg-white p-6 shadow-lg rounded-lg mb-8 w-[104%]">
                        <h3 className="text-md font-semibold mb-2 text-center">Subject-Wise Performance</h3>
                        <div className="h-72">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformance;
