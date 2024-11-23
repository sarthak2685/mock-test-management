import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { quizData } from "../Mock/quiz";
import QuestionNavigation from "../Mock/navigation";
import MobileQuizLayout from "./MobileQuizLayout";
import config from "../../../config";
import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections
import Timer from "../Mock/Timer";

const MockDemo = () => {
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "", // Empty string or null means it will show initials
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  const sectionIcons = [
    <FaBrain />,
    <FaBook />,
    <FaCalculator />,
    <FaLanguage />,
    <FaLanguage />,
  ];

  const UserProfile = () => {
    const [user, setUser] = useState({ id: "Unknown User", role: "Student" }); // Default user state

    /*useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`${config.apiUrl}/admin-student-crud/`, {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Fetched students data:", data); // Log the fetched data

          // Ensure the data is an array before setting it to state
          if (Array.isArray(data.data)) {
            setStudents(data.data);
          } else {
            console.warn("Fetched data is not an array:", data);
            setStudents([]); // Fallback to an empty array
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setError("Failed to fetch students.");
          setStudents([]); // Ensure students is reset to an empty array on error
        }
      };

      fetchStudents();
    }, []);*/

    useEffect(() => {
      // Fetch user details from local storage
      const storedData = localStorage.getItem("user"); // Assuming JSON object is stored under this key
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData); // Parse the JSON string
          if (parsedData && parsedData.user) {
            setUser({ id: parsedData.user, role: "Student" }); // Set user ID and fixed role
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          setUser({ id: "Unknown User", role: "Student" }); // Fallback in case of error
        }
      }
    }, []); // Runs once when the component mounts

    return (
      <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
        {/* Render initials based on user ID */}
        <div className="w-12 h-12 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <span className="text-lg font-semibold">{user.id}</span>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">{user.id}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
    );
  };

  const [answeredQuestions, setAnsweredQuestions] = useState(
    quizData.map(() => [])
  );

  const [markedForReview, setMarkedForReview] = useState(
    quizData.map(() => [])
  );

  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );

  // Function to handle filtered data (to display only relevant sections)
  const filteredQuizData = quizData.filter((section) => {
    if (selectedSubject) {
      return (
        section.section === "General Intelligence and Reasoning" ||
        section.section === "General Awareness" ||
        section.section === "Quantitative Aptitude" ||
        section.section === selectedSubject
      );
    }
    return true;
  });

  // Ensure that the current section is correctly assigned based on index
  const currentSection = filteredQuizData[currentSectionIndex] || {};
  const currentQuestion = currentSection.questions
    ? currentSection.questions[currentQuestionIndex]
    : null;

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setSelectedOption(
      answeredQuestions[currentSectionIndex]?.[currentQuestionIndex]
    );
  }, [currentQuestionIndex, currentSectionIndex, answeredQuestions]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setAnsweredQuestions((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentSectionIndex][currentQuestionIndex] = option;
      return updatedAnswers;
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(
        filteredQuizData[currentSectionIndex - 1].questions.length - 1
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < filteredQuizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < filteredQuizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === currentSection.questions.length - 1;
  const isLastSection = currentSectionIndex === filteredQuizData.length - 1;

  const handleSectionChange = (index) => {
    setCurrentSectionIndex(index);
    setCurrentQuestionIndex(0);
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prevMarked) => {
      const updatedMarked = [...prevMarked];
      if (!updatedMarked[currentSectionIndex].includes(currentQuestionIndex)) {
        updatedMarked[currentSectionIndex] = [
          ...updatedMarked[currentSectionIndex],
          currentQuestionIndex,
        ];
      }
      return updatedMarked;
    });
  };

  const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0); // State for timer
  const SubjectId = localStorage.getItem("selectedSubjectId");

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details/?id=${SubjectId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }

        const result = await response.json();

        console.log("Raw API Response:", result);

        if (result.data) {
          const groupedTests = Object.entries(result.data).map(
            ([testName, testDetails]) => {
              console.log("Test Details for", testName, testDetails);

              // Parse exam_duration as a number and validate it
              const examDuration = parseInt(testDetails.exam_duration, 10);

              const validExamDuration =
                !isNaN(examDuration) && examDuration > 0 ? examDuration : 60; // Default to 60 if invalid or not provided

              // Set the timer duration for the test
              setTimerDuration(validExamDuration);

              return {
                test_name: testName,
                exam_duration: validExamDuration, // Use the valid duration here
                questions: testDetails.questions.map((question) => ({
                  id: question.id,
                  question: question.question,
                  options: Object.values(question.options),
                  subject: question.subjects[0]?.name,
                  correctAnswer: question.correct_answer,
                  marks: question.marks,
                  negativeMarks: question.negative_marks,
                })),
              };
            }
          );

          setMockTestData(groupedTests);
        } else {
          console.error("Data field is missing from the API response");
        }
      } catch (error) {
        console.error("Error fetching mock test data:", error);
      }
    };

    if (SubjectId) {
      fetchMockTests();
    }
  }, [SubjectId]);

  // Debugging: Check the timerDuration and mockTestData
  useEffect(() => {
    console.log("Updated Timer Duration:", timerDuration);
    console.log("Updated mockTestData:", mockTestData);
  }, [timerDuration, mockTestData]);

  return isMobile ? (
    <MobileQuizLayout
      currentSectionIndex={currentSectionIndex}
      currentQuestionIndex={currentQuestionIndex}
      handleOptionChange={handleOptionChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleSubmitNext={handleSubmitNext}
      handleMarkForReview={handleMarkForReview}
      setSubmitted={setSubmitted}
      submitted={submitted}
      quizData={mockTestData} // Pass the fetched data here
      currentSection={mockTestData[currentSectionIndex]} // Adjusted to the fetched data
      currentQuestion={
        mockTestData[currentSectionIndex]?.questions[currentQuestionIndex]
      }
      setCurrentSectionIndex={setCurrentSectionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answeredQuestions={answeredQuestions}
      markedForReview={markedForReview}
    />
  ) : (
    <div className="flex flex-col items-center bg-gray-100 min-h-full">
      <div className="grid lg:grid-cols-12 gap-4 w-full max-w-full">
        <div className="lg:col-span-9 col-span-full bg-white rounded-lg shadow-lg">
          <>
            {/* Section Navigation */}
            <div className="col-span-full grid grid-cols-4 space-x-4 py-4 px-8 bg-gray-100 rounded-lg shadow-md">
              {mockTestData.map((section, index) => (
                <button
                  key={index}
                  className={`flex items-center col-span-1 py-3 px-4 rounded-lg transition duration-300 ${
                    currentSectionIndex === index
                      ? "bg-blue-700 text-white font-semibold shadow-lg"
                      : "bg-white text-blue-700 hover:bg-blue-100 hover:shadow-sm"
                  }`}
                  onClick={() => handleSectionChange(index)}
                >
                  <div className="mr-2">{sectionIcons[index]}</div>
                  <span>{section.questions[0]?.subject}</span>{" "}
                  {/* Display subject here */}
                </button>
              ))}
            </div>

            {/* Header with Profile, Marks, Language, and Timer */}
            <div className="border items-center grid grid-cols-12 space-x-1 py-4 px-8 bg-white rounded-lg shadow-md">
              <div className="col-span-3">
                <UserProfile user={user} />
              </div>

              <div className="col-span-2" />

              <div className="col-span-5 flex items-center space-x-4">
                {mockTestData[currentSectionIndex]?.questions[0]?.marks && (
                  <div className="flex items-center justify-center p-3 bg-green-200 text-green-700 rounded-xl">
                    <h2 className="font-semibold">
                      +{mockTestData[currentSectionIndex]?.questions[0]?.marks}{" "}
                      marks
                    </h2>
                  </div>
                )}
                {mockTestData[currentSectionIndex]?.questions[0]
                  ?.negativeMarks && (
                  <div className="flex items-center justify-center p-3 bg-red-200 text-red-700 rounded-xl">
                    <h2 className="font-semibold">
                      {
                        mockTestData[currentSectionIndex]?.questions[0]
                          ?.negativeMarks
                      }{" "}
                      marks
                    </h2>
                  </div>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-end">
                {mockTestData.length > 0 && (
                  <Timer
                    totalMinutes={Number(mockTestData[0]?.exam_duration) || 0}
                  />
                )}
              </div>
            </div>

            {/* Question Section */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                Question {currentQuestionIndex + 1}
              </h2>

              {/* Log current question */}
              <p className="text-lg font-medium mb-8">
                {mockTestData[currentSectionIndex]?.questions[
                  currentQuestionIndex
                ]
                  ? mockTestData[currentSectionIndex]?.questions[
                      currentQuestionIndex
                    ].question
                  : "Loading..."}
              </p>

              {/* Log options */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                {mockTestData[currentSectionIndex]?.questions[
                  currentQuestionIndex
                ]?.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition duration-200 transform ${
                      selectedOption === option
                        ? "bg-blue-50 border-blue-500 shadow-md"
                        : "hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                      className="hidden"
                    />
                    <span className="text-gray-800 font-medium">{option}</span>
                  </label>
                ))}
              </div>

              {/* Question Navigation and Actions */}
              <div className="grid grid-cols-12 items-center lg:mt-[25%] xl:mt-[20%] 2xl:mt-[17%]">
                <button
                  onClick={handleMarkForReview}
                  className="bg-red-500 text-white px-5 py-3 col-span-3 rounded-lg shadow-md hover:bg-red-600"
                >
                  Mark for Review
                </button>
                <div className="col-span-1" />
                <div className="grid grid-cols-2 col-span-4 items-center space-x-4 gap-10">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className={`px-5 py-3 col-span-1 rounded-lg shadow-md ${
                      isFirstQuestion
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLastQuestion && isLastSection}
                    className={`px-5 py-3 rounded-lg col-span-1 shadow-md ${
                      isLastQuestion && isLastSection
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="col-span-1" />

                <button
                  onClick={handleSubmitNext}
                  disabled={isLastQuestion && isLastSection}
                  className={`px-5 py-3 col-span-3 rounded-lg shadow-md ${
                    isLastQuestion && isLastSection
                      ? "bg-green-200 text-green-700 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Save & Next
                </button>
              </div>
            </div>
          </>
        </div>

        {/* Question Navigation Component */}
        <div className="lg:col-span-3 col-span-full space-y-3">
          <QuestionNavigation
            questions={mockTestData[currentSectionIndex]?.questions || []}
            selectedQuestionIndex={currentQuestionIndex}
            onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
            onSubmit={() => setSubmitted(true)}
            sectionName={
              mockTestData[currentSectionIndex]?.questions[0]?.subject || ""
            }
            answeredQuestions={answeredQuestions[currentSectionIndex] || []}
            markedForReview={markedForReview[currentSectionIndex] || []}
          />
        </div>
      </div>
    </div>
  );
};

export default MockDemo;
