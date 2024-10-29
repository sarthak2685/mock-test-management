import React, { useState } from 'react';
import { quizData } from '../Mock/quiz'; // Adjust the import path based on your file structure
import QuestionNavigation from '../Mock/navigation'; // Adjust the import path as needed
import Timer from '../Mock/timer'; // Adjust the import path as needed

const MockDemo = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentSection = quizData[currentSectionIndex]; 
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleSectionChange = (index) => {
    setCurrentSectionIndex(index);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setScore(0);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;

    // Calculate score
    currentSection.questions.forEach((question) => {
      if (question.correctAnswer === selectedOption) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-5xl">
          {/* Header Buttons for Section Navigation */}
          <div className="col-span-4 flex justify-around py-4">
            {quizData.map((section, index) => (
              <button
                key={index}
                className={`${
                  currentSectionIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-500'
                } px-4 py-2 rounded-lg transition duration-300`}
                onClick={() => handleSectionChange(index)}
              >
                {section.section}
              </button>
            ))}
          </div>

          {/* Main Question Section */}
          <div className="col-span-3 bg-white rounded-lg shadow p-6">
            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold text-blue-600">Question {currentQuestionIndex + 1}</h2>
                <p className="text-lg mt-4">{currentQuestion.question}</p>

                {/* Options */}
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

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-4 mt-6">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Mark for Review</button>
                  <button onClick={handlePrevious} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Previous</button>
                  <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Next</button>
                </div>
              </>
            ) : (
              // Display result after submission
              <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600">Quiz Submitted!</h2>
                <p className="mt-4 text-lg">Your Score: {score} out of {currentSection.questions.length}</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setScore(0);
                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Restart Quiz
                </button>
              </div>
            )}
          </div>

          {/* Sidebar with Timer and Navigation */}
          <div className="col-span-1 space-y-4">
            <Timer />
            <QuestionNavigation
              questions={currentSection?.questions.map((_, index) => `Q${index + 1}`) || []}
              onSelectQuestion={setCurrentQuestionIndex}
              selectedQuestionIndex={currentQuestionIndex}
              onSubmit={handleSubmit} // Pass the submit function to navigation
              sectionName={currentSection.section} // Pass the current section name
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDemo;
