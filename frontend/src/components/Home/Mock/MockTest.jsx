import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import config from "../../../config";

const MockTest = () => {
  const { state } = useLocation();
  const { exam } = state;

  const [mockTestData, setMockTestData] = useState([]);
  const [studentGivenTests, setStudentGivenTests] = useState([]);

  const SubjectId = localStorage.getItem("selectedSubjectId");
  const S = JSON.parse(localStorage.getItem("user"));
  const id = S.id;
  const institueName = S.institute_name;
  const token = S.token;

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details/?exam_id=${SubjectId}&institute_name=${institueName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }
        const result = await response.json();
        console.log("Response JSON:", result);

        const examDomain = result.data.exam_domain || "N/A";

        const groupedTests = Object.entries(result.data || {})
          .filter(([key]) => key !== "exam_domain")
          .map(([testName, testDetails]) => {
            const subjects = Object.keys(testDetails)
              .filter(
                (key) =>
                  key !== "exam_duration" &&
                  key !== "total_marks" &&
                  key !== "total_questions"
              )
              .join(", ");

            return {
              exam_domain: examDomain,
              test_name: testName,
              subjects: subjects || "N/A",
              total_questions: testDetails.total_questions || 0,
              exam_duration: testDetails.exam_duration || "N/A",
            };
          });

        setMockTestData(groupedTests);
      } catch (error) {
        console.error("Error fetching mock test data:", error);
      }
    };

    const fetchStudentGivenTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/tests_point/?student_id=${id}&institute_name=${institueName}`,
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
        console.log("Student Given Tests:", data.student_given);

        // Store the test names the student has already given
        setStudentGivenTests(data.student_given || []);
      } catch (error) {
        console.error("Error fetching student test data:", error);
      }
    };

    fetchMockTests();
    fetchStudentGivenTests();
  }, [SubjectId, id, institueName, token]);

  const handleCardClick = (testName, examDuration) => {
    localStorage.setItem("selectedTestName", testName);
    localStorage.setItem("selectedExamDuration", examDuration);
    console.log(
      `Test name '${testName}' and Exam Duration '${examDuration}' saved to localStorage`
    );
  };

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      {/* Background gradient decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500 to-yellow-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500 to-teal-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500 to-red-500 opacity-30 transform rotate-45 z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {exam.name} Mock Tests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockTestData.map((test, index) => {
            const isTestGiven = studentGivenTests.includes(test.test_name);

            return (
              <div
                key={test.test_name}
                className={`relative p-8 rounded-2xl shadow-lg transform transition duration-500 ease-in-out card-3d ${
                  isTestGiven ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() =>
                  !isTestGiven && handleCardClick(test.test_name, test.exam_duration)
                }
              >
                <div className="relative z-20 flex flex-col justify-between h-full p-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                      {test.test_name}
                    </h3>
                    <p className="text-gray-500 mt-2 font-semibold">
                      <strong>Subjects:</strong> {test.subjects}
                      <br />
                      <span className="text-gray-500 mt-2 flex items-center font-semibold">
                        🕒 {test.exam_duration} Minutes
                      </span>
                      <span className="text-gray-500 mt-2 flex items-center font-semibold">
                        📋 {test.total_questions} Questions
                      </span>
                    </p>
                  </div>
                  {!isTestGiven && (
                    <Link
                      to={`/instruction`}
                      className="inline-block bg-[#007bff] text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-300 text-center text-sm"
                    >
                      Start Test
                    </Link>
                  )}
                </div>
                <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md z-20">
                  Test {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .card-3d {
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }

        .card-3d::before,
        .card-3d::after {
          content: "";
          position: absolute;
          width: 150%;
          height: 150%;
          background-image: repeating-linear-gradient(
            45deg,
            #f0f0f0 0px,
            #f0f0f0 10px,
            #ffffff 10px,
            #ffffff 20px
          );
          opacity: 0.2;
          transform: rotate(45deg);
          border-radius: 1rem;
        }

        .card-3d::before {
          top: -75%;
          left: -75%;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .card-3d::after {
          bottom: -75%;
          right: -75%;
          box-shadow: 0 -10px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MockTest;
