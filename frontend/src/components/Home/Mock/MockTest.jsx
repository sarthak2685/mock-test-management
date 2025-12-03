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
  const institueName = S.instituteId;
  const token = S.token;

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/tests/exam/${SubjectId}/institute/${institueName}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }
        const result = await response.json();

        // Check if the response has the new format (array of tests)
        if (Array.isArray(result)) {
          // Handle new API response format
          const tests = result.map((test) => ({
            test_name: test.testName || "Test",
            subjects: test.subjectNames || ["General"],
            subjects_new: test.subjectNames 
              ? test.subjectNames.map((subject) => ({
                  name: subject,
                  total_questions: 0 // This would need to come from API
                }))
              : [{ name: "General", total_questions: 0 }],
            total_questions: test.totalQuestions || 0,
            exam_duration: test.durationMinutes || "N/A",
            total_marks: test.totalMarks || 0,
            postiveMarks: test.correctMark || 0,
            negativeMarks: test.negativeMark || 0,
            test_id: test.id, // Add test ID for reference
          }));
          setMockTestData(tests);
          return tests.map((test) => test.test_name);
        } else {
          // Handle existing API response format
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
                );
              const subjects_new = subjects.map((subject) => ({
                name: subject,
                total_questions: testDetails[subject]?.no_of_questions || 0,
              }));
              return {
                test_name: testName,
                subjects: subjects || ["N/A"],
                subjects_new: subjects_new.length ? subjects_new : [{ name: "N/A", total_questions: 0 }],
                total_questions: testDetails.total_questions || 0,
                exam_duration: testDetails.exam_duration || "N/A",
                total_marks: parseFloat(testDetails.total_marks) || 0,
                postiveMarks: testDetails._positive_marks || 0,
                negativeMarks: testDetails._negative_marks || 0,
              };
            });
            
          setMockTestData(groupedTests);
          return groupedTests.map((test) => test.test_name);
        }
      } catch (error) {
        console.error("Error fetching mock test data:", error);
        return [];
      }
    };

    // const fetchTestTimes = async (testNames) => {
    //   try {
    //     // For new API format, we might need to adjust the endpoint
    //     // Using the same endpoint for now
    //     const response = await fetch(
    //       `${config.apiUrl}/test_time/?&institute_name=${institueName}`,
    //       {
    //         headers: {
    //           Authorization: `${token}`,
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch test times");
    //     }
    //     const data = await response.json();
        
    //     // Handle both array and object response formats
    //     let testTimeData = [];
    //     if (Array.isArray(data)) {
    //       testTimeData = data;
    //     } else if (data.data && Array.isArray(data.data)) {
    //       testTimeData = data.data;
    //     } else if (data.data && typeof data.data === 'object') {
    //       testTimeData = Object.values(data.data);
    //     }
        
    //     const mappedTestTimes = testTimeData.reduce((acc, test) => {
    //       if (test.test_name) {
    //         const testName = test.test_name.split('(')[0].trim();
    //         acc[testName] = {
    //           start_time: new Date(test.start_time),
    //           end_time: new Date(test.end_time),
    //         };
    //       }
    //       return acc;
    //     }, {});
    //     setTestTimes(mappedTestTimes);
    //   } catch (error) {
    //     console.error("Error fetching test times:", error);
    //   }
    // };

    // const fetchStudentGivenTests = async () => {
    //   try {
    //     const response = await fetch(
    //       `${config.apiUrl}/tests_point/?student_id=${id}&institute_name=${institueName}`,
    //       {
    //         headers: {
    //           Authorization: `${token}`,
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch student test data");
    //     }
    //     const data = await response.json();
        
    //     // Handle different response formats
    //     if (Array.isArray(data)) {
    //       setStudentGivenTests(data.map(test => test.test_name || test.testName || ""));
    //     } else if (data.student_given) {
    //       setStudentGivenTests(data.student_given || []);
    //     } else if (data.data && Array.isArray(data.data)) {
    //       setStudentGivenTests(data.data.map(test => test.test_name || ""));
    //     } else {
    //       setStudentGivenTests([]);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching student test data:", error);
    //   }
    // };

    const fetchAllData = async () => {
      try {
        const testNames = await fetchMockTests();
        // await Promise.all([
        //   fetchTestTimes(testNames),
        //   fetchStudentGivenTests(),
        // ]);
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
    subjects_new,
    testId
  ) => {
    console.log("Card clicked", subjects);
    localStorage.setItem("selectedTestName", testName);
    localStorage.setItem("selectedExamDuration", examDuration);
    localStorage.setItem("selectedTestId", testId);

    // Store distinct subjects, total marks, and total questions in localStorage
    const testDetails = {
      subjects: Array.isArray(subjects) 
        ? subjects.filter((subject) => subject && subject.trim() !== "" && subject !== "N/A")
        : [],
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
    
    console.log("Test details:", testDetails);
    localStorage.setItem("selectedTestDetails", JSON.stringify(testDetails));

    console.log(
      `Test name '${testName}', Exam Duration '${examDuration}', Subjects '${subjects}', Total Marks '${totalMarks}', Total Questions '${totalQuestions}', Positive Marks '${postiveMarks}', Negative Marks '${negativeMarks}' saved to localStorage`
    );
  };

  const getCurrentTime = () => new Date();

  // Helper function to safely join subjects
  const formatSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) return "N/A";
    const filteredSubjects = subjects.filter(subject => 
      subject && subject.trim() !== "" && subject !== "N/A"
    );
    return filteredSubjects.length > 0 ? filteredSubjects.join(", ") : "General";
  };

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {exam?.name || "Mock"} Tests
        </h2>

        {mockTestData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tests available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockTestData.map((test, index) => {
              // Ensure subjects is an array
              const subjectsArray = Array.isArray(test.subjects) 
                ? test.subjects 
                : [test.subjects || "General"];
              
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
              // const isTestMissed =
              //   !isTestGiven && endTime && currentTime > endTime;

              return (
                <div
                  key={test.test_name || `test-${index}`}
                  className={`relative p-8 rounded-2xl shadow-lg transform transition duration-500 ease-in-out card-3d ${
                    isTestGiven || !isTestTimeValid
                      ? "opacity-50"
                      : ""
                      //  pointer-events-none
                  }`}
                  onClick={() =>
                    
                    handleCardClick(
                      test.test_name,
                      test.exam_duration,
                      subjectsArray,
                      test.total_marks || "0",
                      test.total_questions || "0",
                      test.postiveMarks || "0",
                      test.negativeMarks || "0",
                      test.subjects_new,
                      test.test_id
                    )
                  }
                >
                  <div className="relative z-20 flex flex-col justify-between h-full p-4">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-center text-gray-800">
                        {test.test_name || `Test ${index + 1}`}
                      </h3>
                      <p className="text-gray-500 mt-2 font-semibold">
                        <strong>Subjects:</strong> {formatSubjects(subjectsArray)}
                        <br />
                        <span className="text-gray-500 mt-2 flex items-center font-semibold">
                          🕒 {test.exam_duration || "N/A"} Minutes
                        </span>
                        <span className="text-gray-500 mt-2 flex items-center font-semibold">
                          📋 {test.total_questions || "0"} Questions
                        </span>
                        {test.total_marks && test.total_marks > 0 && (
                          <span className="text-gray-500 mt-2 flex items-center font-semibold">
                            🏆 {test.total_marks} Marks
                          </span>
                        )}
                      </p>
                    </div>

                    {/* {isTestGiven ? (
                      <p className="text-center text-green-600 font-semibold">
                        You attempted the test
                      </p>
                    ) : isTestMissed ? (
                      <p className="text-center text-red-600 font-semibold">
                        You missed the test
                      </p>
                    ) : null} */}
                    <Link
                        to="/instruction"
                        className="inline-block bg-[#007bff] text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-300 text-center text-sm"
                      >
                        Start Test
                      </Link>

                    {/* {!isTestGiven && isTestTimeValid && (
                      <Link
                        to="/instruction"
                        className="inline-block bg-[#007bff] text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-300 text-center text-sm"
                      >
                        Start Test
                      </Link>
                    )} */}
                    
                  </div>
                  <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md z-20">
                    Test {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .card-3d {
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-3d:hover:not(.pointer-events-none) {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
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