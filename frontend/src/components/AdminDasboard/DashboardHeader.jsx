// DashboardHeader.js
import React from 'react';
import { FiLogOut } from 'react-icons/fi';

const DashboardHeader = ({ user }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">Mock Period</div>
      <div className="flex items-center">
        <span className="mr-4">{user.name}</span>
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
