import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../config";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar/SideBars";

const TestTime = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [examOptions, setExamOptions] = useState([]);
  const [testOptions, setTestOptions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.token;

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch exams for dropdown
  const fetchExamTests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiUrl}/tests/exam-type/EXAM_WISE`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exam-wise test data");
      }

      const data = await response.json();
      console.log("Fetched EXAM_WISE test data:", data);
      setExams(data);

      // Format exam options for dropdown
      const uniqueExams = [...new Set(data.map(exam => exam.examName))];
      const examOptionsFormatted = uniqueExams.map(examName => ({
        value: examName,
        label: examName,
      }));

      setExamOptions(examOptionsFormatted);
    } catch (error) {
      console.error("Error fetching exam-wise test data:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  // Update test options when exam is selected
  useEffect(() => {
    if (selectedExam) {
      const testsForExam = exams.filter(exam => exam.examName === selectedExam.value);
      const testOptionsFormatted = testsForExam.map(test => ({
        value: test.id, // Using test ID as value
        label: test.testName,
        testData: test // Store full test data for later use
      }));
      setTestOptions(testOptionsFormatted);
    } else {
      setTestOptions([]);
    }
  }, [selectedExam, exams]);

  useEffect(() => {
    if (token) {
      fetchExamTests();
    }
  }, [token]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartTimeClick = () => startTimeRef.current?.showPicker?.();
  const handleEndTimeClick = () => endTimeRef.current?.showPicker?.();

  // Function to format datetime to required format: "2025-11-29T09:00:00"
  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return "";
    
    const date = new Date(datetimeString);
    
    // Get local time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTest || !startTime || !endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate time
    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("End time must be after start time");
      return;
    }

    // Format dates to required format
    const formattedStartTime = formatDateTime(startTime);
    const formattedEndTime = formatDateTime(endTime);

    const payload = {
      intituteId: S?.id,
      testId: selectedTest.value,
      starDateTime: formattedStartTime, // "2025-11-29T09:00:00"
      enDateTime: formattedEndTime      // "2025-11-29T11:00:00"
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch(`${config.apiUrl}/test-institute-timings`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to save test timing: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success("Test timing set successfully!");

      // Clear all fields
      setSelectedExam(null);
      setSelectedTest(null);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error saving test timing:", error);
      toast.error(error.message || "Failed to save test timing.");
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: "8px 4px",
      borderColor: state.isFocused ? "#4f46e5" : "#d1d5db",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(79, 70, 229, 0.2)" : "none",
      "&:hover": {
        borderColor: "#4f46e5"
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#4f46e5" : state.isFocused ? "#eef2ff" : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "10px 12px",
      "&:active": {
        backgroundColor: "#4f46e5",
        color: "white"
      }
    })
  };

  return (
    <div className="flex flex-col min-h-screen overflow-auto bg-gray-50">
      <div className="flex flex-row flex-grow">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="hidden md:block"
        />

        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

          <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-left text-gray-800">
              Test Timing Setup
            </h1>

            <div className="bg-white shadow-xl rounded-2xl p-6 max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                  {/* Exam Selection */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="exam"
                      className="text-lg font-semibold text-gray-700 mb-3 flex items-center"
                    >
                      Exam
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select
                      options={examOptions}
                      value={selectedExam}
                      onChange={setSelectedExam}
                      placeholder="Select Exam"
                      isClearable
                      isLoading={loading}
                      styles={customStyles}
                      className="mt-1"
                    />
                  </div>

                  {/* Test Selection */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="test"
                      className="text-lg font-semibold text-gray-700 mb-3 flex items-center"
                    >
                      Test
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select
                      options={testOptions}
                      value={selectedTest}
                      onChange={setSelectedTest}
                      placeholder={selectedExam ? "Select Test" : "Select exam first"}
                      isClearable
                      isDisabled={!selectedExam}
                      styles={customStyles}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                  {/* Start Time */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="startTime"
                      className="text-lg font-semibold text-gray-700 mb-3 flex items-center"
                    >
                      Start Time
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={startTimeRef}
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        onClick={handleStartTimeClick}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white transition duration-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="endTime"
                      className="text-lg font-semibold text-gray-700 mb-3 flex items-center"
                    >
                      End Time
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={endTimeRef}
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        onClick={handleEndTimeClick}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white transition duration-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Times Preview */}
                {(startTime || endTime) && (
                  <div className="p-4 bg-blue-50 rounded-lg mx-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Selected Time Range:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {startTime && (
                        <div className="flex items-center">
                          <span className="text-blue-600 font-medium">Starts:</span>
                          <span className="ml-2 text-gray-700">
                            {new Date(startTime).toLocaleString()} 
                            <br />
                            <span className="text-xs text-gray-500">
                              (Will be sent as: {formatDateTime(startTime)})
                            </span>
                          </span>
                        </div>
                      )}
                      {endTime && (
                        <div className="flex items-center">
                          <span className="text-blue-600 font-medium">Ends:</span>
                          <span className="ml-2 text-gray-700">
                            {new Date(endTime).toLocaleString()}
                            <br />
                            <span className="text-xs text-gray-500">
                              (Will be sent as: {formatDateTime(endTime)})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 mb-2 mr-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={!selectedTest || !startTime || !endTime}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-500 hover:to-indigo-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    Save Test Timing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTime;