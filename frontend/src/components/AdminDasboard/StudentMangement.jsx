import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaKey,
  FaSearch,
  FaTrash,
  FaUserPlus,
  FaPaperPlane,
  FaFileCsv,
  FaPhone, // Import the phone icon
} from "react-icons/fa";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "../AdminDasboard/Sidebar/SideBars"; // Importing Sidebar
import config from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentManagement = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [newStudents, setNewStudents] = useState([
    { name: "", password: "", mobile_no: "", email: "" },
  ]); // Added mobile_no field
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const studentLimit = S.student_limit;
const instituteEmail = S.email; 
// const instituteId = S.institute_id;

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
        const response = await fetch(`${config.apiUrl}/users/getAllStudent/${instituteEmail}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched student data:", data);

        if (Array.isArray(data)) {
          console.log("Setting students:", data);
          setStudents(data);
        } else {
          console.warn("Fetched data is not an array:", data);
          setStudents([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students.");
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][field] = value;
    setNewStudents(updatedStudents);
  };

  // const handleAddStudentField = () => {
  //   setNewStudents([
  //     ...newStudents,
  //     { name: "", username: "", password: "", mobile_no: "" },
  //   ]); // Added mobile_no field
  // };
  const handleAddStudentField = () => {
    if (students.length + newStudents.length < studentLimit) {
      setNewStudents([
        ...newStudents,
        { name: "", password: "", mobile_no: "", email: "" },
      ]);
    } else {
      setError(`Student limit exhausted`);
    }
  };

  const handleRemoveStudentField = (index) => {
    const updatedStudents = newStudents.filter((_, i) => i !== index);
    setNewStudents(updatedStudents);
  };

  const handleSubmitStudents = async () => {
    if (!token) {
      setError("Authentication token is required.");
      return;
    }

    if (
      newStudents.some(
        (student) =>
          !student.name ||
          !student.password ||
          !student.mobile_no ||
          !student.email
      )
    ) {
      setError(
        "All fields (name, email, password, mobile_no) are required."
      );
      return;
    }

    try {
      const responses = await Promise.all(
        newStudents.map((student) =>
          axios.post(
            `${config.apiUrl}/users`,
            {
              name: student.name,
              phoneNo: student.mobile_no,
              email: student.email,
              instituteEmail: instituteEmail, 
              // instituteId: 
              password: student.password,
              role: "STUDENT",
            },
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      const newStudentData = responses.map((response, index) => {
        if (response.data.status === false) {
          setError("Number already exists.");
          return null;
        } else {
          return {
            ...newStudents[index],
            id: students.length + index + 1,
            apiResponse: response.data,
          };
        }
      });

      // Filter out null values (students that failed due to duplicate numbers)
      const validStudents = newStudentData.filter(
        (student) => student !== null
      );

      if (validStudents.length > 0) {
        setStudents([...students, ...validStudents]);
        setNewStudents([
          { name: "", email: "", password: "", mobile_no: "" },
        ]);
        setError(""); // Clear errors if at least one student was added
        toast.success("Students added successfully!", {
          position: "top-right",
          autoClose: 3000, // Closes after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
            }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Student already exists with this Number.");
        } else {
          setError(
            `Failed to add students. Error: ${
              error.response.data?.message || "Please try again."
            }`
          );
        }
      } else {
        console.error("Error adding students:", error);
        setError(
          "Failed to add students. Please check your connection and try again."
        );
      }
    }
  };

  const openPasswordModal = (student) => {
    setCurrentStudent(student);
    setNewPassword("");
    setIsModalOpen(true);
  };

  const handleRemoveStudent = async (id) => {
    try {
      // DELETE request to remove a student
      await fetch(`${config.apiUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      setStudents(students.filter((student) => student.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.", {
        position: "top-right",
        autoClose: 3000, // Closes after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
            return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/reset-password-from-dashboard/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            types: "student",
            mobile_no: currentStudent.mobile_no,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      setStudents(
        students.map((student) =>
          student.id === currentStudent.id
            ? { ...student, password: newPassword }
            : student
        )
      );

      toast.success("password updated successfully!", {
        position: "top-right",
        autoClose: 3000, // Closes after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("failed to update password.", {
        position: "top-right",
        autoClose: 3000, // Closes after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });  
      }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setNewPassword("");
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (student) =>
          (student.name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (student.email?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      )
    : [];

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Add a check to avoid out of bounds for pagination
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleExport = () => {
    // Assuming the first student has the institute_name you want to use
    const instituteName = students[0]?.institute_name || "Institute"; // Default to "Institute" if not available
    const header = "Name,Password,Mobile Number";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      "\n" +
      students
        .map(
          (student) =>
            `${student.name},${student.password_encoded},${student.mobile_no}`
        )
        .join("\n"); 
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    link.setAttribute("download", `${instituteName} student list.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
    <div className="flex flex-col min-h-screen overflow-auto">
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
          <DashboardHeader
            user={user || { name: "Guest" }}
            toggleSidebar={toggleSidebar}
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Students</h1>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error:</strong>{" "}
                <span>{error}</span>
              </div>
            )}

            {/* Add Multiple Students Form */}
            <div className="bg-white p-6 mb-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Add Students</h2>
              <p className="text-sm text-gray-500 mb-4">
                Student Limit: {studentLimit}. You can add{" "}
                {studentLimit - students.length} more student(s).
              </p>

              {newStudents.map((student, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">
                      Student {students.length + index + 1}
                    </h3>
                    <button
                      onClick={() => handleRemoveStudentField(index)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={student.name}
                      onChange={(e) =>
                        handleStudentChange(index, "name", e.target.value)
                      }
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* <input
                      type="text"
                      placeholder="Username"
                      value={student.username}
                      onChange={(e) =>
                        handleStudentChange(index, "username", e.target.value)
                      }
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <input
                      type="password"
                      placeholder="Password"
                      value={student.password}
                      onChange={(e) =>
                        handleStudentChange(index, "password", e.target.value)
                      }
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={student.email}
                      onChange={(e) =>
                        handleStudentChange(index, "email", e.target.value)
                      }
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="w-full">
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={student.mobile_no}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            handleStudentChange(index, "mobile_no", value);
                          }
                        }}
                        onBlur={() => {
                          if (student.mobile_no.length !== 10) {
                            setError("Please enter a 10-digit mobile number.");
                          } else {
                            setError("");
                          }
                        }}
                        className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <button
                  onClick={handleAddStudentField}
                  disabled={
                    students.length + newStudents.length >= studentLimit
                  }
                  className={`bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto ${
                    students.length + newStudents.length >= studentLimit
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
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
                <div className="relative flex items-center w-full md:w-auto">
                  <FaSearch className="absolute left-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 pl-8 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
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
                     <th className="px-2 py-1 md:px-4 md:py-2 text-center">
                      Email
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
                            {student.phoneNo}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-[9px] md:text-sm text-center">
                            {student.email}
                          </td>
                          <td className="px-2 py-1 md:px-4 md:py-2 text-center">
                            <button
                              onClick={() => openPasswordModal(student)}
                              className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-2 py-1 md:px-4 md:py-2 rounded-md text-[9px] md:text-sm"
                            >
                              Change
                            </button>
                          </td>
                          {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                              <div className="bg-white p-4 rounded-md w-80 shadow-lg">
                                <h2 className="text-lg font-semibold mb-4">
                                  Change Password
                                </h2>
                                <input
                                  type="password"
                                  placeholder="Enter new password"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
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
    </>
  );
};

export default StudentManagement;
