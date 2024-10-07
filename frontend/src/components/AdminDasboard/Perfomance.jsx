import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Performance = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: 'Alice', testsTaken: 5, successRate: 80 },
    { id: 2, name: 'Bob', testsTaken: 3, successRate: 60 },
    // Add more student data as needed
  ];

  // Example data for the line chart
  const performanceData = {
    1: [70, 75, 80, 85, 90], // Alice's success rates over the last five months
    2: [60, 65, 55, 70, 75], // Bob's success rates over the last five months
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Success Rate',
        data: selectedStudent ? performanceData[selectedStudent.id] : [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3, // Smooth curve
      },
    ],
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Student Performance</h2>
      <ul className="space-y-2">
        {students.map((student) => (
          <li
            key={student.id}
            className="p-4 border cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300 rounded-lg"
            onClick={() => handleStudentClick(student)}
          >
            {student.name} - Tests Taken: {student.testsTaken} - Success Rate: {student.successRate}%
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Performance Details for {selectedStudent.name}</h3>
          <p>Tests Taken: {selectedStudent.testsTaken}</p>
          <p>Success Rate: {selectedStudent.successRate}%</p>
          <div className="h-64">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
