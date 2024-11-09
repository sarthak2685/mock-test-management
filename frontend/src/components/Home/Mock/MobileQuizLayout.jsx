import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Timer from '../Mock/timer';
import QuestionNavigation from '../Mock/navigation';

const MobileQuizLayout = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
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

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Professional Sticky Header with Timer and Navigation Toggle */}
      <div className="sticky top-0 flex items-center justify-between bg-white shadow-md p-4 z-10 border-b border-gray-200">
        <Timer />
        <button
          onClick={() => setShowNavigation(!showNavigation)}
          className="text-blue-500"
        >
          {showNavigation ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Full-Screen Navigation Modal with Professional Styling */}
      {showNavigation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20 transition duration-200">
          <div className="bg-white rounded-lg p-6 w-10/12 max-h-3/4 overflow-y-auto shadow-lg">
            <h3 className="text-center text-lg font-semibold mb-4 text-gray-700">Sections</h3>
            {quizData.map((section, index) => (
              <button
                key={index}
                className={`${
                  currentSectionIndex === index ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
                } w-full text-left px-4 py-2 m-1 rounded-lg transition duration-300`}
                onClick={() => {
                  setCurrentSectionIndex(index);
                  setShowNavigation(false);
                }}
              >
                {section.section}
              </button>
            ))}
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setShowNavigation(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Main Question Content */}
      <div className="flex-grow bg-white rounded-lg shadow p-6 m-4">
        {!submitted ? (
          <>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionChange(option)}
                    className="form-radio text-blue-500"
                  />
                  <span className="text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-blue-600">Quiz Submitted!</h2>
            <p className="mt-4 text-lg text-gray-700">Your Score: {score}</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation */}
      {!submitted && (
        <div className="sticky bottom-0 bg-white shadow-md p-4 flex justify-between items-center gap-2">
          <button
            onClick={handleMarkForReview}
            className="bg-red-400 text-white px-4 py-2 rounded-lg transition hover:bg-red-500"
          >
            Mark for Review
          </button>
          <button
            onClick={handlePrevious}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-600"
          >
            Save & Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileQuizLayout;
