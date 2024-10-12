import React, { useState } from "react";
import {
  FaUser,
  FaKey,
  FaSearch,
  FaTrash,
  FaUserPlus,
  FaPaperPlane,
  FaFileCsv,
} from "react-icons/fa";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "../AdminDasboard/Sidebar/SideBars";

const StudentManagement = ({ user }) => {
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", username: "john_doe", password: "password123" },
    {
      id: 2,
      name: "Jane Smith",
      username: "jane_smith",
      password: "password456",
    },
    // Add more students as needed
  ]);

  const [newStudents, setNewStudents] = useState([
    { name: "", username: "", password: "" },
  ]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5); // Set number of students per page
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar collapse state

  // Handle student changes
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][field] = value;
    setNewStudents(updatedStudents);
  };

  // Handle adding/removing student fields
  const handleAddStudentField = () => {
    setNewStudents([...newStudents, { name: "", username: "", password: "" }]);
  };

  const handleRemoveStudentField = (index) => {
    const updatedStudents = newStudents.filter((_, i) => i !== index);
    setNewStudents(updatedStudents);
  };

  // Submit new students
  const handleSubmitStudents = () => {
    if (
      newStudents.some(
        (student) => !student.name || !student.username || !student.password
      )
    ) {
      setError("All fields are required for each student.");
      return;
    }

    if (
      newStudents.some((student) =>
        students.some((existing) => existing.username === student.username)
      )
    ) {
      setError("Each username must be unique.");
      return;
    }

    const newStudentsWithId = newStudents.map((student, index) => ({
      ...student,
      id: students.length + index + 1,
    }));

    setStudents([...students, ...newStudentsWithId]);
    setNewStudents([{ name: "", username: "", password: "" }]);
    setError("");
  };

  // Remove student
  const handleRemoveStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Change password
  const handleChangePassword = (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      setStudents(
        students.map((student) =>
          student.id === id ? { ...student, password: newPassword } : student
        )
      );
    }
  };

  // Search functionality
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Export to CSV
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      students
        .map(
          (student) => `${student.name},${student.username},${student.password}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <DashboardHeader user={user || { name: "Guest" }} />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Manage Students</h1>

          {/* Add Multiple Students Form */}
          <div className="bg-white p-6 mb-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Add Students</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {newStudents.map((student, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md"
              >
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
                      onChange={(e) =>
                        handleStudentChange(index, "name", e.target.value)
                      }
                      className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={student.username}
                      onChange={(e) =>
                        handleStudentChange(index, "username", e.target.value)
                      }
                      className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <FaKey className="absolute left-3 top-2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={student.password}
                      onChange={(e) =>
                        handleStudentChange(index, "password", e.target.value)
                      }
                      className="border p-2 pl-10 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Current Students Card */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Current Students</h2>

              {/* Search Bar (aligned to right) */}
              <div className="flex items-center">
                <FaSearch className="mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Students Table */}
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto">
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left rounded-tl-lg">
                    Name
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Username
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Password
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center">
                    Change Password
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center rounded-tr-lg">
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
                      <td className="border-b border-gray-300 px-4 py-2">
                        {student.name}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {student.username}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {student.password}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleChangePassword(student.id)}
                          className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
                        >
                          Change Password
                        </button>
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="border-b border-gray-300 px-4 py-2 text-center"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white px-4 py-2 rounded-md hover:bg-[#0056b3] hover:to-[#004080] transition text-sm w-full sm:w-auto"
              >
                <FaFileCsv className="inline-block mr-2" />
                Export to CSV
              </button>

              <div className="flex items-center space-x-4 my-4">
                {/* Previous Text */}
                <span
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  className={`cursor-pointer text-black hover:text-[#007bbf] ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
                  } transition`}
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
                          className={`px-3 py-1 border border-gray-300 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer ${
                            pageNumber === currentPage
                              ? "bg-[#007bbf] text-white"
                              : "bg-white text-black hover:bg-blue-600 hover:text-white transition"
                          }`}
                        >
                          {pageNumber}
                        </span>
                      ) : pageNumber === currentPage + 2 ||
                        pageNumber === currentPage - 2 ? (
                        <span className="px-3 py-1">...</span>
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
                  } transition`}
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

export default StudentManagement;
