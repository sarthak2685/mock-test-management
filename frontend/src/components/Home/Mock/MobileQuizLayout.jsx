import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import QuestionNavigation from "../Mock/navigation";
import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections

const MobileQuizLayout = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleSaveNext,
  handleMarkForReview,
  handleSubmit,
  submitted,
  quizData,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  answeredQuestions,
  markedForReview,
  selectedOption,
}) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "", // Empty string or null means it will show initials
  };
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

  const currentSection = filteredQuizData[currentSectionIndex] || {};
  const currentQuestion = currentSection.questions
    ? currentSection.questions[currentQuestionIndex]
    : null;

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
  const sectionIcons = [
    <FaBrain />,
    <FaBook />,
    <FaCalculator />,
    <FaLanguage />,
  ];
  // UserProfile Component
  const UserProfile = ({ user }) => {
    if (!user) {
      return null;
    }

    const getInitials = (name) => {
      if (!name) return "";
      const nameParts = name.split(" ");
      const initials = nameParts
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
      return initials;
    };

    return (
      <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-md shadow-sm">
        {/* User Profile Image or Initials */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.name}'s profile`}
            className="w-6 h-6 rounded-full border p-1 border-gray-300"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span className="text-sm font-semibold">
              {getInitials(user.name)}
            </span>
          </div>
        )}

        {/* User Information */}
        <div>
          <h2 className="text-sm  font-semibold text-gray-700">{user.name}</h2>
          <p className="text-xs  text-gray-500">{user.role}</p>
        </div>
      </div>
    );
  };

  // Timer Component
  const Timer = () => {
    const totalTime = 60 * 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const warningTime = 5 * 60;

    useEffect(() => {
      if (timeLeft > 0) {
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }, [timeLeft]);

    const formatTime = (totalSeconds) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const percentage = (timeLeft / totalTime) * 100;
    const progressColor = timeLeft > warningTime ? "#007bff" : "#ef4444";

    return (
      <div
        className="relative w-12 h-12  flex items-center justify-center"
        style={{
          background: `conic-gradient(${progressColor} ${percentage}%, #e6e6e6 ${percentage}%)`,
          borderRadius: "50%",
        }}
      >
        <div className="absolute w-10 h-10 bg-white flex items-center justify-center rounded-full text-black text-xs font-semibold">
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
    );
  };

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
                  {currentSection.section || "Select Section"}
                  <FaChevronDown
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-40 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {/* Filtered Sections */}
                    {filteredQuizData.map((section, index) => (
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
                        {section.section}
                      </div>
                    ))}
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
        <div className="sticky top-0 bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserProfile user={user} />
            <Timer />
          </div>
          <div className="flex items-center space-x-4">
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

        {/* Main Question Content */}
        <div className="p-4 flex-1">
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="flex justify-between">
                <span className=" text-xl justify-start font-semibold text-blue-600 mb-2">
                  Question {currentQuestionIndex + 1}
                </span>
                <div className=" flex items-center justify-end space-x-1 ">
                  <div className="flex items-center justify-center p-2 bg-green-200 text-green-700 rounded-lg">
                    <h2 className="text-xs sm:font-semibold">+4 marks</h2>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-red-200 text-red-700 rounded-lg">
                    <h2 className="text-xs sm:font-semibold">-1 marks</h2>
                  </div>
                </div>
              </h2>
              <p className="my-4 text-gray-700 leading-relaxed">
                {currentQuestion?.question}
              </p>

              <div className="space-y-3 grid grid-cols-1 my-10">
                {currentQuestion?.options.map((option, index) => (
                  <label
                    key={index}
                    className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer ${
                      selectedOption === option
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100"
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
                    <span className="text-gray-600">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
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
                Next
              </button>
            </div>
            <button
              onClick={handleMarkForReview}
              className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto"
            >
              Mark for Review
            </button>

            <button
              onClick={handleSaveNext}
              className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto"
            >
              Save & Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileQuizLayout;
