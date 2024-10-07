// AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import ChartComponent from './Perfomance.jsx';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          <nav>
            <ul className="space-y-4">
              <li><Link to="/students" className="hover:text-blue-400">Manage Students</Link></li>
              <li><Link to="/create-test" className="hover:text-blue-400">Create Mock Test</Link></li>
              <li><Link to="/performance" className="hover:text-blue-400">Student Performance</Link></li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Welcome, Admin</h1>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">Total Students</h3>
            <p className="text-4xl font-bold text-blue-500">120</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">Active Mock Tests</h3>
            <p className="text-4xl font-bold text-blue-500">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">Tests Taken Today</h3>
            <p className="text-4xl font-bold text-blue-500">24</p>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ChartComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
