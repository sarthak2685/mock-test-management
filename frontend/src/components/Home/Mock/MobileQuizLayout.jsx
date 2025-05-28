import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import QuestionNavigation from "../Mock/navigation";
import Timer from "./Timer";
import { StaticMathField } from "react-mathquill";

// import config from "../../../config";

import UserProfile from "../Mock/UserProfile";
import config from "../../../config";
import { toast } from "react-toastify";

const MobileQuizLayout = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleSubmitNext,
  handleMarkForReview,
  handleSubmit,
  submitted,
  mockTestData,
  // quizData,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  answeredQuestions,
  markedForReview,
  selectedOption,
  currentQuestion,
  currentSection,
}) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ id: "Unknown User", role: "Student" });
  // const S = JSON.parse(localStorage.getItem("user"));
  // const token = S.token;
  // const [selectedSubject, setSelectedSubject] = useState(
  //   localStorage.getItem("selectedOptionalSubject") || ""
  // );

  // Function to close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownOpen && !e.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  // UserProfile Component
  // const UserProfile = () => {
  //   const [user, setUser] = useState({ name: "Unknown User", role: "Student" }); // Default state with name and role

  //   useEffect(() => {
  //     // Fetch user details from local storage
  //     const storedData = localStorage.getItem("user"); // Assuming JSON object is stored under this key
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData); // Parse the JSON string
  //         if (parsedData) {
  //           // Check for 'name', if not use 'id'
  //           setUser({
  //             name: parsedData.name || parsedData.user || "Unknown User", // Use name if available, else fallback to user id
  //             role: parsedData.type || "Student", // Assuming 'type' is role (e.g., "student")
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error parsing stored user data:", error);
  //         setUser({ name: "Unknown User", role: "Student" }); // Fallback in case of error
  //       }
  //     }
  //   }, []); // Runs once when the component mounts

  //   return (
  //     <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
  //       {/* Render initials based on user name or id */}
  //       <div className="w-12 h-12 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
  //         <span className="text-lg font-semibold">
  //           {user.name
  //             ? user.name.charAt(0).toUpperCase()
  //             : user.id.charAt(0).toUpperCase()}{" "}
  //           {/* Initial of name or id */}
  //         </span>
  //       </div>

  //       <div>
  //         <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>{" "}
  //         {/* Display the user's name */}
  //         <p className="text-sm text-gray-500">{user.role}</p>{" "}
  //         {/* Display the user's role */}
  //       </div>
  //     </div>
  //   );
  // };

  // const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0); // State for timer
  // const SubjectId = localStorage.getItem("selectedSubjectId");

  // // Function to handle filtered data (to display only relevant sections)
  // const filteredQuizData = quizData.filter((section) => {
  //   if (selectedSubject) {
  //     return (
  //       section.section === "General Intelligence and Reasoning" ||
  //       section.section === "General Awareness" ||
  //       section.section === "Quantitative Aptitude" ||
  //       section.section === selectedSubject
  //     );
  //   }
  //   return true;
  // });

  // console.log("Data", filteredQuizData);

  console.log("Section", currentSection);

  // console.log("Duration", localStorage.getItem("timerDuration", timerDuration));

  // Check if mockTestData and subjects exist and have data
  // const subjects = Array.isArray(currentQuestion?.subject)
  //   ? currentQuestion?.subject
  //   : [currentQuestion?.subject || "No Subject"]; // Ensure subjects is always an array

  // console.log("Subjects from Question:", subjects);

  // Retrieve stored subjects from local storage
  const storedSubjects =
    JSON.parse(localStorage.getItem("uniqueSubjects")) || [];

  // Ensure subjects are always an array
  const subjects =
    Array.isArray(storedSubjects) && storedSubjects.length > 0
      ? storedSubjects
      : [currentQuestion?.subject || "No Subject"];

  console.log("Subjects:", subjects);

  // const [selectedOption, setSelectedOption] = useState(null);

  // const [answeredQuestions, setAnsweredQuestions] = useState(
  //   mockTestData.map((subject) => new Array(subject.no_of_questions).fill(null)) // Initialize with null (or any default value)
  // );

  // useEffect(() => {
  //   setSelectedOption(
  //     answeredQuestions[currentSectionIndex]?.[currentQuestionIndex]
  //   );
  // }, [currentQuestionIndex, currentSectionIndex, answeredQuestions]);

  // const handleOptionChange = (option) => {
  //   setSelectedOption(option);

  //   setAnsweredQuestions((prevAnswers) => {
  //     const updatedAnswers = [...prevAnswers];

  //     // Ensure the section exists
  //     if (!updatedAnswers[currentSectionIndex]) {
  //       updatedAnswers[currentSectionIndex] = [];
  //     }

  //     // Ensure the question exists within the section
  //     updatedAnswers[currentSectionIndex][currentQuestionIndex] = option;

  //     return updatedAnswers;
  //   });
  // };
  const [tabSwitchCount, setTabSwitchCount] = useState(0); // Track tab switch count

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          // If tab has been switched more than 3 times, show the success toast
          if (newCount > 3) {
            // toast.success("you have reached the limit, so Test has been successfully submitted!");
          }
          return newCount;
        });
        // toast.warning("You switched the tab!");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen relative">
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Section Navigation Modal */}
        {showNavigation && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-3/4 overflow-y-auto shadow-lg">
              <h3 className="text-center text-lg font-semibold mb-4 text-gray-700 relative">
                Sections
                <button
                  className="absolute top-0 right-0 text-gray-500"
                  onClick={() => setShowNavigation(false)}
                  aria-label="Close Navigation"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </h3>

              {/* Custom Dropdown for Section Selection */}
              <div className="relative w-full max-w-xs mx-auto mb-4 dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center text-gray-700"
                >
                  {subjects.length > 0
                    ? subjects[currentSectionIndex]
                    : "Select Section"}
                  <FaChevronDown
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-40 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {subjects.length > 0 ? (
                      subjects.map((subject, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setCurrentSectionIndex(index);
                            setDropdownOpen(false);
                          }}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                            index === currentSectionIndex ? "bg-blue-100" : ""
                          }`}
                        >
                          {subject}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No sections available
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-grow mt-4 overflow-y-auto max-h-96">
                {currentSection && (
                  <QuestionNavigation
                    questions={currentSection.questions}
                    selectedQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={(index) => {
                      setCurrentQuestionIndex(index);
                      setShowNavigation(false);
                    }}
                    onSubmit={handleSubmit}
                    sectionName={currentSection.section}
                    answeredQuestions={
                      answeredQuestions[currentSectionIndex] || []
                    }
                    markedForReview={markedForReview[currentSectionIndex] || []}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="sticky top-0 bg-white shadow-md p-4 grid grid-cols-3 items-center z-20">
          <div className="grid grid-cols-2 col-span-2 items-center space-x-4 justify-between">
            <UserProfile className="col-span-1" user={user} />
            {mockTestData.length > 0 && (
              <Timer
                className="col-span-1 items-center"
                totalMinutes={
                  localStorage.getItem("timerDuration", timerDuration) || 0
                }
              />
            )}
          </div>
          <div className="flex col-span-1 items-center justify-end space-x-4">
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="text-blue-500"
              aria-label="Toggle Navigation"
            >
              {showNavigation ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 flex-1">
          {currentQuestion ? (
            <div className="bg-white rounded-lg shadow p-6 mt-4">
              {/* Ensure Spacing from Header */}
              <h2 className="flex justify-between">
                <span className="text-xl justify-start font-semibold text-blue-600 mb-2">
                  Question {currentQuestionIndex + 1}
                </span>
                <div className="flex items-center justify-end space-x-1">
                  <div className="flex items-center justify-center p-2 bg-green-200 text-green-700 rounded-lg">
                    <h2 className="text-xs sm:font-semibold">
                      +{currentQuestion.marks} marks
                    </h2>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-red-200 text-red-700 rounded-lg">
                    <h2 className="text-xs sm:font-semibold">
                      {currentQuestion.negativeMarks} marks
                    </h2>
                  </div>
                </div>
              </h2>

              {/* Main Question Content */}
              <p className="my-4 text-gray-700 leading-relaxed">
                {currentQuestion?.question
                  ? currentQuestion.question
                      .replace(/\\n/g, "\n")
                      .split("\n")
                      .map((line, index) => (
                        <p
                          key={index}
                          className="flex flex-wrap items-center gap-2"
                        >
                          {line.split(/(\$[^$]+\$)/g).map((part, i) =>
                            /^\$[^$]+\$$/.test(part) ? ( // Check if part is LaTeX
                              <StaticMathField key={i}>
                                {part.slice(1, -1)}
                              </StaticMathField>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </p>
                      ))
                  : "No question available"}
              </p>

              {/* Display Additional Question Content */}
              {currentQuestion.question2 &&
              currentQuestion.question2 !==
                "/media/uploads/questions/option_4_uFtm5qj.png" ? (
                currentQuestion.question2.startsWith("/media/uploads/") ? (
                  <img
                    src={`${config.apiUrl}${currentQuestion.question2}`}
                    alt="Additional question"
                    className="max-w-full max-h-24 object-contain mt-4"
                  />
                ) : (
                  <span>{currentQuestion.question2}</span>
                )
              ) : null}

{/* Display Question Files or Options */}
<div className="options-container my-10">
  {(() => {
    const currentQuestion =
      mockTestData[currentSectionIndex]?.questions[currentQuestionIndex];

    const baseUrl = `${config.apiUrl}`;
    const defaultFileValue = "/media/uploads/questions/option_4_uFtm5qj.png";

    const rawFiles = currentQuestion?.files || [];
    const rawOptions = currentQuestion?.options || [];

    const displayItems = [];

    for (let i = 0; i < Math.max(rawFiles.length, rawOptions.length); i++) {
      const file = rawFiles[i]?.trim();
      const text = rawOptions[i]?.trim();

      const isValidFile =
        file && file !== "" && file !== defaultFileValue;

      const isValidText =
        text && text.toLowerCase() !== "none" && text.trim() !== "";

      // Only include option if text is valid
      if (isValidText) {
        displayItems.push({
          file: isValidFile ? file : null,
          text,
          value: isValidFile ? file : text,
        });
      }
    }

    return displayItems.map((item, index) => (
      <label
        key={index}
        className={`option border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition duration-200 transform ${
          selectedOption === item.value
            ? "bg-blue-200 border-blue-800 shadow-md"
            : "hover:bg-gray-50 hover:shadow-sm"
        } mb-4`}
      >
        <input
          type="radio"
          name="option"
          value={item.value}
          checked={selectedOption === item.value}
          onChange={() => handleOptionChange(item.value)}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          {/* Show image if present */}
          {item.file && (
            <img
              src={`${baseUrl}${item.file}`}
              alt={`Option ${index + 1}`}
              className="max-w-full max-h-24 object-contain mb-2"
            />
          )}
          {/* Render text with LaTeX support */}
          <div className="text-gray-800 font-medium text-center">
            {item.text
              .replace(/\\n/g, "\n")
              .split("\n")
              .map((line, idx) => (
                <p key={idx} className="flex flex-wrap items-center gap-2">
                  {line.split(/(\$[^$]+\$)/g).map((part, i) =>
                    /^\$[^$]+\$$/.test(part) ? (
                      <StaticMathField key={i}>
                        {part.slice(1, -1)}
                      </StaticMathField>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              ))}
          </div>
        </div>
      </label>
    ));
  })()}
</div>

            </div>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>

        {/* Bottom Navigation */}
        {!submitted && (
          <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center gap-2 border-t border-gray-200">
            <div className="flex flex-row justify-between gap-2 w-full">
              <button
                onClick={handlePrevious}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md px-4 py-2 w-full md:w-auto"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md px-4 py-2 w-full md:w-auto"
              >
                Skip & Next
              </button>
            </div>
            <div className="bg-white hidden rounded-lg p-6 w-11/12 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-3/4 overflow-y-auto shadow-lg">
              <h3 className="text-center text-lg font-semibold mb-4 text-gray-700 relative">
                Sections
                <button
                  className="absolute top-0 right-0 text-gray-500"
                  onClick={() => setShowNavigation(false)}
                  aria-label="Close Navigation"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </h3>

              {/* Custom Dropdown for Section Selection */}
              <div className="relative w-full max-w-xs mx-auto mb-4 dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center text-gray-700"
                >
                  {subjects.length > 0
                    ? subjects[currentSectionIndex]
                    : "Select Section"}
                  <FaChevronDown
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-40 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {subjects.length > 0 ? (
                      subjects.map((subject, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setCurrentSectionIndex(index);
                            setDropdownOpen(false);
                          }}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                            index === currentSectionIndex ? "bg-blue-100" : ""
                          }`}
                        >
                          {subject}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No sections available
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-grow mt-4 overflow-y-auto max-h-96">
                {currentSection && (
                  <QuestionNavigation
                    questions={currentSection.questions}
                    selectedQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={(index) => {
                      setCurrentQuestionIndex(index);
                      setShowNavigation(false);
                    }}
                    onSubmit={handleSubmit}
                    sectionName={currentSection.section}
                    answeredQuestions={
                      answeredQuestions[currentSectionIndex] || []
                    }
                    markedForReview={markedForReview[currentSectionIndex] || []}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between gap-2 w-full">
              <button
                onClick={handleMarkForReview}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto"
              >
                Mark for Review
              </button>

              <button
                onClick={handleSubmitNext}
                className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto"
              >
                Save & Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileQuizLayout;
