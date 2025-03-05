import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import config from "../../../config";

const MockTest = () => {
  const { state } = useLocation();
  const { exam } = state;

  const [mockTestData, setMockTestData] = useState([]);
  const [studentGivenTests, setStudentGivenTests] = useState([]);
  const [testTimes, setTestTimes] = useState({});

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

        const examDomain = result.data.exam_domain || "N/A";

        const groupedTests = Object.entries(result.data || {})
        .filter(([key]) => key !== "exam_domain")
        .map(([testName, testDetails]) => {
          const subjects = Object.keys(testDetails)
            .filter(
              (key) =>
                key !== "exam_duration" &&
                key !== "total_marks" &&
                key !== "total_questions" &&
                key !== "_positive_marks" &&
                key !== "_negative_marks"
            )
            const subjects_new = subjects.map((subject) => ({
              name: subject,
              total_questions: testDetails[subject]?.no_of_questions || 0,
            }));
      
          return {
            test_name: testName,
            subjects: subjects || "N/A",
            subjects_new: subjects_new.length ? subjects_new : [{ name: "N/A", total_questions: 0 }],
            total_questions: testDetails.total_questions || 0,
            exam_duration: testDetails.exam_duration || "N/A",
            total_marks: parseFloat(testDetails.total_marks) || 0,
            postiveMarks: testDetails._positive_marks || 0,
            negativeMarks: testDetails._negative_marks || 0,
          };
        });
      console.log("ss",groupedTests)
      setMockTestData(groupedTests);
      return groupedTests.map((test) => test.test_name);
      
      } catch (error) {
        console.error("Error fetching mock test data:", error);
        return [];
      }
    };

    const fetchTestTimes = async (testNames) => {
      try {
       
        const response = await fetch(
          `${config.apiUrl}/test_time/?&institute_name=${institueName}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch test times");
        }
        const data = await response.json();
        const mappedTestTimes = data.data.reduce((acc, test) => {
          const testName = test.test_name.split('(')[0].trim();
          acc[testName] = {
            start_time: new Date(test.start_time),
            end_time: new Date(test.end_time),
          };
          return acc;
        }, {});
        setTestTimes(mappedTestTimes);
      } catch (error) {
        console.error("Error fetching test times:", error);
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
        setStudentGivenTests(data.student_given || []);
      } catch (error) {
        console.error("Error fetching student test data:", error);
      }
    };

    const fetchAllData = async () => {
      try {
        const testNames = await fetchMockTests();
        await Promise.all([
          fetchTestTimes(testNames),
          fetchStudentGivenTests(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [SubjectId, id, institueName, token]);

  const handleCardClick = (
    testName,
    examDuration,
    subjects,
    totalMarks,
    totalQuestions,
    postiveMarks,
    negativeMarks,
    subjects_new
  ) => {
    console.log("Card clicked",subjects)
    localStorage.setItem("selectedTestName", testName);
    localStorage.setItem("selectedExamDuration", examDuration);

    // Store distinct subjects, total marks, and total questions in localStorage
    const testDetails = {
      subjects: subjects.filter((subject) => subject.trim() !== ""),
      subjects_new: Array.isArray(subjects_new)
        ? subjects_new.map((subj) => ({
            name: subj.name,
            total_questions: subj.total_questions
          }))
        : [],
      totalMarks,
      totalQuestions,
      postiveMarks,
      negativeMarks,
    };
    console.log("hii",testDetails)
    // ✅ Store in localStorage
    localStorage.setItem("selectedTestDetails", JSON.stringify(testDetails));
//     const storedDetails = JSON.parse(localStorage.getItem("testDetails"));

// console.log("Subjects and Total Questions:");
// storedDetails.subjects.forEach((subj) => {
//   console.log(`${subj.name}: ${subj.total_questions} questions`);
// });

    console.log(
      `Test name '${testName}', Exam Duration '${examDuration}', Subjects '${subjects}', Total Marks '${totalMarks}', and Total Questions '${totalQuestions}',${postiveMarks},${negativeMarks} saved to localStorage`
    );
  };

  const getCurrentTime = () => new Date();

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {exam.name} Mock Tests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockTestData.map((test, index) => {
            const isTestGiven = studentGivenTests.includes(test.test_name);

            const startTime = testTimes[test.test_name]?.start_time
              ? new Date(testTimes[test.test_name].start_time)
              : null;
            const endTime = testTimes[test.test_name]?.end_time
              ? new Date(testTimes[test.test_name].end_time)
              : null;
            const currentTime = getCurrentTime();

            const isTestTimeValid =
              startTime &&
              endTime &&
              currentTime >= startTime &&
              currentTime <= endTime;

            // Check if the test is missed
            const isTestMissed =
              !isTestGiven && endTime && currentTime > endTime;

            return (
              <div
                key={test.test_name}
                className={`relative p-8 rounded-2xl shadow-lg transform transition duration-500 ease-in-out card-3d ${
                  isTestGiven || !isTestTimeValid
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() =>
                  handleCardClick(
                    test.test_name,
                    test.exam_duration,
                    test.subjects,
                    test.total_marks || "0",
                    test.total_questions || "0",
                    test.postiveMarks || "0",
                    test.negativeMarks || "0",
                    test.subjects_new
                  )
                }
              >
                <div className="relative z-20 flex flex-col justify-between h-full p-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                      {test.test_name}
                    </h3>
                    <p className="text-gray-500 mt-2 font-semibold">
                    <strong>Subjects:</strong> {test.subjects.join(", ")}
                    <br />
                      <span className="text-gray-500 mt-2 flex items-center font-semibold">
                        🕒 {test.exam_duration} Minutes
                      </span>
                      <span className="text-gray-500 mt-2 flex items-center font-semibold">
                        📋 {test.total_questions} Questions
                      </span>
                    </p>
                  </div>

                  {isTestGiven ? (
                    <p className="text-center text-green-600 font-semibold">
                      You attempted the test
                    </p>
                  ) : isTestMissed ? (
                    <p className="text-center text-red-600 font-semibold">
                      You missed the test
                    </p>
                  ) : null}

                  {!isTestGiven && isTestTimeValid && (
                    <Link
                      to="/instruction"
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
