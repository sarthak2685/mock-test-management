import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaClipboardList, FaBook } from "react-icons/fa";
import config from "../../config";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";

function TestDetail() {
  const [examTests, setExamTests] = useState([]); // EXAM_WISE tests
  const [subjectTests, setSubjectTests] = useState([]); // SUBJECT_WISE tests
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

  // Fetch EXAM_WISE tests
  const fetchExamTests = async () => {
    try {
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
      setExamTests(data);
    } catch (error) {
      console.error("Error fetching exam-wise test data:", error);
    }
  };

  // Fetch SUBJECT_WISE tests
  const fetchSubjectTests = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/tests/exam-type/SUBJECT_WISE`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subject-wise test data");
      }

      const data = await response.json();
      console.log("Fetched SUBJECT_WISE test data:", data);
      setSubjectTests(data);
    } catch (error) {
      console.error("Error fetching subject-wise test data:", error);
    }
  };

  useEffect(() => {
    fetchExamTests();
    fetchSubjectTests();
  }, []);

  // Group exam tests by exam name
  const groupExamTests = () => {
    const grouped = {};
    examTests.forEach(test => {
      const examName = test.examName || 'Unknown Exam';
      if (!grouped[examName]) {
        grouped[examName] = [];
      }
      grouped[examName].push(test);
    });
    return grouped;
  };

  // Group subject tests by subject name
  const groupSubjectTests = () => {
    const grouped = {};
    subjectTests.forEach(test => {
      const subjectName = test.subjectName || 'Unknown Subject';
      if (!grouped[subjectName]) {
        grouped[subjectName] = [];
      }
      grouped[subjectName].push(test);
    });
    return grouped;
  };

  const examTestGroups = groupExamTests();
  const subjectTestGroups = groupSubjectTests();

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

          <div className="test-container">
            {/* Exam-based Tests */}
            <h2 className="test-title">Available Tests by Exam (EXAM_WISE)</h2>
            <div className="test-grid">
              {Object.entries(examTestGroups).map(([exam, tests]) => (
                <div key={exam} className="test-card">
                  <h3 className="exam-title">
                    <FaGraduationCap className="icon" /> {exam}
                  </h3>
                  <ul className="test-list">
                    {tests.map((test, index) => (
                      <li key={test.id} className="test-item">
                        <FaClipboardList className="icon test-icon" /> 
                        {test.testName}
                        {/* <span className="test-meta">
                          ({test.language?.join(', ')} - {test.durationMinutes} mins)
                        </span> */}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Subject-based Tests */}
            <h2 className="test-title mt-8">Available Tests by Subject (SUBJECT_WISE)</h2>
            <div className="test-grid">
              {Object.entries(subjectTestGroups).map(([subject, tests]) => (
                <div key={subject} className="test-card">
                  <h3 className="exam-title">
                    <FaBook className="icon" /> {subject}
                  </h3>
                  <ul className="test-list">
                    {tests.map((test, index) => (
                      <li key={test.id} className="test-item">
                        <FaClipboardList className="icon test-icon" /> 
                        {test.testName}
                        <span className="test-meta">
                          {/* ({test.language?.join(', ')} - {test.durationMinutes} mins) */}
                          {test.chapterNames && test.chapterNames.length > 0 && (
                            <div>Chapters: {test.chapterNames.join(', ')}</div>
                          )}
                        </span>
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
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            font-size: 16px;
            color: #495057;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
            transition: color 0.2s;
          }

          .test-item:hover {
            color: #007bff;
          }

          .test-meta {
            font-size: 12px;
            color: #6c757d;
            margin-top: 2px;
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