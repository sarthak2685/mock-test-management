import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import SectionNavigation from "../FreeMock/SectionNavigation";
import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections
import Timer from "../FreeMock/Timer";

const ExamMobile = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleSubmitNext,
  handleMarkForReview,
  handleSubmit,
  submitted,
  QuestionsData,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  answeredQuestions,
  markedForReview,
  selectedOption,
  onSubmit,
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
  const filteredQuestionsData = QuestionsData.filter((section) => {
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

  const currentSection = filteredQuestionsData[currentSectionIndex] || {};
  const currentQuestion = currentSection.questions
    ? currentSection.questions[currentQuestionIndex]
    : null;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === currentSection.questions.length - 1;
  const isLastSection =
    currentSectionIndex === filteredQuestionsData.length - 1;
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
                    {filteredQuestionsData.map((section, index) => (
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
                  <SectionNavigation
                    questions={currentSection.questions}
                    selectedQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={(index) => {
                      setCurrentQuestionIndex(index);
                      setShowNavigation(false);
                    }}
                    handleSubmit={handleSubmit}
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
          <div className="grid grid-cols-2 col-span-2 items-center space-x-4">
            <UserProfile className="col-span-1" user={user} />
            <div className="flex justify-center items-center">
              <Timer className="px-10" />
            </div>
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

              {/* Render question text or image */}
              <div className="my-4 text-gray-700 leading-relaxed">
                {Array.isArray(currentQuestion?.question)
                  ? currentQuestion?.question.map((line, index) => {
                      const isImageURL =
                        typeof line === "string" &&
                        /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(line);

                      const isBase64Image =
                        typeof line === "string" &&
                        /^data:image\/(jpeg|jpg|png|gif|bmp|svg);base64,/.test(
                          line
                        );

                      // If the line is not an image URL or base64, render it as text
                      if (!isImageURL && !isBase64Image) {
                        return (
                          <p key={index} className="text-lg font-medium mb-2">
                            {line}
                          </p>
                        );
                      }

                      // If the line is an image URL or base64, render the image
                      return (
                        <img
                          key={index}
                          src={line}
                          alt={`Question Image ${index}`}
                          className="w-auto h-auto mt-4"
                        />
                      );
                    })
                  : currentQuestion?.question && (
                      // If the question is a single string (image URL or text)
                      <>
                        {/\.(jpeg|jpg|png|gif|bmp|svg)$/i.test(
                          currentQuestion?.question
                        ) ||
                        /^data:image\/(jpeg|jpg|png|gif|bmp|svg);base64,/.test(
                          currentQuestion?.question
                        ) ? (
                          <img
                            src={currentQuestion?.question}
                            alt="Question Image"
                            className="w-auto h-auto mt-4"
                          />
                        ) : (
                          <p className="text-lg font-medium mb-2">
                            {currentQuestion?.question}
                          </p>
                        )}
                      </>
                    )}
              </div>

              {/* Options Section */}
              <div className="space-y-3 grid grid-cols-1 my-10">
                {currentQuestion?.options.map((option, index) => {
                  const isImageURL =
                    typeof option === "string" &&
                    /\.(jpeg|jpg|png|gif|bmp|svg)$/i.test(option);

                  const isBase64Image =
                    typeof option === "string" &&
                    /^data:image\/(jpeg|jpg|png|gif|bmp|svg);base64,/.test(
                      option
                    );

                  return (
                    <label
                      key={index}
                      className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition duration-100 transform ${
                        selectedOption === option

                          ? "bg-blue-200 border-blue-800 shadow-md"

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
                      {/* Render option text */}
                      {typeof option !== "string" ||
                      (!/\.(jpeg|jpg|png|gif|bmp|svg)$/i.test(option) &&
                        !/^data:image\/(jpeg|jpg|png|gif|bmp|svg);base64,/.test(
                          option
                        )) ? (
                        <span className="text-gray-600">{option}</span>
                      ) : null}

                      {/* Render option image */}
                      {(isImageURL || isBase64Image) && (
                        <img
                          src={option}
                          alt={`Option ${index}`}
                          className="w-auto h-16 object-cover mb-2"
                        />
                      )}
                    </label>
                  );
                })}
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
            <div className="flex flex-row justify-between gap-2 w-full">
              <button
                onClick={handleMarkForReview}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto"
              >
                Mark for Review
              </button>

              <button
                onClick={handleSubmitNext}
                disabled={isLastQuestion && isLastSection}
                className={` bg-green-500 hover:bg-green-600 text-white font-medium rounded-md px-4 py-2 w-full md:w-auto${
                  isLastQuestion && isLastSection
                    ? "bg-green-200 text-green-700 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
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

export default ExamMobile;
