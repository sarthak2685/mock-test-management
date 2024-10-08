import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { FiUsers, FiClipboard, FiBarChart } from 'react-icons/fi';
import { HomeIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid'; // Import the dashboard and logout icons


const Sidebar = () => {
    const location = useLocation();

    const handleLogout = () => {
        // Logic for logging out the user, such as clearing local storage, redirecting, etc.
        console.log('User logged out');
      };
  return (
    <aside className="bg-white text-black w-64 min-h-full p-4">
        <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700 text-blue-500' : 'text-black'}`
              }
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-2">
                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
              </svg>             
               <h2 className="text-lg font-bold">Dashboard</h2>
            </NavLink>
      <nav>
        <NavLink 
          to="/students" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          <FiUsers className="mr-2" /> 
          Student Management
        </NavLink>
        <NavLink 
          to="/create-test" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          <FiClipboard className="mr-2" /> 
          Mock Test Management
        </NavLink>
        <NavLink 
          to="/performance" 
          className={({ isActive }) => 
            `flex items-center py-2 px-4 mt-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
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
