// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiUsers, FiClipboard, FiBarChart } from 'react-icons/fi';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid'; // Importing the logout icon


const Sidebar = () => {

    const handleLogout = () => {
        // Logic for logging out the user, such as clearing local storage, redirecting, etc.
        console.log('User logged out');
      };
  return (
    <aside className="bg-white text-black w-64 min-h-full p-4">
      <h2 className="text-lg font-bold mb-4">MENU</h2>
      <nav>
        <NavLink 
          to="/students" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          <FiUsers className="mr-2" /> 
          Student Management
        </NavLink>
        <NavLink 
          to="/create-test" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          <FiClipboard className="mr-2" /> 
          Mock Test Management
        </NavLink>
        <NavLink 
          to="/performance" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          <FiBarChart className="mr-2" /> 
          Performance
        </NavLink>
      </nav>
      <div className="mt-[20rem]">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> 
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
