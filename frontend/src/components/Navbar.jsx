import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    if (userData) {
      setUser(userData);
      Cookies.set('loginToken', 'true', { expires: 1 }); // Sets a login cookie
    }
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('loginToken'); // Clear login cookies
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-[#FCFCFC] text-black shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <span className="text-2xl hover:text-[#007bff]">
                Mock <strong className="text-[#007bff]">Period</strong>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-9">
            <Link to="/contact" className="hover:text-[#007bff] px-3 py-2 text-xl font-medium">
              Contact
            </Link>

            {user && user.type === 'student' ? (
              <div className="relative">
                <div
                  className="cursor-pointer flex items-center space-x-2"
                  onClick={toggleProfileMenu}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#007bff] flex items-center justify-center text-white font-semibold">
                      {user.user ? user.user.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                </div>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <Link
                      to="/student-dashboard"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setProfileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#007bff] hover:bg-blue-700 text-white px-6 py-2 rounded-md text-xl font-medium"
              >
                Login
              </Link>
            )}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 max-w-40 mx-auto">
          <Link
            to="/contact"
            className="hover:bg-[#007bff] block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {user && user.role === 'student' ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                onClick={toggleProfileMenu}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#007bff] flex items-center justify-center text-white font-semibold">
                    {user.user ? user.user.charAt(0).toUpperCase() : ''}
                  </div>
                )}
                <span>{user.user}</span>
              </div>

              {profileMenuOpen && (
                <div className="mt-2 w-full max-w-[150px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <Link
                    to="/student-dashboard"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => { setProfileMenuOpen(false); setMobileMenuOpen(false); }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#007bff] hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
