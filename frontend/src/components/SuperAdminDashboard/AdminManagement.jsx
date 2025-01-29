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
  FaCogs,
} from "react-icons/fa";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar"; // Importing Sidebar
import config from "../../config";
import { FaFileCsv } from "react-icons/fa";

const AdminManagement = ({ user }) => {
  const [admins, setAdmins] = useState([]);
  const [newAdmins, setNewAdmins] = useState([
    {
      name: "",
      username: "",
      password: "",
      phone: "",
      email: "",
      subscriptionPlan: "",
    },
  ]);
const [errors, setErrors] = useState({ phoneExists: "" });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5);
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState("");


  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  // const API_BASE_URL = "https://mockexam.pythonanywhere.com/licences";

  const fetchPlans = async () => {
    if (!token) {
      console.log("No token found, unable to fetch subscription plans.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/licences`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      // console.log("Request",result)

      if (Array.isArray(result)) {
        setSubscriptionPlans(result);
      } else {
        console.error("no plan available", result);
      }
    } catch (error) {
      console.log("Error fetching subscription plans:", error);
      if (error.response) {
        console.log("Error Response:", error.response); // Check the response error
      }
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []); // Run once when the component mounts

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/vendor-admin-crud/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
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
    const checkPhoneNumber = async () => {
      try {
        // Find the first admin with a valid 10-digit phone number
        const adminWithPhone = newAdmins.find(admin => /^[0-9]{10}$/.test(admin.phone));
  
        if (adminWithPhone) {
          const response = await axios.get(`${config.apiUrl}/check-number/`, {
            params: { phone: adminWithPhone.phone },
          });
  
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneExists: response.data.exists ? "Phone number already exists" : "",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, phoneExists: "" }));
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404 && data.message === "EXISTS") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              phoneExists: "Phone number already exists",
            }));
          }
        } else {
          console.error("Error checking phone number:", error);
        }
      }
    };
  
    checkPhoneNumber();
  }, [newAdmins]); // Dependency array should include newAdmins to watch for changes in any admin's phone number.
  
  

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
    setNewAdmins([
      ...newAdmins,
      {
        name: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        subscriptionPlan: "",
      },
    ]);
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
    if (
      newAdmins.some(
        (admin) =>
          !admin.name ||
          !admin.username ||
          !admin.password ||
          !admin.phone ||
          !admin.email ||
          !admin.subscriptionPlan
      )
    ) {
      setError(
        "All fields (name, username, password, phone, email) are required."
      );
      return;
    }

    try {
      // Prepare the POST requests
      const responses = await Promise.all(
        newAdmins.map((admin) => {
          return axios.post(
            `${config.apiUrl}/vendor-admin-crud/`,
            {
              name: admin.name,
              mobile_no: admin.phone,
              institute_name: admin.username,
              email_id: admin.email,
              password_encoded: admin.password,
              licence: admin.subscriptionPlan,
            },
            {
              headers: {
                Authorization: `Token ${token}`, // Include the token in the header
                "Content-Type": "application/json",
              },
            }
          );
        })
      );

      // Update state with newly added admins
      const newAdminData = responses.map((response, index) => ({
        ...newAdmins[index],
        id: admins.length + index + 1, // Generate a unique ID for each new admin
        apiResponse: response.data, // Optional: Store the response from the API if needed
      }));

      // Update the admins state
      setAdmins([...admins, ...newAdminData]);
      setNewAdmins([
        {
          name: "",
          username: "",
          password: "",
          phone: "",
          email: "",
          subscriptionPlan: "",
        },
      ]);
      setError("");

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error(
        "Error adding admins:",
        error.response ? error.response.data : error
      );
      setError("Failed to add admins. Please try again.");
    }
  };

  const handleRemoveAdmin = async (id) => {
    console.log("Admin ID:", id); // Add this line
    if (!id) {
      console.error("ID is undefined");
      setError("Invalid admin ID.");
      return;
    }
    try {
      await axios.delete(`${config.apiUrl}/vendor-admin-crud/?id=${id}`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAdmins(admins.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin. Please try again.");
    }
  };
  const openPasswordModal = (admin) => {
    setCurrentAdmin(admin); // Set the admin details in state
    setNewPassword(""); // Clear previous password input
    setIsModalOpen(true); // Open the modal
  };
  
  const handlePasswordChange = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }
  
    try {
      const response = await fetch(`${config.apiUrl}/reset-password-from-dashboard/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          types: "admin", // Admin type
          mobile_no: currentAdmin.mobile_no, // Mobile number from currentAdmin
          new_password: newPassword, // The new password
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }
  
      setAdmins(
        admins.map((admin) =>
          admin.id === currentAdmin.id ? { ...admin, password: newPassword } : admin
        )
      );
  
      alert("Password updated successfully.");
      closeModal();
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAdmin(null);
    setNewPassword("");
  };
  
  
  const filteredAdmins = (Array.isArray(admins) ? admins : []).filter(
    (admin) =>
      (admin.name &&
        admin.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (admin.username &&
        admin.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log("hero", subscriptionPlans);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      currentAdmins
        .map(
          (admin) => `${admin.id},${admin.name},${admin.email},${admin.role}` // Example data fields
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Admins List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  console.log("Admin", currentAdmins);

  return (
      <div className="">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`${isCollapsed ? "hidden" : "block"} md:block`}
        />
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader
            user={user || { name: "Guest" }}
            toggleSidebar={toggleSidebar}
          />
          <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-4 sm:text-xl sm:mb-3 lg:text-3xl lg:mb-5">
              Manage Admins
            </h1>
            <div className="bg-white p-3 mb-4 shadow-lg rounded-lg sm:p-2 sm:mb-3 lg:p-4 lg:mb-6">
              <h2 className="text-xl font-semibold mb-3 sm:text-lg sm:mb-2 lg:text-2xl lg:mb-4">
                Add Admins
              </h2>
              {error && (
                <p className="text-red-500 mb-3 sm:text-xs sm:mb-2 lg:text-sm lg:mb-4">
                  {error}
                </p>
              )}
              {newAdmins.map((admin, index) => (
                <div
                  key={index}
                  className="mb-3 p-3 bg-gray-50 rounded-lg shadow-md sm:mb-2 sm:p-2 lg:mb-4 lg:p-4"
                >
                  <div className="flex justify-between items-center mb-2 sm:mb-1 lg:mb-3">
                    <h3 className="text-base font-medium sm:text-sm lg:text-lg">
                      Admin {index + 1}
                    </h3>
                    <button
                      onClick={() => handleRemoveAdminField(index)}
                      className="text-red-500 hover:text-red-600 transition sm:text-xs lg:text-base"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2 sm:space-y-1 lg:space-y-2">
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={admin.name}
                        onChange={(e) =>
                          handleAdminChange(index, "name", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm"
                      />
                    </div>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
                      <input
                        type="text"
                        placeholder="Institute Name"
                        value={admin.username}
                        onChange={(e) =>
                          handleAdminChange(index, "username", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm"
                      />
                    </div>
                    <div className="relative">
  <FaPhoneAlt className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
  <input
    type="tel"
    placeholder="Phone Number"
    value={admin.phone}
    onChange={(e) => {
      if (/^\d*$/.test(e.target.value)) {
        handleAdminChange(index, "phone", e.target.value);
      }
    }}
    className={`border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 ${errors.phoneExists ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"} sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm`}
  />
  {errors.phoneExists && <p className="text-red-500 text-sm mt-1">{errors.phoneExists}</p>}
</div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={admin.email}
                        onChange={(e) =>
                          handleAdminChange(index, "email", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm"
                      />
                    </div>
                    <div className="relative">
                      <FaKey className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={admin.password}
                        onChange={(e) =>
                          handleAdminChange(index, "password", e.target.value)
                        }
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm"
                      />
                    </div>
                   
                   

                    {/* Subscription Plan Dropdown */}
                    <div className="relative">
                      <FaCogs className="absolute left-3 top-3 text-gray-400 sm:left-2 sm:top-2 sm:text-xs lg:left-3 lg:top-3 lg:text-sm" />
                      <select
                        value={admin.subscriptionPlan || ""} // Controlled input for subscriptionPlan
                        onChange={(e) =>
                          handleAdminChange(
                            index,
                            "subscriptionPlan",
                            e.target.value
                          )
                        }
                        className="border text-gray-400 p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-1 sm:pl-8 sm:mb-1 sm:text-xs lg:p-2 lg:pl-10 lg:mb-2 lg:text-sm"
                      >
                        <option value="">Select Subscription Plan</option>
                        {Array.isArray(subscriptionPlans) &&
                        subscriptionPlans.length > 0 ? (
                          subscriptionPlans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name || "Unnamed Subscription"}
                            </option>
                          ))
                        ) : (
                          <option disabled>No plans available</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 lg:gap-4">
                <button
                  onClick={handleAddAdminField}
                  className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition sm:px-2 sm:py-1 sm:text-xs lg:px-4 lg:py-2 lg:text-sm"
                >
                  <FaUserPlus className="mr-2 sm:mr-1 sm:text-xs lg:text-sm" />{" "}
                  Add Another Admin
                </button>
                <button
                  onClick={handleSubmitAdmins}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-3 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition sm:px-2 sm:py-1 sm:text-xs lg:px-4 lg:py-2 lg:text-sm w-full sm:w-auto"
                >
                  <FaPaperPlane className="inline-block mr-2 sm:mr-1 sm:text-xs lg:text-sm" />
                  Submit Admins
                </button>
              </div>
            </div>

            <div className="bg-white p-2 md:p-4 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 space-y-2 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Current Admins
                </h2>
                {/* Search Bar */}
                <div className="relative w-full md:w-auto">
  <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 pl-8 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-base"
  />
</div>

              </div>
              <div className="overflow-x-auto ">
                <table className="min-w-full text-[8px] md:text-base rounded-lg">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-left rounded-tl-lg">
                        Name
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-left">
                        Institute Name
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-left">
                        Password
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-left">
                        Phone
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-left">
                        Email
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-center">
                        Change Password
                      </th>
                      <th className="px-1 py-1 md:px-4 md:py-2 text-center rounded-tr-lg">
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
                          <td className="px-1 py-1 md:px-4 md:py-2 text-[8px] md:text-sm">
                            {admin.name}
                          </td>
                          <td className="px-1 py-1 md:px-4 md:py-2 text-[8px] md:text-sm">
                            {admin.institute_name}
                          </td>
                          <td className="px-1 py-1 md:px-4 md:py-2 text-[8px] md:text-sm">
                            {admin.password_encoded}
                          </td>
                          <td className="px-1 py-1 md:px-4 md:py-2 text-[8px] md:text-sm">
                            {admin.mobile_no}
                          </td>
                          <td className="px-1 py-1 md:px-4 md:py-2 text-[8px] md:text-sm">
                            {admin.email_id}
                          </td>
                          <td className="px-1 py-1 md:px-4 md:py-2 text-center">
  <button
    onClick={() => openPasswordModal(admin)}
    className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-2 py-1 rounded-md text-[8px] md:text-sm"
  >
    Change
  </button>
</td>


{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-md w-80 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Change Admin Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



                          <td className="px-1 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => handleRemoveAdmin(admin.id)}
                              className="text-red-600 hover:text-red-700 transition text-[8px] md:text-base"
                            >
                              <FaTrash className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-1 py-1 md:px-4 md:py-2 text-center text-[8px] md:text-sm"
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
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-[10px] md:text-base"
                >
                  <FaFileCsv className="inline-block mr-1" />
                  Export to CSV
                </button>
                <div className="flex items-center space-x-2 text-[10px] md:text-base">
                  {/* Previous button */}
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

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <React.Fragment key={pageNumber}>
                        {pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 1 ? (
                          <span
                            onClick={() => paginate(pageNumber)}
                            className={`px-1 md:px-3 py-1 md:py-2 rounded-lg w-4 md:w-8 h-4 md:h-8 flex items-center justify-center cursor-pointer ${
                              pageNumber === currentPage
                                ? "bg-[#007bbf] text-white"
                                : "bg-white text-black hover:bg-blue-600 hover:text-white"
                            } text-[8px] md:text-base`}
                          >
                            {pageNumber}
                          </span>
                        ) : pageNumber === currentPage + 2 ||
                          pageNumber === currentPage - 2 ? (
                          <span className="px-1 py-1">...</span>
                        ) : null}
                      </React.Fragment>
                    )
                  )}

                  {/* Next button */}
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
  );
};

export default AdminManagement;
