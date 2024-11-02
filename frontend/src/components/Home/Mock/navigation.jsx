// QuestionNavigation.js

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

  const filteredQuestions = showMarkedOnly
    ? questions.filter((_, i) => markedForReview.includes(i))
    : questions;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{sectionName}</h3>
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showMarkedOnly}
            onChange={() => setShowMarkedOnly(!showMarkedOnly)}
            className="form-checkbox text-blue-500"
          />
          <span className="ml-2">Show Marked Only</span>
        </label>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {filteredQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(i)}
            className={`w-10 h-10 rounded-md font-bold transition duration-300 ${
              selectedQuestionIndex === i
                ? "bg-blue-500 text-white" // Current selected question
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
      <button
        onClick={onSubmit}
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
      >
        Submit Test
      </button>
    </div>
  );
};

export default QuestionNavigation;
