import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaKey,
  FaSearch,
  FaTrash,
  FaUserPlus,
  FaPaperPlane,
  FaFileCsv,
  FaPhone // Import the phone icon
} from "react-icons/fa";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "../AdminDasboard/Sidebar/SideBars"; // Importing Sidebar
import config from "../../config";
import axios from "axios";

const StudentManagement = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [newStudents, setNewStudents] = useState([{ name: "", username: "", password: "", mobile_no: "" }]); // Added mobile_no field
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

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

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/admin-student-crud/`, {
          method: "GET",
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched students data:", data); // Log the fetched data

        // Ensure the data is an array before setting it to state
        if (Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          console.warn("Fetched data is not an array:", data);
          setStudents([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students.");
        setStudents([]); // Ensure students is reset to an empty array on error
      }
    };

    fetchStudents();
  }, []);

  // Handle student form input changes
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][field] = value;
    setNewStudents(updatedStudents);
  };

  const handleAddStudentField = () => {
    setNewStudents([...newStudents, { name: "", username: "", password: "", mobile_no: "" }]); // Added mobile_no field
  };

  const handleRemoveStudentField = (index) => {
    const updatedStudents = newStudents.filter((_, i) => i !== index);
    setNewStudents(updatedStudents);
  };

const handleSubmitStudents = async () => {
    // Check if the token exists
    if (!token) {
        setError("Authentication token is required.");
        return;
    }

    // Check for required fields in new students
    if (newStudents.some(student => !student.name || !student.username || !student.password || !student.mobile_no)) {
        setError("All fields (name, username, password, mobile_no) are required.");
        return;
    }

    try {
        // Prepare the POST requests
        const responses = await Promise.all(newStudents.map(student => {
            return axios.post(`${config.apiUrl}/admin-student-crud/`, {
                name: student.name,
                mobile_no: student.mobile_no,
                institute_name: "none", // Placeholder; modify if necessary
                email_id: "none", // Placeholder; modify if necessary
                password_encoded: student.password,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        }));

        // Log responses for debugging
        console.log("Responses from API:", responses);

        // Update state with newly added students
        const newStudentData = responses.map((response, index) => ({
            ...newStudents[index],
            id: students.length + index + 1, // Generate a unique ID for each new student
            apiResponse: response.data // Optional: Store the response from the API if needed
        }));

        // Update the students state
        setStudents([...students, ...newStudentData]);
        setNewStudents([{ name: "", username: "", password: "", mobile_no: "" }]); // Reset the input fields
        setError(""); // Clear any existing error message
    } catch (error) {
        // Enhanced error handling
        console.error("Error adding students:", error.response ? error.response.data : error);
        setError("Failed to add students. Please try again.");
    }
};







  const handleRemoveStudent = async (id) => {
    try {
      // DELETE request to remove a student
      await fetch(`${config.apiUrl}/admin-student-crud/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student.");
    }
  };

  const handleChangePassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      // Update student password via API
      try {
        await fetch(`${config.apiUrl}/admin-student-crud/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        });

        setStudents(
          students.map((student) =>
            student.id === id ? { ...student, password: newPassword } : student
          )
        );
      } catch (error) {
        console.error("Error updating password:", error);
        setError("Failed to update password.");
      }
    }
  };

  const filteredStudents = Array.isArray(students) 
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) 
    : [];

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Add a check to avoid out of bounds for pagination
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      students.map((student) => `${student.name},${student.username},${student.password},${student.mobile_no}`).join("\n"); // Include mobile_no in CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
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
        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={user || { name: "Guest" }} toggleSidebar={toggleSidebar} />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Students</h1>

            {/* Add Multiple Students Form */}
            <div className="bg-white p-6 mb-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Add Students</h2>
              {newStudents.map((student, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Student {index + 1}</h3>
                    <button
                      onClick={() => handleRemoveStudentField(index)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="relative">
                      <FaUser className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={student.name}
                        onChange={(e) => handleStudentChange(index, "name", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={student.username}
                        onChange={(e) => handleStudentChange(index, "username", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                    <div className="relative">
                      <FaKey className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={student.password}
                        onChange={(e) => handleStudentChange(index, "password", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                    {/* Mobile Number Input */}
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        value={student.mobile_no}
                        onChange={(e) => handleStudentChange(index, "mobile_no", e.target.value)}
                        className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
             <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <button
                  onClick={handleAddStudentField}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
                >
                  <FaUserPlus className="inline-block mr-2" />
                  Add Another Student
                </button>
                <button
                  onClick={handleSubmitStudents}
                  className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
                >
                  <FaPaperPlane className="inline-block mr-2" />
                  Submit Students
                </button>
              </div>
            </div>

            {/* Search and Export */}
            <div className="bg-white p-2 md:p-4 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 space-y-2 md:space-y-0">
                <h2 className="text-2xl font-semibold">Current Students</h2>
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

              {/* Students Table */}
              <div className="overflow-x-auto md:overflow-visible">
                <table className="min-w-full text-[9px] md:text-base rounded-lg">
                  <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white">
                    <tr>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left rounded-tl-lg">
                        Name
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Mobile Number
                      </th>
                      <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                        Password {/* Now visible in mobile */}
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
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className={`hover:bg-gray-100 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {student.name}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {student.mobile_no}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm">
                            {student.password_encoded} {/* Now visible in mobile */}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => handleChangePassword(student.id)}
                              className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-2 py-1 md:px-4 md:py-2 rounded-md text-[9px] md:text-sm"
                            >
                              Change
                            </button>
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => handleRemoveStudent(student.id)}
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
                          colSpan="5"
                          className="px-2 py-1 md:px-4 md:py-2 text-center text-[9px] md:text-sm"
                        >
                          No students found.
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

export default StudentManagement;