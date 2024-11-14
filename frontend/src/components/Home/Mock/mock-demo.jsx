import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { quizData } from "../Mock/quiz";
import QuestionNavigation from "../Mock/navigation";
import MobileQuizLayout from "./MobileQuizLayout";
import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections
import { MdTimer } from "react-icons/md";

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
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    quizData.map(() => [])
  );
  const [markedForReview, setMarkedForReview] = useState(
    quizData.map(() => [])
  );

  const currentSection = quizData[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

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
        quizData[currentSectionIndex - 1].questions.length - 1
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < quizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < quizData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

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
  ];
  const UserProfile = ({ user }) => {
    // Ensure the user object is defined before accessing its properties
    if (!user) {
      return null; // Return nothing or a fallback UI if user is undefined or null
    }

    const getInitials = (name) => {
      if (!name) return ""; // In case name is undefined or empty
      const nameParts = name.split(" ");
      const initials = nameParts
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
      return initials;
    };

    return (
      <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
        {/* User Profile Image or Initials */}
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

        {/* User Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>{" "}
          {/* e.g., Student */}
        </div>
      </div>
    );
  };

  const LanguageDropdown = () => {
    const [language, setLanguage] = useState("en"); // Default language

    const handleLanguageChange = (e) => {
      const selectedLanguage = e.target.value;
      setLanguage(selectedLanguage);
      // Call a function or API to change the app language based on selectedLanguage
    };

    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
        }}
      >
        <select
          style={{
            cursor: "pointer",
            width: "100%",
            border: "none",
            backgroundColor: "transparent",
          }}
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          {/* Add more languages as needed */}
        </select>
      </div>
    );
  };
  const Timer = () => {
    const totalTime = 10 * 60; // 10 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const warningTime = 1 * 60; // Time remaining when warning starts (1 minute)
  
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
    const progressColor = timeLeft > warningTime ? "#007bff" : "#ef4444"; // Blue for normal, red for warning
  
    return (
      <div
        className="relative w-16 h-16 flex items-center justify-center"
        style={{
          background: `conic-gradient(${progressColor} ${percentage}%, #e6e6e6 ${percentage}%)`, // Start from 100% and decrease to 0%
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
    <div className="flex flex-col items-center bg-gray-100 p-4 min-h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full max-w-full">
        <div className="lg:col-span-9 col-span-full bg-white rounded-lg shadow-lg">
          {!submitted ? (
            <>
              {/* Section Navigation */}
              <div className="col-span-full flex flex-row grid grid-cols-4 space-x-4 py-4 px-8 bg-gray-100 rounded-lg shadow-md">
                {quizData.map((section, index) => (
                  <button
                    key={index}
                    className={`flex items-center col-span-1  py-3 px-4 rounded-lg transition duration-300 ${
                      currentSectionIndex === index
                        ? "bg-blue-700 text-white font-semibold shadow-lg"
                        : "bg-white text-blue-700 hover:bg-blue-100 hover:shadow-sm"
                    }`}
                    onClick={() => handleSectionChange(index)}
                  >
                    <span className="mr-3 md:text-xs xl:text-lg ">
                      {sectionIcons[index]}
                    </span>
                    <span>{section.section}</span>
                  </button>
                ))}
              </div>

              {/* Header with Profile, Marks, Language, and Timer */}
              <div className="border items-center grid grid-cols-12 space-x-1 py-4 px-8 bg-white rounded-lg shadow-md">
                <div className="col-span-3">
                  <UserProfile user={user} />
                </div>
                <div className="col-span-1"/>
                
                <div className="col-span-4  flex items-center space-x-4">
                  <div className="flex items-center justify-center p-3 bg-green-200 text-green-700 rounded-xl">
                    <h2 className="font-semibold">+4 marks</h2>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-red-200 text-red-700 rounded-xl">
                    <h2 className="font-semibold">-1 marks</h2>
                  </div>
                </div>
                <div className="col-span-2 space-x-2 flex flex-row items-center justify-center">
                  <span className="text-[#007bff]">View in: </span>
                  <LanguageDropdown />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Timer />
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-6">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-lg font-medium mb-8">
                  {currentQuestion.question}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {currentQuestion.options.map((option, index) => (
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
                      <span className="text-gray-800 font-medium">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-12 items-center  mt-[20%]">
                  <button
                    onClick={handleMarkForReview}
                    className="bg-red-500 text-white px-5 py-3 col-span-2 rounded-lg shadow-md hover:bg-red-600"
                  >
                    Mark for Review
                  </button>
                  <div className="col-span-2" />
                  <div className="grid grid-cols-2 col-span-4 items-center space-x-4  gap-10">
                    <button
                      onClick={handlePrevious}
                      disabled={
                        currentQuestionIndex === 0 && currentSectionIndex === 0
                      }
                      className={`px-5 py-3 col-span-1 rounded-lg shadow-md ${
                        currentQuestionIndex === 0 && currentSectionIndex === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={
                        currentQuestionIndex ===
                          currentSection.questions.length - 1 &&
                        currentSectionIndex === quizData.length - 1
                      }
                      className={`px-5 py-3 rounded-lg col-span-1 shadow-md ${
                        currentQuestionIndex ===
                          currentSection.questions.length - 1 &&
                        currentSectionIndex === quizData.length - 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="col-span-2" />

                  <button
                    onClick={handleSubmitNext}
                    disabled={
                      currentQuestionIndex ===
                        currentSection.questions.length - 1 &&
                      currentSectionIndex === quizData.length - 1
                    }
                    className={`px-5 py-3 col-span-2 rounded-lg shadow-md ${
                      currentQuestionIndex ===
                        currentSection.questions.length - 1 &&
                      currentSectionIndex === quizData.length - 1
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
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-600">
                Quiz Submitted!
              </h2>
              <p className="mt-4 text-lg">
                Your Score: {score} out of{" "}
                {quizData.reduce(
                  (total, section) => total + section.questions.length,
                  0
                )}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 col-span-full space-y-3">
          <QuestionNavigation
            questions={currentSection.questions}
            selectedQuestionIndex={currentQuestionIndex}
            onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
            onSubmit={() => {
              let calculatedScore = 0;
              quizData.forEach((section, sectionIndex) => {
                section.questions.forEach((question, questionIndex) => {
                  if (
                    answeredQuestions[sectionIndex]?.[questionIndex] ===
                    question.correctAnswer
                  ) {
                    calculatedScore++;
                  }
                });
              });
              setScore(calculatedScore);
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
