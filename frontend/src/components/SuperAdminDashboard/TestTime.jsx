import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";

const TestTime = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // States for dropdowns and inputs
  const [domain, setDomain] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [testName, setTestName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Refs for the datetime inputs
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

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

  // Focus handlers to open datepicker immediately
  const handleStartTimeClick = () => {
    startTimeRef.current.focus();
  };

  const handleEndTimeClick = () => {
    endTimeRef.current.focus();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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

          {/* Main Content */}
          <div className="p-2 md:p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-4 text-left">
              TestTime Setup
            </h1>

            <div className="bg-white shadow-lg rounded-lg p-3">
              <form>
                {/* Row 1: Domain, Subject, Chapter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="domain"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      Domain
                    </label>
                    <select
                      id="domain"
                      name="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    >
                      <option value="">Select Domain</option>
                      <option value="domain1">Domain 1</option>
                      <option value="domain2">Domain 2</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="subject"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    >
                      <option value="">Select Subject</option>
                      <option value="subject1">Subject 1</option>
                      <option value="subject2">Subject 2</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="chapter"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      Chapter
                    </label>
                    <select
                      id="chapter"
                      name="chapter"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    >
                      <option value="">Select Chapter</option>
                      <option value="chapter1">Chapter 1</option>
                      <option value="chapter2">Chapter 2</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Test Name, Start Time, End Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="testName"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      Test Name
                    </label>
                    <select
                      id="testName"
                      name="testName"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    >
                      <option value="">Select Test Name</option>
                      <option value="test1">Test 1</option>
                      <option value="test2">Test 2</option>
                      <option value="test3">Test 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="startTime"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      Start Time
                    </label>
                    <input
                      ref={startTimeRef}
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      onClick={handleStartTimeClick} // Focus handler
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="endTime"
                      className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
                    >
                      End Time
                    </label>
                    <input
                      ref={endTimeRef}
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      onClick={handleEndTimeClick} // Focus handler
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-4 mb-4 mr-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-500 hover:to-indigo-400 transition duration-300"
                  >
                    Save Test
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
