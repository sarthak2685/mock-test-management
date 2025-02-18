import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaClipboardList, FaBook } from "react-icons/fa";
import config from "../../config";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";

function TestDetail() {
  const [testGroups, setTestGroups] = useState({}); // Exam Tests
  const [subjectTestGroups, setSubjectTestGroups] = useState({}); // Subject Tests
  const S = JSON.parse(localStorage.getItem("user"));
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const user = S.name;
  const token = S?.token;

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

  // Fetch Exam Tests
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

      // Group tests by `for_exam__name`
      const groupedTests = data.test_names
        .filter((test) => test.for_exam__name !== null) // Ignore null exams
        .reduce((acc, test) => {
          if (!acc[test.for_exam__name]) {
            acc[test.for_exam__name] = [];
          }
          acc[test.for_exam__name].push(test.test_name);
          return acc;
        }, {});

      setTestGroups(groupedTests);
    } catch (error) {
      console.error("Error fetching student test data:", error);
    }
  };

  // Fetch Subject Tests
  const fetchSubjectTest = async () => {
    try {
      const selectedInstituteNames = S?.institute_name;
      const queryParams = new URLSearchParams({
        institute_name: selectedInstituteNames,
      });

      const response = await fetch(
        `${config.apiUrl}/get-test-by-subject-name/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subject test data");
      }

      const data = await response.json();

      // Transform data into { subject: [test1, test2, ...] }
      const groupedSubjects = data.reduce((acc, subjectObj) => {
        const [subject, tests] = Object.entries(subjectObj)[0];
        acc[subject] = [...new Set(tests)]; // Remove duplicate test names
        return acc;
      }, {});

      setSubjectTestGroups(groupedSubjects);
    } catch (error) {
      console.error("Error fetching subject test data:", error);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchSubjectTest();
  }, []);

  return (
    <>
        <div className="flex flex-col min-h-screen overflow-auto bg-gray-50">

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

        <div className="test-container ">
          {/* Exam-based Tests */}
          <h2 className="test-title">Available Tests by Exam</h2>
          <div className="test-grid">
            {Object.entries(testGroups).map(([exam, tests]) => (
              <div key={exam} className="test-card">
                <h3 className="exam-title">
                  <FaGraduationCap className="icon" /> {exam}
                </h3>
                <ul className="test-list">
                  {tests.map((test, index) => (
                    <li key={index} className="test-item">
                      <FaClipboardList className="icon test-icon" /> {test}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subject-based Tests */}
          <h2 className="test-title mt-4">Available Tests by Subject</h2>
          <div className="test-grid">
            {Object.entries(subjectTestGroups).map(([subject, tests]) => (
              <div key={subject} className="test-card">
                <h3 className="exam-title">
                  <FaBook className="icon" /> {subject}
                </h3>
                <ul className="test-list">
                  {tests.map((test, index) => (
                    <li key={index} className="test-item">
                      <FaClipboardList className="icon test-icon" /> {test}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* CSS Styling */}
      <style>
        {`
          .test-container {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }

          .test-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #343a40;
            text-align: center;
          }

          .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .test-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .test-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .exam-title {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
          }

          .test-list {
            list-style: none;
            padding: 0;
          }

          .test-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            color: #495057;
            padding: 5px 0;
            border-bottom: 1px solid #e9ecef;
            transition: color 0.2s;
          }

          .test-item:hover {
            color: #007bff;
          }

          .icon {
            color: #007bff;
          }

          .test-icon {
            color: #28a745;
          }

          @media (max-width: 768px) {
            .test-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
          }
        `}
      </style>
    </>
  );
}

export default TestDetail;
