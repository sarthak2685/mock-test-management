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
  const [testName, setTestName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [testOptions, setTestOptions] = useState([]);

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

  const fetchTests = async () => {
    try {
      const selectedInstituteNames = S?.institute_name;

      const queryParams = new URLSearchParams({
        student_id: "3738837e-c8bd-458d-9152-634378b01060",
        institute_name: selectedInstituteNames,
      });

      const response = await fetch(
        `${config.apiUrl}/tests_point/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student test data");
      }

      const data = await response.json();
      const uniqueTestNames = [
        ...new Set(
          data.test_names
            .filter((test) => test.for_exam__name !== null) // Ignore tests with null for_exam__name
            .map((test) => `${test.test_name} (${test.for_exam__name})`)
        ),
      ];
      

      const testOptionsFormatted = uniqueTestNames.map((name) => ({
        value: name,
        label: name,
      }));

      setTestOptions(testOptionsFormatted);
    } catch (error) {
      console.error("Error fetching student test data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTests();
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

  const handleStartTimeClick = () => startTimeRef.current.focus();
  const handleEndTimeClick = () => endTimeRef.current.focus();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      institutes: [S?.id],
      test_name: testName,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      const response = await fetch(`${config.apiUrl}/test_time/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save test: ${response.statusText}`);
      }

      toast.success("Test Time set successfully!");

      // Clear all fields
      setTestName("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("Failed to save test.");
    }
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

          <div className="p-2 md:p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-4 text-left">
              TestTime Setup
            </h1>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="testName"
                      className="text-lg font-semibold text-gray-700 mb-2"
                    >
                      Test Name
                    </label>
                    <Select
                      options={testOptions}
                      value={
                        testOptions.find(
                          (option) => option.value === testName
                        ) || null
                      }
                      onChange={(selected) =>
                        setTestName(selected?.value || "")
                      }
                      placeholder="Search and select a test"
                      isClearable
                      className="mt-1"
                      styles={{
                        control: (base) => ({
                          ...base,
                          padding: "2px",
                          borderColor: "#d1d5db",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="startTime"
                      className="text-lg font-semibold text-gray-700 mb-2"
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
                      onClick={handleStartTimeClick}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="endTime"
                      className="text-lg font-semibold text-gray-700 mb-2"
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
                      onClick={handleEndTimeClick}
                      className="mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    />
                  </div>
                </div>

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
