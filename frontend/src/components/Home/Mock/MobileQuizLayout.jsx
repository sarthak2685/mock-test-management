import React, { useState } from 'react';
import QuestionNavigation from '../Mock/navigation';
import Timer from '../Mock/timer';

const MobileQuizLayout = ({
  currentSectionIndex,
  currentQuestionIndex,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleMarkForReview,
  handleSubmit,
  setSubmitted,
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
    <div className="flex flex-col bg-gray-100 p-4">
      {/* Section Navigation as Dropdown */}
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowNavigation(!showNavigation)}
        >
          {showNavigation ? 'Hide Navigation' : 'Show Navigation'}
        </button>
      </div>

      {showNavigation && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          {quizData.map((section, index) => (
            <button
              key={index}
              className={`${
                currentSectionIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-500'
              } px-4 py-2 m-1 rounded-lg transition duration-300 w-full`}
              onClick={() => setCurrentSectionIndex(index)}
            >
              {section.section}
            </button>
          ))}
        </div>
      )}

      {/* Timer */}
      <div className="mb-4">
        <Timer />
      </div>

      {/* Main Question Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {!submitted ? (
          <>
            <h2 className="text-xl font-bold text-blue-600">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="mt-4">{currentQuestion.question}</p>

            <div className="mt-4 space-y-2">
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
                  <span>{option}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center space-x-4 mt-6 justify-center">
              <button
                onClick={handleMarkForReview}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Mark for Review
              </button>
              <button
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save & Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-blue-600">Quiz Submitted!</h2>
            <p className="mt-4 text-lg">Your Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileQuizLayout;
