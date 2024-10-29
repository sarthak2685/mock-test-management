import React, { useState } from 'react';

const QuestionNavigation = ({ questions, selectedQuestionIndex, onSelectQuestion, onSubmit, sectionName }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(selectedQuestionIndex);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
    onSelectQuestion(index);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{sectionName}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => handleQuestionClick(i)}
            className={`${
              selectedQuestion === i
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } font-bold rounded-lg w-10 h-10 flex items-center justify-center transition duration-300`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button 
        onClick={onSubmit} // Attach the submit logic to the button
        className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Submit
      </button>
    </div>
  );
};

export default QuestionNavigation;
