import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "./UserContext/UserContext";
import { FaBars } from "react-icons/fa";
import config from "../config";

function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { logout } = useUser(); // Destructure logout from the useUser context

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // Fetch user data from localStorage
    if (userData) {
      setUser(userData);
      setUserRole(userData.role); // Set user role based on type
      Cookies.set("loginToken", "true", { expires: 1 }); // Set login cookie
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login"); localStorage.removeItem("submittedData");
    localStorage.removeItem("selectedExamDuration");
    localStorage.removeItem("timerDuration");
    localStorage.removeItem("start_time");
    localStorage.removeItem("submissionResult");
    localStorage.removeItem("testDuration");
    localStorage.removeItem("end_time");
    localStorage.removeItem("selectedTestName");
    localStorage.removeItem("exam_id");
    localStorage.removeItem("selectedExamDuration");
    localStorage.removeItem("selectedTestDetails");
    localStorage.removeItem("selectedLanguage")
    localStorage.removeItem("submittedData");
    localStorage.removeItem("selectedExamDuration");
    localStorage.removeItem("timerDuration");
    localStorage.removeItem("start_time");
    localStorage.removeItem("submissionResult");
    localStorage.removeItem("testDuration");
    localStorage.removeItem("end_time");
    localStorage.removeItem("selectedTestName");
    localStorage.removeItem("exam_id");

    window.location.reload();
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

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
            {/* Only show Contact link if the user is not logged in */}
            {!user && (
              <Link
                to="/contact"
                className="hover:text-[#007bff] px-3 py-2 text-xl font-medium"
              >
                Contact
              </Link>
            )}
            {user ? (
              <div className="relative">
                <div
                  className="cursor-pointer flex items-center space-x-2"
                  onClick={toggleProfileMenu}
                >
                  {user.pic &&
                  user.pic !==
                    "/media/uploads/questions/option_4_uFtm5qj.png" ? (
                    <img
                      src={`${config.apiUrl}${user.pic}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#007bff] flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : ""}
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
                      onClick={() => {
                        handleLogout();
                        setProfileMenuOpen(false);
                      }}
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
              className="text-gray-400 hover:text-[#007bff] focus:outline-none"
              onClick={toggleMenu}
            >
              <FaBars className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-white shadow-md border-b border-gray-200 ${menuOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col items-center px-2 py-2 space-y-2">
          {/* Only show Contact link if the user is not logged in */}
          {!user && (
            <Link
              to="/contact"
              className="block rounded-md text-base font-medium hover:bg-[#007bff] text-center"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          )}

          {user ? (
            <div className="relative">
              <div
                className="flex items-center rounded-md text-base font-medium cursor-pointer"
                onClick={toggleProfileMenu}
              >
                {user.pic &&
                user.pic !== "/media/uploads/questions/option_4_uFtm5qj.png" ? (
                  <img
                    src={`${config.apiUrl}${user.pic}`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#007bff] flex items-center justify-center text-white font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : ""}
                  </div>
                )}
                <span className="ml-2">{user.name}</span>
              </div>
              {profileMenuOpen && (
                <div className="mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <Link
                    to="/student-dashboard"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
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
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#007bff] text-white hover:bg-blue-700 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
