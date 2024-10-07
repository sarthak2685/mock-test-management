// Dashboard.js
import React from 'react';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar/SideBars';
import Performance from './Perfomance'; // Adjust as per your structure
import StudentManagement from './StudentMangement'; // Example component
import MockTestManagement from './MockTest'; // Example component

const Dashboard = () => {
  const user = {
    name: 'John Doe',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <DashboardHeader user={user} />

      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <div className="flex-grow p-6">
          <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Card for Total Students */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl">Total Students</h2>
              <p className="text-3xl font-bold">20</p>
            </div>
            {/* Card for Active Tests */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl">Active Tests</h2>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
