import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { quizData } from '../Mock/quiz';
import QuestionNavigation from '../Mock/navigation';
import Timer from '../Mock/timer';
import MobileQuizLayout from './MobileQuizLayout';
import FeedbackForm from '../Mock/FeedbackForm';
import SummaryScreen from '../Mock/SummaryScreen';

const MockDemo = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const [answeredQuestions, setAnsweredQuestions] = useState(
    quizData.map(() => [])
  );
  const [markedForReview, setMarkedForReview] = useState(
    quizData.map(() => [])
  );

  const currentSection = quizData[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    handleAnswerSelection();
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
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prevMarked) => {
      const updatedMarked = [...prevMarked];
      if (!updatedMarked[currentSectionIndex].includes(currentQuestionIndex)) {
        updatedMarked[currentSectionIndex] = [
          ...updatedMarked[currentSectionIndex],
          currentQuestionIndex,
        ];
      }
      return updatedMarked;
    });
  };

  const handleAnswerSelection = () => {
    setAnsweredQuestions((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentSectionIndex][currentQuestionIndex] = selectedOption;
      return updatedAnswers;
    });
    setSelectedOption(null);
  };

  const handleSubmit = () => {
    setShowSummary(true);
  };

  const handleFinalSubmit = () => {
    let calculatedScore = 0;
    answeredQuestions[currentSectionIndex].forEach((answer, index) => {
      if (answer === currentSection.questions[index].correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    setShowSummary(false);
  };

  const handleReturnFromSummary = () => {
    setShowSummary(false);
  };

  return isMobile ? (
    <MobileQuizLayout
      currentSectionIndex={currentSectionIndex}
      currentQuestionIndex={currentQuestionIndex}
      handleOptionChange={handleOptionChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleMarkForReview={handleMarkForReview}
      handleSubmit={handleSubmit}
      setSubmitted={setSubmitted}
      score={score}
      submitted={submitted}
      quizData={quizData}
      currentSection={currentSection}
      currentQuestion={currentQuestion}
      setCurrentSectionIndex={setCurrentSectionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answeredQuestions={answeredQuestions}
      markedForReview={markedForReview}
      selectedOption={selectedOption}
    />
  ) : (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full max-w-full">
          <div className="lg:col-span-3 col-span-full flex flex-col space-y-4 py-4 p-4 rounded-md bg-white shadow">
            {quizData.map((section, index) => (
              <button
                key={index}
                className={`flex items-center py-2 px-4 rounded-md transition duration-300 ${
                  currentSectionIndex === index ? "bg-blue-700 text-white" : "hover:bg-blue-600 hover:text-white"
                }`}
                onClick={() => handleSectionChange(index)}
              >
                <span>{section.section}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-6 col-span-full bg-white rounded-lg shadow p-6">
            {!submitted ? (
              <>
                {showSummary ? (
                  <SummaryScreen
                    answeredQuestions={answeredQuestions}
                    onFinalSubmit={handleFinalSubmit}
                    onBack={handleReturnFromSummary}
                  />
                ) : (
                  <>
                    <h2 className="text-xl lg:text-2xl font-bold text-blue-600">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    <p className="text-md lg:text-lg mt-4">{currentQuestion.question}</p>

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

                    <div className="flex flex-wrap items-center space-x-4 mt-6">
                      <button onClick={handleMarkForReview} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                        Mark for Review
                      </button>
                      <button onClick={handlePrevious} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mt-2">
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          handleAnswerSelection();
                          handleNext();
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
                      >
                        Save & Next
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-2"
                      >
                        Review Summary
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-blue-600">
                  Quiz Submitted!
                </h2>
                <p className="mt-4 text-md lg:text-lg">
                  Your Score: {score} out of {currentSection.questions.length}
                </p>
                <FeedbackForm />
              </div>
            )}
          </div>

          <div className="lg:col-span-3 col-span-full space-y-4">
            <Timer />
            <QuestionNavigation
              questions={currentSection.questions}
              selectedQuestionIndex={currentQuestionIndex}
              onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
              onSubmit={handleSubmit}
              sectionName={currentSection.section}
              answeredQuestions={answeredQuestions[currentSectionIndex] || []}
              markedForReview={markedForReview[currentSectionIndex] || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDemo;
