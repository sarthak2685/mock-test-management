import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { quizData } from "../Mock/quiz";
import QuestionNavigation from "../Mock/navigation";
import MobileQuizLayout from "./MobileQuizLayout";
import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections

const MockDemo = () => {
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "", // Empty string or null means it will show initials
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    quizData.map(() => [])
  );
  const [markedForReview, setMarkedForReview] = useState(
    quizData.map(() => [])
  );

  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );

  // Function to handle filtered data (to display only relevant sections)
  const filteredQuizData = quizData.filter((section) => {
    if (selectedSubject) {
      return (
        section.section === "General Intelligence and Reasoning" ||
        section.section === "General Awareness" ||
        section.section === "Quantitative Aptitude" ||
        section.section === selectedSubject
      );
    }
    return true;
  });

  // Ensure that the current section is correctly assigned based on index
  const currentSection = filteredQuizData[currentSectionIndex] || {};
  const currentQuestion = currentSection.questions
    ? currentSection.questions[currentQuestionIndex]
    : null;

  console.log("Filtered Data:", filteredQuizData);
  console.log("Current Section:", filteredQuizData[currentSectionIndex]);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setSelectedOption(
      answeredQuestions[currentSectionIndex]?.[currentQuestionIndex]
    );
  }, [currentQuestionIndex, currentSectionIndex, answeredQuestions]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setAnsweredQuestions((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentSectionIndex][currentQuestionIndex] = option;
      return updatedAnswers;
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(
        filteredQuizData[currentSectionIndex - 1].questions.length - 1
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < filteredQuizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < filteredQuizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === currentSection.questions.length - 1;
  const isLastSection =
    currentSectionIndex === filteredQuizData.length - 1;

  const handleSectionChange = (index) => {
    setCurrentSectionIndex(index);
    setCurrentQuestionIndex(0);
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

  const sectionIcons = [
    <FaBrain />,
    <FaBook />,
    <FaCalculator />,
    <FaLanguage />,
    <FaLanguage />,
  ];

  const UserProfile = ({ user }) => {
    const getInitials = (name) => {
      if (!name) return "";
      const nameParts = name.split(" ");
      const initials = nameParts
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
      return initials;
    };

    return (
      <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.name}'s profile`}
            className="w-12 h-12 rounded-full border p-2 border-gray-300"
          />
        ) : (
          <div className="w-12 h-12 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span className="text-lg font-semibold">
              {getInitials(user.name)}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
    );
  };

  const Timer = () => {
    const totalTime = 10 * 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const warningTime = 1 * 60;

    useEffect(() => {
      if (timeLeft > 0) {
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
      }
    }, [timeLeft]);

    const formatTime = (totalSeconds) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const percentage = (timeLeft / totalTime) * 100;
    const progressColor = timeLeft > warningTime ? "#007bff" : "#ef4444";

    return (
      <div
        className="relative w-16 h-16 flex items-center justify-center"
        style={{
          background: `conic-gradient(${progressColor} ${percentage}%, #e6e6e6 ${percentage}%)`,
          borderRadius: "50%",
        }}
      >
        <div className="absolute w-12 h-12 bg-white flex items-center justify-center rounded-full text-black font-bold">
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
    );
  };

  return isMobile ? (
    <MobileQuizLayout
      currentSectionIndex={currentSectionIndex}
      currentQuestionIndex={currentQuestionIndex}
      handleOptionChange={handleOptionChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleSubmitNext={handleSubmitNext}
      handleMarkForReview={handleMarkForReview}
      setSubmitted={setSubmitted}
      submitted={submitted}
      quizData={quizData}
      currentSection={currentSection}
      currentQuestion={currentQuestion}
      setCurrentSectionIndex={setCurrentSectionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answeredQuestions={answeredQuestions}
      markedForReview={markedForReview}
    />
  ) : (
    <div className="flex flex-col items-center bg-gray-100 min-h-full">
    <div className="grid lg:grid-cols-12 gap-4 w-full max-w-full">
      <div className="lg:col-span-9 col-span-full bg-white rounded-lg shadow-lg">
        {!submitted ? (
          <>
            {/* Section Navigation */}
            <div className="col-span-full grid grid-cols-4 space-x-4 py-4 px-8 bg-gray-100 rounded-lg shadow-md">
              {filteredQuizData.map((section, index) => (
                <button
                  key={index}
                  className={`flex items-center col-span-1 py-3 px-4 rounded-lg transition duration-300 ${
                    currentSectionIndex === index
                      ? "bg-blue-700 text-white font-semibold shadow-lg"
                      : "bg-white text-blue-700 hover:bg-blue-100 hover:shadow-sm"
                  }`}
                  onClick={() => handleSectionChange(index)}
                >
                  <div className="mr-2">{sectionIcons[index]}</div>
                  <span>{section.section}</span>
                </button>
              ))}
            </div>
            {/* Header with Profile, Marks, Language, and Timer */}
            <div className="border items-center grid grid-cols-12 space-x-1 py-4 px-8 bg-white rounded-lg shadow-md">
              <div className="col-span-3">
                <UserProfile user={user} />
              </div>
              <div className="col-span-1" />

              <div className="col-span-6 flex items-center space-x-4">
                <div className="flex items-center justify-center p-3 bg-green-200 text-green-700 rounded-xl">
                  <h2 className="font-semibold">+4 marks</h2>
                </div>
                <div className="flex items-center justify-center p-3 bg-red-200 text-red-700 rounded-xl">
                  <h2 className="font-semibold">-1 marks</h2>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                <Timer />
              </div>
            </div>

            {/* Question Section */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-lg font-medium mb-8">
                {currentQuestion ? currentQuestion.question : "Loading..."}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {currentQuestion?.options.map((option, index) => (
                  <label
                    key={index}
                    className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition duration-200 transform ${
                      selectedOption === option
                        ? "bg-blue-50 border-blue-500 shadow-md"
                        : "hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                      className="hidden"
                    />
                    <span className="text-gray-800 font-medium">{option}</span>
                  </label>
                ))}
              </div>

              {/* Question Navigation and Actions */}
              <div className="grid grid-cols-12 items-center lg:mt-[25%] xl:mt-[20%] 2xl:mt-[17%]">
                <button
                  onClick={handleMarkForReview}
                  className="bg-red-500 text-white px-5 py-3 col-span-3 rounded-lg shadow-md hover:bg-red-600"
                >
                  Mark for Review
                </button>
                <div className="col-span-1" />
                <div className="grid grid-cols-2 col-span-4 items-center space-x-4 gap-10">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className={`px-5 py-3 col-span-1 rounded-lg shadow-md ${
                      isFirstQuestion ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={isLastQuestion && isLastSection}
                    className={`px-5 py-3 rounded-lg col-span-1 shadow-md ${
                      isLastQuestion && isLastSection
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="col-span-1" />

                <button
                  onClick={handleSubmitNext}
                  disabled={isLastQuestion && isLastSection}
                  className={`px-5 py-3 col-span-3 rounded-lg shadow-md ${
                    isLastQuestion && isLastSection
                      ? "bg-green-200 text-green-700 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Save & Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold">Test Submitted</h2>
            <p>Your responses have been submitted successfully.</p>
          </div>
        )}
      </div>

      {/* Question Navigation Component */}
      <div className="lg:col-span-3 col-span-full space-y-3">
        <QuestionNavigation
          questions={currentSection.questions}
          selectedQuestionIndex={currentQuestionIndex}
          onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
          onSubmit={() => {
            setSubmitted(true);
          }}
          sectionName={currentSection.section}
          answeredQuestions={answeredQuestions[currentSectionIndex] || []}
          markedForReview={markedForReview[currentSectionIndex] || []}
        />
      </div>
    </div>
  </div>
);
};

export default MockDemo;