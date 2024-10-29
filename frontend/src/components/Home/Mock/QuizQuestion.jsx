import React, { useState } from 'react';

function QuizQuestion({ questionData }) {
  const { question, options, correctAnswer } = questionData;
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`block w-full text-left rounded-lg py-2 px-4 font-bold transition duration-300 ${
              isSubmitted
                ? option === correctAnswer
                  ? 'bg-green-500 text-white'
                  : option === selectedOption
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                : selectedOption === option
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Submit
      </button>
      {isSubmitted && (
        <div className="mt-4">
          {selectedOption === correctAnswer ? (
            <p className="text-green-600">Correct!</p>
          ) : (
            <p className="text-red-600">Incorrect! The correct answer is: {correctAnswer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizQuestion;
