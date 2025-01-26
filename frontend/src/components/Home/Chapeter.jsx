import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chapters = () => {
  const { subjectName } = useParams();
  const SubjectId = localStorage.getItem("selectedSubjectId");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const id = S.id;
  const institueName = S.institute_name;
  const token = S.token;
  const navigate = useNavigate();
  const [studentGivenTests, setStudentGivenTests] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details-based-on-subjects/?subject_id=${SubjectId}&institue_name=${institueName}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract chapter data and filter out question details
        const formattedData = Object.entries(data?.data?.chapters || {}).map(
          ([chapterName, items]) => ({
            name: chapterName,
            tests: items
              .filter(
                (item) =>
                  item.test_name &&
                  item.duration &&
                  item.total_no_of_questions &&
                  item._negative_marks &&
                  item._positive_marks
              )
              .map((test) => ({
                testName: test.test_name,
                examDuration: test.duration,
                noOfQuestions: test.total_no_of_questions,
                negativeMarks: test._negative_marks,
                positiveMarks: test._positive_marks,
              })),
          })
        );

        setChapters(formattedData);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Failed to fetch chapters. Please try again later.");
      } finally {
        setLoading(false);
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

        setStudentGivenTests(data.student_given || []);
      } catch (error) {
        console.error("Error fetching student test data:", error);
      }
    };

    if (SubjectId) {
      setLoading(true);
      fetchChapters();
      fetchStudentGivenTests();
    } else {
      setError("No subject selected.");
      setLoading(false);
    }
  }, [SubjectId, institueName, id, token]);

  const handleChapterClick = (chapterName) => {
    // Find the chapter in the chapters state
    const selectedChapter = chapters.find(
      (chapter) => chapter.name === chapterName
    );

    if (selectedChapter) {
      // Check if the chapter has tests
      const testDetails = selectedChapter.tests[0]; // Assuming you want the first test details
      if (testDetails) {
        const {
          testName,
          examDuration,
          noOfQuestions,
          positiveMarks,
          negativeMarks,
        } = testDetails;

        // Store selected chapter, test name, and duration in local storage
        localStorage.setItem("selectedChapter", chapterName);
        localStorage.setItem("selectedTestName", testName);
        localStorage.setItem("testDuration", examDuration);
        localStorage.setItem("noOfQuestions", noOfQuestions);
        localStorage.setItem("positiveMarks", positiveMarks);
        localStorage.setItem("negativeMarks", negativeMarks);

        // Log the values to the console
        console.log("Chapter Selected:", chapterName);
        console.log("Test Name:", testName || "No test name provided");
        console.log("Test Duration:", examDuration || "No duration provided");
        console.log(
          "No of Questions:",
          noOfQuestions || "No questions provided"
        );
        console.log(
          "Positive Marks:",
          positiveMarks || "No positive marks provided"
        );
        console.log(
          "Negative Marks:",
          negativeMarks || "No negative marks provided"
        );

        // Navigate to the chapter instruction page
        navigate("/chapterinstruction");
      } else {
        console.error("No test details found for the selected chapter.");
        setError("No test details available for this chapter.");
      }
    } else {
      console.error("Chapter not found.");
      setError("Selected chapter does not exist.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-12">Loading chapters...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      {/* 3D Pattern in the Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500 to-yellow-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500 to-teal-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500 to-red-500 opacity-30 transform rotate-45 z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {subjectName} Chapters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className={`relative bg-white p-8 rounded-2xl shadow-lg transform ${
                chapter.tests.some((test) =>
                  studentGivenTests.includes(test.testName)
                )
                  ? "opacity-50"
                  : "hover:scale-105"
              } transition duration-300 ease-in-out`}
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(240, 240, 240, 0.5) 25%, transparent 25%, transparent 50%, rgba(240, 240, 240, 0.5) 50%, rgba(240, 240, 240, 0.5) 75%, transparent 75%, transparent)",
                backgroundSize: "20px 20px",
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="mb-6">
                  {chapter.tests.map((test, testIndex) => {
                    const isAttempted = studentGivenTests.includes(
                      test.testName
                    );

                    return (
                      <div key={testIndex}>
                        <div
                          className={`text-2xl font-bold text-center ${
                            isAttempted
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-800 cursor-pointer"
                          }`}
                          onClick={() => {
                            if (isAttempted) {
                              // Show toast notification
                              toast.warn(
                                "You have already attempted this test.",
                                {
                                  position: "top-center",
                                  autoClose: 3000,
                                }
                              );
                              return; // Prevent any further action
                            }
                            // Proceed if not attempted
                            handleChapterClick(
                              chapter.name,
                              test.testName,
                              test.examDuration,
                              test.total_no_of_questions,
                              test.positiveMarks,
                              test.negativeMarks
                            );
                          }}
                        >
                          {test.testName}
                        </div>
                        {isAttempted && (
                          <p className="mt-2 text-center text-sm text-red-500">
                            You have already attempted this test.
                          </p>
                        )}
                        <div className="mt-4 text-gray-700">
                          <div className="flex items-center space-x-3 text-base">
                            <span className="text-blue-600 text-lg">
                              <strong>🕒</strong>
                            </span>
                            <span className="font-semibold">
                              {test.examDuration || "N/A"} mins
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-base mt-2">
                            <span className="text-green-600 text-lg">
                              <strong>📋</strong>
                            </span>
                            <span className="font-semibold">
                              {test.noOfQuestions || "N/A"} Questions
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    const isAnyTestAttempted = chapter.tests.some((test) =>
                      studentGivenTests.includes(test.testName)
                    );
                    if (isAnyTestAttempted) {
                      // Show toast notification
                      toast.warn("You have already attempted all tests.", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                    } else {
                      handleChapterClick(chapter.name, null, null);
                    }
                  }}
                  className={`inline-block text-white font-semibold py-2 px-4 rounded-lg ${
                    chapter.tests.some((test) =>
                      studentGivenTests.includes(test.testName)
                    )
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#007bff] hover:bg-blue-700 transition duration-300"
                  } text-center`}
                >
                  Take Test
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md">
                {chapter.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chapters;
