import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaKey,
  FaSearch,
  FaTrash,
  FaUserPlus,
  FaPaperPlane,
  FaFileCsv,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar"; // Importing Sidebar

const AdminManagement = ({ user }) => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "John Doe",
      username: "john_doe",
      password: "password123",
      phone: "123-456-7890",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "jane_smith",
      password: "password456",
      phone: "987-654-3210",
      email: "jane@example.com",
    },
  ]);

  const [newAdmins, setNewAdmins] = useState([
    { name: "", username: "", password: "", phone: "", email: "" },
  ]);

  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5);
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state starts as collapsed for mobile view

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Collapse sidebar on mobile view
      } else {
        setIsCollapsed(false); // Expand sidebar on desktop view
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle admin form input changes
  const handleAdminChange = (index, field, value) => {
    const updatedAdmins = [...newAdmins];
    updatedAdmins[index][field] = value;
    setNewAdmins(updatedAdmins);
  };

  const handleAddAdminField = () => {
    setNewAdmins([
      ...newAdmins,
      { name: "", username: "", password: "", phone: "", email: "" },
    ]);
  };

  const handleRemoveAdminField = (index) => {
    const updatedAdmins = newAdmins.filter((_, i) => i !== index);
    setNewAdmins(updatedAdmins);
  };

  const handleSubmitAdmins = () => {
    if (
      newAdmins.some(
        (admin) =>
          !admin.name ||
          !admin.username ||
          !admin.password ||
          !admin.phone ||
          !admin.email
      )
    ) {
      setError(
        "All fields (name, username, password, phone, email) are required."
      );
      return;
    }

    if (
      newAdmins.some((admin) =>
        admins.some((existing) => existing.username === admin.username)
      )
    ) {
      setError("Each username must be unique.");
      return;
    }

    const newAdminsWithId = newAdmins.map((admin, index) => ({
      ...admin,
      id: admins.length + index + 1,
    }));

    setAdmins([...admins, ...newAdminsWithId]);
    setNewAdmins([
      { name: "", username: "", password: "", phone: "", email: "" },
    ]);
    setError("");
  };

  const handleRemoveAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const handleChangePassword = (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      setAdmins(
        admins.map((admin) =>
          admin.id === id ? { ...admin, password: newPassword } : admin
        )
      );
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      admins
        .map(
          (admin) =>
            `${admin.name},${admin.username},${admin.password},${admin.phone},${admin.email}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admins.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`${isCollapsed ? "hidden" : "block"} md:block`}
        />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          {/* Header with Hamburger icon for mobile view */}
          <DashboardHeader
            user={user || { name: "Guest" }}
            toggleSidebar={toggleSidebar}
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Admins</h1>

            {/* Add Multiple Admins Form */}
            <div className="bg-white p-6 mb-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Add Admins</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {newAdmins.map((admin, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Admin {index + 1}</h3>
                    <button
                      onClick={() => handleRemoveAdminField(index)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {/* Name */}
                    <div className="relative">
                      <FaUser className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={admin.name}
                        onChange={(e) =>
                          handleAdminChange(index, "name", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>

                    {/* Username / Institute */}
                    <div className="relative">
                      <FaUser className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Username/Institute Name"
                        value={admin.username}
                        onChange={(e) =>
                          handleAdminChange(index, "username", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <FaKey className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={admin.password}
                        onChange={(e) =>
                          handleAdminChange(index, "password", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={admin.phone}
                        onChange={(e) =>
                          handleAdminChange(index, "phone", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>

                    {/* Email ID */}
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={admin.email}
                        onChange={(e) =>
                          handleAdminChange(index, "email", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <button
                  onClick={handleAddAdminField}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
                >
                  <FaUserPlus className="inline-block mr-2" />
                  Add Another Admin
                </button>
                <button
                  onClick={handleSubmitAdmins}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
                >
                  <FaPaperPlane className="inline-block mr-2" />
                  Submit Admins
                </button>
              </div>
            </div>

            {/* Current Admins Card */}
            <div className="bg-white p-2 md:p-4 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 space-y-2 md:space-y-0">
                <h2 className="text-2xl font-semibold">Current Admins</h2>
                {/* Search Bar */}
                <div className="flex items-center w-full md:w-auto space-x-2">
                  <FaSearch className="mr-1 text-gray-400 hidden md:block" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-1 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Admins Table */}
              <div className="overflow-x-auto md:overflow-visible">
                <table className="min-w-full text-[9px] md:text-base rounded-lg">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left rounded-tl-lg">
                        Name
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Username
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Password {/* Now visible in mobile */}
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Phone {/* New column for phone */}
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Email {/* New column for email */}
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-center">
                        Change Password {/* Now visible in mobile */}
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-center rounded-tr-lg">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAdmins.length > 0 ? (
                      currentAdmins.map((admin, index) => (
                        <tr
                          key={admin.id}
                          className={`hover:bg-gray-100 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {admin.name}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {admin.username}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {admin.password}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {admin.phone} {/* Displaying phone */}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {admin.email} {/* Displaying email */}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => handleChangePassword(admin.id)}
                              className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-2 py-1 md:px-4 md:py-2 rounded-md text-[9px] md:text-sm"
                            >
                              Change
                            </button>
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => handleRemoveAdmin(admin.id)}
                              className="text-red-600 hover:text-red-700 transition text-[9px] md:text-base"
                            >
                              <FaTrash className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7" // Updated to 7 columns
                          className="px-2 py-1 md:px-4 md:py-2 text-center text-[9px] md:text-sm"
                        >
                          No admins found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-2 md:mt-4 space-y-2 md:space-y-0">
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-3 py-2 rounded-md text-sm md:px-3 md:py-2.5 md:text-sm" // Slightly increased height for desktop
                >
                  <FaFileCsv className="inline-block mr-1" />
                  Export to CSV
                </button>

                <div className="flex items-center space-x-2 text-xs md:text-sm">
                  {/* Previous Text */}
                  <span
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    className={`cursor-pointer text-black hover:text-[#007bbf] ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Previous
                  </span>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <React.Fragment key={pageNumber}>
                        {pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 1 ? (
                          <span
                            onClick={() => paginate(pageNumber)}
                            className={`px-2 py-1 rounded-lg w-6 md:w-8 h-6 md:h-8 flex items-center justify-center cursor-pointer ${
                              pageNumber === currentPage
                                ? "bg-[#007bbf] text-white"
                                : "bg-white text-black hover:bg-blue-600 hover:text-white"
                            }`}
                          >
                            {pageNumber}
                          </span>
                        ) : pageNumber === currentPage + 2 ||
                          pageNumber === currentPage - 2 ? (
                          <span className="px-2 py-1">...</span>
                        ) : null}
                      </React.Fragment>
                    )
                  )}

                  {/* Next Text */}
                  <span
                    onClick={() =>
                      currentPage < totalPages && paginate(currentPage + 1)
                    }
                    className={`cursor-pointer text-black hover:text-[#007bbf] ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
