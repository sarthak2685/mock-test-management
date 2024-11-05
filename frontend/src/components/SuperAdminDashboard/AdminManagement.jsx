import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing axios for API calls
import {
  FaUser,
  FaKey,
  FaSearch,
  FaTrash,
  FaUserPlus,
  FaPaperPlane,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar"; // Importing Sidebar
import config from "../../config";
import { FaFileCsv } from 'react-icons/fa';

const AdminManagement = ({ user }) => {
  const [admins, setAdmins] = useState([]);
  const [newAdmins, setNewAdmins] = useState([{ name: "", username: "", password: "", phone: "", email: "" }]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5);
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state
  const S = JSON.parse(localStorage.getItem("user"))
  const token = S.token; 

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/vendor-admin-crud/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log("Fetched Data:", result);
  
        // Check if result.data is an array before setting state
        if (Array.isArray(result.data)) {
          setAdmins(result.data);
        } else {
          console.error("Expected an array but received:", result.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
  
    fetchAdmins();
  }, [token]);
  
  


  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAdminChange = (index, field, value) => {
    const updatedAdmins = [...newAdmins];
    updatedAdmins[index][field] = value;
    setNewAdmins(updatedAdmins);
  };

  const handleAddAdminField = () => {
    setNewAdmins([...newAdmins, { name: "", username: "", password: "", phone: "", email: "" }]);
  };

  const handleRemoveAdminField = (index) => {
    const updatedAdmins = newAdmins.filter((_, i) => i !== index);
    setNewAdmins(updatedAdmins);
  };

  const handleSubmitAdmins = async () => {

    // Check if the token exists
    if (!token) {
        setError("Authentication token is required.");
        return;
    }

    // Check for required fields in new admins
    if (newAdmins.some(admin => !admin.name || !admin.username || !admin.password || !admin.phone || !admin.email)) {
        setError("All fields (name, username, password, phone, email) are required.");
        return;
    }

    try {
        // Prepare the POST requests
        const responses = await Promise.all(newAdmins.map(admin => {
            return axios.post(`${config.apiUrl}/vendor-admin-crud/`, {
                name: admin.name,
                mobile_no: admin.phone,
                institute_name: admin.username,
                email_id: admin.email,
                password_encoded: admin.password,
            }, {
                headers: {
                    'Authorization': `Token ${token}`, // Include the token in the header
                    'Content-Type': 'application/json',
                },
            });
        }));

        // Update state with newly added admins
        const newAdminData = responses.map((response, index) => ({
            ...newAdmins[index],
            id: admins.length + index + 1, // Generate a unique ID for each new admin
            apiResponse: response.data // Optional: Store the response from the API if needed
        }));

        // Update the admins state
        setAdmins([...admins, ...newAdminData]);
        setNewAdmins([{ name: "", username: "", password: "", phone: "", email: "" }]);
        setError("");
    } catch (error) {
        console.error("Error adding admins:", error.response ? error.response.data : error);
        setError("Failed to add admins. Please try again.");
    }
};



  const handleRemoveAdmin = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/vendor-admin-crud/${id}`); // Adjust the endpoint as needed
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin. Please try again.");
    }
  };

  const handleChangePassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      try {
        await axios.put(`${config.apiUrl}/vendor-admin-crud/${id}`, { password: newPassword });
        setAdmins(admins.map(admin => (admin.id === id ? { ...admin, password: newPassword } : admin)));
      } catch (error) {
        console.error("Error changing password:", error);
      }
    }
  };

  const filteredAdmins = (Array.isArray(admins) ? admins : []).filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + currentAdmins.map(admin => 
          `${admin.id},${admin.name},${admin.email},${admin.role}` // Example data fields
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`${isCollapsed ? "hidden" : "block"} md:block`}
        />
        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={user || { name: "Guest" }} toggleSidebar={toggleSidebar} />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Admins</h1>
            <div className="bg-white p-6 mb-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Add Admins</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {newAdmins.map((admin, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
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
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={admin.name}
                        onChange={(e) => handleAdminChange(index, "name", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Institute Name"
                        value={admin.username}
                        onChange={(e) => handleAdminChange(index, "username", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <FaKey className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={admin.password}
                        onChange={(e) => handleAdminChange(index, "password", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                    <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel" // Use 'tel' to accept digits without the increase/decrease buttons
                      placeholder="Phone Number"
                      value={admin.phone}
                      onChange={(e) => {
                        // Ensure only digits are allowed
                        if (/^\d*$/.test(e.target.value)) {
                          handleAdminChange(index, "phone", e.target.value);
                        }
                      }}
                      className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={admin.email}
                        onChange={(e) => handleAdminChange(index, "email", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <button
                  onClick={handleAddAdminField}
                  className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                >
                  <FaUserPlus className="mr-2" /> Add Another Admin
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
              <div className="overflow-x-auto md:overflow-visible">
                <table className="min-w-full text-[9px] md:text-base rounded-lg">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left rounded-tl-lg">
                        Name
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Institute Name
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
          {admin.institute_name}
        </td>
        <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
          {admin.password_encoded}
        </td>
        <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
          {admin.mobile_no} {/* Displaying phone */}
        </td>
        <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
          {admin.email_id} {/* Displaying email */}
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