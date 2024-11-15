import React, { useState, useEffect, useRef } from 'react';
import { RiInformation2Line } from 'react-icons/ri'; // Importing the new icon

const QuestionNavigation = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onSubmit,
  sectionName,
  answeredQuestions = [],
  markedForReview = [],
}) => {
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false); // State to show instructions
  const prevSectionName = useRef(sectionName);

  // Toggle function for instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  useEffect(() => {
    if (prevSectionName.current !== sectionName) {
      onSelectQuestion(0);
      prevSectionName.current = sectionName;
    }
  }, [sectionName, onSelectQuestion]);

  const filteredQuestions = showMarkedOnly
    ? questions.filter((_, i) => markedForReview.includes(i))
    : questions;

  return (
    <div className="bg-white p-7 rounded-lg shadow-lg">
      {/* Instruction about buttons */}
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={toggleInstructions}
          className="text-blue-500 hover:text-blue-700 text-xl flex items-center space-x-2"
        >
          <RiInformation2Line className="w-6 h-6" /> {/* Using the new icon */}
          <span>Instructions</span>
        </button>
       
      </div>

      {/* Conditional rendering of instructions */}
      {showInstructions && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-600">
            Here are the instructions for taking the test. Please read them carefully before proceeding.
            {/* You can customize the instructions here */}
          </p>
        </div>
      )}

      {/* Grid with Question Statuses */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Question */}
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg shadow-sm">
          <span className="w-6 h-6 bg-blue-500 rounded-md"></span>
          <span className="text-md font-medium text-gray-700">Current Question</span>
        </div>

        {/* Answered */}
        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg shadow-sm">
          <span className="w-6 h-6 bg-green-500 rounded-md"></span>
          <span className="text-md font-medium text-gray-700">Answered</span>
        </div>

        {/* Marked for Review */}
        <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg shadow-sm">
          <span className="w-6 h-6 bg-red-500 rounded-md"></span>
          <span className="text-md font-medium text-gray-700">Marked for Review</span>
        </div>

        {/* Not Answered */}
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg shadow-sm">
          <span className="w-6 h-6 bg-gray-400 rounded-md"></span>
          <span className="text-md font-medium text-gray-700">Not Answered</span>
        </div>
      </div>

      {/* Section Title with Border */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        {sectionName}
      </h3>

      {/* Show Marked Only Toggle */}
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showMarkedOnly}
            onChange={() => setShowMarkedOnly(!showMarkedOnly)}
            className="form-checkbox text-blue-500 transition duration-200"
            aria-label="Show marked questions only"
          />
          <span className="ml-2 text-gray-600">
            Show Marked Only ({markedForReview.length})
          </span>
        </label>
      </div>

      {/* Question Navigation Grid */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-4 my-10">
        {filteredQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(i)}
            title={
              markedForReview.includes(i)
                ? "Marked for Review"
                : answeredQuestions[i] !== undefined
                ? "Answered"
                : "Not Answered"
            }
            aria-label={`Question ${i + 1}, ${
              markedForReview.includes(i)
                ? "Marked for Review"
                : answeredQuestions[i] !== undefined
                ? "Answered"
                : "Not Answered"
            }`}
            className={`w-10 h-10 rounded-md font-bold transition duration-200 focus:outline-none focus:ring ${
              selectedQuestionIndex === i
                ? "bg-blue-200 text-blue-700 ring-2 ring-blue-300" // Current selected question
                : markedForReview.includes(i)
                ? "bg-red-500 text-white" // Marked for review
                : answeredQuestions[i] !== undefined
                ? "bg-green-500 text-white" // Answered
                : "bg-gray-200 text-gray-700" // Not answered
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {/* Submit Button with Confirmation */}

      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to submit the test?")) {
            onSubmit();
            window.location.href = "/score"; // Redirect to /score after submitting
          }
        }}
        className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300 shadow-sm"
        aria-label="Submit the test"
      >
        Submit Test
      </button>
    </div>
  );
};

export default QuestionNavigation;
