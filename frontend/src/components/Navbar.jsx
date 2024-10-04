import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-[#FCFCFC] text-black shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="flex justify-between h-16">
         
          <div className="flex items-center">
          <Link to="/">
            <span className="text-2xl  hover:text-[#007bff]">Mock <strong className='text-[#007bff]'>Period</strong></span>
            </Link>
          </div>
        
          <div className="hidden md:flex items-center space-x-9">
            <Link
              to="/contact"
              className="hover:text-[#007bff] px-3 py-2  text-xl font-medium"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="bg-[#007bff] hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xl font-medium"
            >
              Login
            </Link>
          </div>
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/contact"
              className="hover:bg-[#007bff] block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="bg-[#007bff] hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
