import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import QuestionNavigation from "../Mock/navigation";
import Timer from "../Mock/timer";

const MobileQuizLayout = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleSaveNext,
  handleMarkForReview,
  handleSubmit,
  score,
  submitted,
  quizData,
  currentSection,
  currentQuestion,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  answeredQuestions,
  markedForReview,
  selectedOption,
}) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen relative">
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        
        {/* Header with Timer and Sidebar Toggle */}
        <div className="sticky top-0 bg-white p-4 flex items-center justify-between shadow-md z-10 border-b border-gray-200">
          <div />
          <Timer />
          <button
            onClick={() => setShowNavigation(!showNavigation)}
            className="text-blue-500"
            aria-label="Toggle Navigation"
          >
            {showNavigation ? <FaTimes className="w-10 h-10" /> : <FaBars className="w-10 h-10" />}
          </button>
        </div>

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
                  {quizData[currentSectionIndex]?.section || "Select Section"}
                  <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute z-40 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {quizData.map((section, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setCurrentSectionIndex(index);
                          setDropdownOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                          index === currentSectionIndex ? 'bg-blue-100' : ''
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
                    answeredQuestions={answeredQuestions[currentSectionIndex] || []}
                    markedForReview={markedForReview[currentSectionIndex] || []}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Question Content */}
        <div className="p-4 flex-1">
          {!submitted ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                {currentQuestion?.question}
              </p>

              <div className="space-y-3 grid grid-cols-1 my-10">
                {currentQuestion?.options.map((option, index) => (
                  <label key={index} className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer ${
                    selectedOption === option
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}>
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
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-bold text-blue-600">
                Quiz Submitted!
              </h2>
              <p className="mt-4 text-lg text-gray-700">Your Score: {score}</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        {!submitted && (
          <div className="sticky bottom-0 bg-white shadow-md p-4 flex flex-row justify-between items-center gap-2 border-t border-gray-200">
            <button
              onClick={handleMarkForReview}
              className="flex-1 bg-red-400 text-white px-2 py-2 rounded-lg transition hover:bg-red-500"
            >
              Mark for Review
            </button>
            <button
              onClick={handlePrevious}
              className="flex-1 bg-gray-300 text-gray-700 px-2 py-2 rounded-lg transition hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gray-300 text-gray-700 px-2 py-2 rounded-lg transition hover:bg-gray-400"
            >
              Next
            </button>
            <button
              onClick={handleSaveNext}
              className="flex-1 bg-green-500 text-white px-2 py-2 rounded-lg transition hover:bg-green-600"
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
