import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported


const MockTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds

  const questions = [
    {
      question: "What is 2 + 2?",
      options: [2, 3, 4, 5],
      correctAnswer: 4,
    },
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
  ];

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      // Check answer, update score
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    // Handle test submission logic (e.g., display final score)
    console.log("Final Score:", score);
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitTest(); // Automatically submit test when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="mock-test container mx-auto flex flex-col h-screen">
        {/* Header (replace with your desired content) */}
        <header className="header flex justify-between items-center py-4 bg-gray-200">
          <h1 className="text-xl font-bold">Mock Test</h1>
          <div className="time-remaining">Time Remaining: {formatTime(timeRemaining)}</div>
          <div className="navigation">
            <button className="btn btn-primary" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              Previous
            </button>
            <button className="btn btn-primary" onClick={handleNextQuestion} disabled={selectedAnswer === null}>
              Next
            </button>
            <button className="btn btn-primary" onClick={handleSubmitTest} disabled={currentQuestion !== questions.length - 1}>
              Submit
            </button>
          </div>
        </header>

        {/* Question and Options */}
        <main className="main flex-grow overflow-y-auto px-4 py-8">
          <p className="text-lg font-bold mb-4">Question {currentQuestion + 1}</p>
          <p className="text-gray-700 mb-4">{questions[currentQuestion].question}</p>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="option-item mb-2">
              <input
                type="radio"
                name="answer"
                value={option}
                onChange={() => setSelectedAnswer(option)}
                checked={selectedAnswer === option}
              />
              <label className="ml-2">{option}</label>
            </div>
          ))}
        </main>
      </div>
    </>
  );
};

export default MockTest;
