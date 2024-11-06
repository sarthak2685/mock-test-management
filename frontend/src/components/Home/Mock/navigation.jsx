import React, { useState } from "react";

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

  // Filter questions based on "Show Marked Only" toggle
  const filteredQuestions = showMarkedOnly
    ? questions.filter((_, i) => markedForReview.includes(i))
    : questions;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
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
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
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
                ? "bg-blue-500 text-white ring-2 ring-blue-300" // Current selected question
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
