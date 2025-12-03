import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import QuestionNavigation from "../Mock/navigation";
import MobileQuizLayout from "./MobileQuizLayout";
import config from "../../../config";
import Timer from "../Mock/Timer";
import UserProfile from "../Mock/UserProfile";
import { StaticMathField } from "react-mathquill";

const MockDemo = () => {
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "",
  };
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0);
  
  // Get test ID and language from localStorage
  const testId = localStorage.getItem("selectedTestId");
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "ENGLISH";
  
  // Track time spent per question
  const questionStartTimeRef = useRef(Date.now());
  const [questionTimeSpent, setQuestionTimeSpent] = useState({});
  const [testStartTime] = useState(Date.now());

  console.log("API Params - Test ID:", testId, "Language:", selectedLanguage);

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        if (!testId) {
          console.error("No test ID found");
          return;
        }

        console.log("API Call - Test ID:", testId, "Language:", selectedLanguage);
        
        const response = await fetch(
          `${config.apiUrl}/tests/${testId}/with-questions/${selectedLanguage}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Transform the new API response format to match existing structure
        if (result) {
          let transformedData = [];
          
          // Check if hasSubjectGroups is true
          if (result.hasSubjectGroups && result.questionsBySubject) {
            // Group by subject
            Object.entries(result.questionsBySubject).forEach(([subjectName, questions]) => {
              if (questions && questions.length > 0) {
                transformedData.push({
                  subject: subjectName,
                  no_of_questions: questions.length,
                  questions: questions.map((question, index) => ({
                    id: question.id,
                    question: question.questionText || null,
                    question2: question.questionImageUrl || null,
                    marks: question.marks || 1.0,
                    negativeMarks: result.negativeMark || 0,
                    subject: subjectName,
                    options: question.options ? question.options.map(option => option.optionText) : [],
                    files: question.options ? question.options.map(option => option.optionImageUrl) : [],
                    // Store original question data with option IDs for submission
                    originalQuestion: question,
                    optionsWithIds: question.options || []
                  }))
                });
              }
            });
          } else {
            // Single subject test
            transformedData = [
              {
                subject: result.subjectName || "General",
                no_of_questions: result.totalQuestions || (result.questions ? result.questions.length : 0),
                questions: result.questions ? result.questions.map((question, index) => ({
                  id: question.id,
                  question: question.questionText || null,
                  question2: question.questionImageUrl || null,
                  marks: question.marks || 1.0,
                  negativeMarks: result.negativeMark || 0,
                  subject: result.subjectName || "General",
                  options: question.options ? question.options.map(option => option.optionText) : [],
                  files: question.options ? question.options.map(option => option.optionImageUrl) : [],
                  // Store original question data with option IDs for submission
                  originalQuestion: question,
                  optionsWithIds: question.options || []
                })) : []
              }
            ];
          }

          setMockTestData(transformedData);
          
          // Set timer duration
          if (result.durationMinutes) {
            setTimerDuration(result.durationMinutes);
          }

          console.log("Transformed Data:", transformedData);
        }
      } catch (error) {
        console.error("Error fetching mock test data:", error);
      }
    };

    if (testId) {
      fetchMockTests();
    }
  }, [testId, selectedLanguage, token]);

  // Track time when question changes
  useEffect(() => {
    // Record time spent on previous question
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - questionStartTimeRef.current) / 1000); // Convert to seconds
    
    if (currentQuestionIndex > 0 || currentSectionIndex > 0) {
      // Calculate global question index
      let globalQuestionIndex = currentQuestionIndex;
      for (let i = 0; i < currentSectionIndex; i++) {
        globalQuestionIndex += mockTestData[i]?.questions?.length || 0;
      }
      
      setQuestionTimeSpent(prev => ({
        ...prev,
        [globalQuestionIndex - 1]: timeSpent
      }));
      
      // Store in localStorage
      localStorage.setItem("questionTimeSpent", JSON.stringify({
        ...JSON.parse(localStorage.getItem("questionTimeSpent") || "{}"),
        [globalQuestionIndex - 1]: timeSpent
      }));
    }

    // Reset timer for current question
    questionStartTimeRef.current = currentTime;
  }, [currentQuestionIndex, currentSectionIndex, mockTestData]);

  // Debugging
  useEffect(() => {
    console.log("Timer Duration:", timerDuration);
    console.log("Mock Test Data:", mockTestData);
    console.log("Question Time Spent:", questionTimeSpent);
  }, [timerDuration, mockTestData, questionTimeSpent]);

  const [answeredQuestions, setAnsweredQuestions] = useState(
    mockTestData.map((subject) => new Array(subject.no_of_questions).fill(null))
  );

  const [markedForReview, setMarkedForReview] = useState(
    mockTestData.map((subject) =>
      new Array(subject.no_of_questions).fill(false)
    )
  );

  useEffect(() => {
    // When mockTestData is fetched, update the answeredQuestions and markedForReview state
    if (mockTestData.length > 0) {
      setAnsweredQuestions(
        mockTestData.map((subject) =>
          new Array(subject.no_of_questions).fill(null)
        )
      );
      setMarkedForReview(
        mockTestData.map((subject) =>
          new Array(subject.no_of_questions).fill(false)
        )
      );
    }
  }, [mockTestData]);

  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );

  const currentSection = mockTestData[currentSectionIndex] || {};
  const currentQuestion = currentSection.questions
    ? currentSection.questions[currentQuestionIndex]
    : null;

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
        mockTestData[currentSectionIndex - 1].questions.length - 1
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < mockTestData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const isTestSubmitted = localStorage.getItem("submissionResult");
      const submissionInProgress = localStorage.getItem("submissionInProgress");

      if (submissionInProgress === "true" || isTestSubmitted) return;

      event.preventDefault();
      event.returnValue = "Are you sure you want to refresh?";
    };

    const handleUnload = () => {
      const submissionInProgress = localStorage.getItem("submissionInProgress");

      if (submissionInProgress !== "true") {
        localStorage.removeItem("submissionResult");
        localStorage.removeItem("submittedData");
        localStorage.removeItem("selectedTestDetails");
        localStorage.removeItem("questionTimeSpent");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const handleSubmitNext = () => {
    try {
      const storedData =
        JSON.parse(localStorage.getItem("submittedData")) || {};

      const currentSection = mockTestData[currentSectionIndex];
      const currentQuestion =
        currentSection?.questions[currentQuestionIndex] || {};

      const userAnswer =
        answeredQuestions[currentSectionIndex]?.[currentQuestionIndex] || {};

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User data not found. Please log in again.");
        return;
      }

      const student_id = user.id;
      const sectionName = currentSection?.subject || "Default Section";

      if (!storedData[sectionName]) {
        storedData[sectionName] = {};
      }

      if (!storedData[sectionName].questions) {
        storedData[sectionName].questions = {};
      }

      if (!Array.isArray(storedData[sectionName].questions)) {
        storedData[sectionName].questions = [];
      }

      // Determine selected_answer and selected_answer_2 based on userAnswer
      const selectedAnswer =
        typeof userAnswer === "string" &&
        !userAnswer.startsWith("http")
          ? userAnswer
          : null;
      const selectedAnswer2 =
        typeof userAnswer === "string" &&
        userAnswer.startsWith("http")
          ? userAnswer
          : null;

      // Find the selected option ID
      let selectedOptionId = null;
      if (currentQuestion.optionsWithIds && userAnswer) {
        const selectedOptionIndex = currentQuestion.options.indexOf(userAnswer);
        if (selectedOptionIndex !== -1 && currentQuestion.optionsWithIds[selectedOptionIndex]) {
          selectedOptionId = currentQuestion.optionsWithIds[selectedOptionIndex].id;
        }
      }

      // Calculate global question index for time tracking
      let globalQuestionIndex = currentQuestionIndex;
      for (let i = 0; i < currentSectionIndex; i++) {
        globalQuestionIndex += mockTestData[i]?.questions?.length || 0;
      }
      
      const timeSpent = questionTimeSpent[globalQuestionIndex] || 0;

      // Update the selected answer for the current question
      storedData[sectionName].questions = [
        ...storedData[sectionName].questions.filter(
          (q) => q.question !== currentQuestion.id
        ),
        {
          question: currentQuestion.id,
          selected_answer: selectedAnswer,
          selected_answer_2: selectedAnswer2,
          student: student_id,
          language: selectedLanguage,
          selected_option_id: selectedOptionId, // Store option ID for new API
          time_spent: timeSpent // Store time spent in seconds
        },
      ];

      localStorage.setItem("submittedData", JSON.stringify(storedData));
      localStorage.setItem("testStartTime", testStartTime.toString());

      if (currentQuestionIndex < currentSection.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentSectionIndex < mockTestData.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);

        const nextSubject =
          mockTestData[currentSectionIndex + 1]?.subject ||
          "Unknown Subject";
        setSelectedSubject(nextSubject);
      } else {
        console.log("All sections and questions completed.");
      }
    } catch (error) {
      console.error("Error in handleSubmitNext:", error);
      alert("An error occurred while saving your answer. Please try again.");
    }
  };

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    (currentSection?.questions?.length || 0) > 0 &&
    currentQuestionIndex === (currentSection?.questions?.length || 0) - 1;
  const isLastSection =
    (mockTestData?.length || 0) > 0 &&
    currentSectionIndex === (mockTestData?.length || 0) - 1;

  const handleSectionChange = (sectionIndex, subject) => {
    setCurrentSectionIndex(sectionIndex);
    setSelectedSubject(subject);
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

  localStorage.setItem("timerDuration", timerDuration);

  const filteredSections = mockTestData.filter((section) =>
    section.questions.some((q) => q.subject === selectedSubject)
  );

  useEffect(() => {
    if (
      mockTestData.length > 0 &&
      mockTestData[currentSectionIndex]?.questions.length > 0
    ) {
      const activeSubject =
        mockTestData[currentSectionIndex]?.subject ||
        "Unknown Subject";
      setSelectedSubject(activeSubject);
    }
  }, [mockTestData, currentSectionIndex]);

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
      mockTestData={mockTestData}
      currentSection={mockTestData[currentSectionIndex]}
      currentQuestion={
        mockTestData[currentSectionIndex]?.questions[currentQuestionIndex]
      }
      setCurrentSectionIndex={setCurrentSectionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answeredQuestions={answeredQuestions}
      markedForReview={markedForReview}
      selectedOption={selectedOption}
    />
  ) : (
    <div className="flex flex-col items-center bg-gray-100 min-h-full">
      <div className="grid lg:grid-cols-12 gap-4 w-full max-w-full">
        <div className="lg:col-span-9 col-span-full bg-white rounded-lg shadow-lg">
          <>
            {/* Section Navigation */}
            <div className="col-span-full grid grid-cols-4 space-x-4 py-4 px-8 bg-gray-100 rounded-lg shadow-md">
              {mockTestData.map((section, sectionIndex) => {
                const subject = section.subject;

                return (
                  <button
                    key={`${sectionIndex}`}
                    className={`flex items-center col-span-1 py-3 px-4 rounded-lg transition duration-300 ${
                      currentSectionIndex === sectionIndex &&
                      selectedSubject === subject
                        ? "bg-blue-700 text-white font-semibold shadow-lg"
                        : "bg-white text-blue-700 hover:bg-blue-100 hover:shadow-sm"
                    }`}
                    onClick={() => handleSectionChange(sectionIndex, subject)}
                  >
                    <span>{subject || "Unknown Subject"}</span>
                  </button>
                );
              })}
            </div>

            {/* Header with Profile, Marks, Language, and Timer */}
            <div className="border items-center grid grid-cols-12 space-x-1 py-4 px-8 bg-white rounded-lg shadow-md">
              <div className="col-span-3">
                <UserProfile user={user} />
              </div>

              <div className="col-span-2" />

              <div className="col-span-5 flex items-center space-x-4">
                {mockTestData[currentSectionIndex]?.questions[0]?.marks && (
                  <div className="flex items-center justify-center p-3 bg-green-200 text-green-700 rounded-xl">
                    <h2 className="font-semibold">
                      +{mockTestData[currentSectionIndex]?.questions[0]?.marks}{" "}
                      marks
                    </h2>
                  </div>
                )}
                {mockTestData[currentSectionIndex]?.questions[0]
                  ?.negativeMarks && (
                  <div className="flex items-center justify-center p-3 bg-red-200 text-red-700 rounded-xl">
                    <h2 className="font-semibold">
                      {
                        mockTestData[currentSectionIndex]?.questions[0]
                          ?.negativeMarks
                      }{" "}
                      marks
                    </h2>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end">
                {timerDuration > 0 && <Timer totalMinutes={timerDuration} />}
              </div>
            </div>

            {/* Question Section */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                Question {currentQuestionIndex + 1}
              </h2>

              <p className="text-lg font-medium mb-8">
                {mockTestData[currentSectionIndex]?.questions[
                  currentQuestionIndex
                ]
                  ? (() => {
                      const currentQuestion =
                        mockTestData[currentSectionIndex]?.questions[
                          currentQuestionIndex
                        ];

                      const formattedQuestion =
                        currentQuestion?.question
                          ?.replace(/\\n/g, "\n")
                          ?.split("\n") || [];

                      return (
                        <>
                          {formattedQuestion.map((line, index) => (
                            <p
                              key={index}
                              className="mb-2 flex flex-wrap items-center gap-2"
                            >
                              {line.split(/(\$[^$]+\$)/g).map((part, i) =>
                                /^\$[^$]+\$$/.test(part) ? (
                                  <StaticMathField key={i}>
                                    {part.slice(1, -1)}
                                  </StaticMathField>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                            </p>
                          ))}

                          {currentQuestion?.question2 ? (
                            currentQuestion.question2.startsWith("http") ? (
                              <img
                                src={currentQuestion.question2}
                                alt="Additional question"
                                className="max-w-full max-h-24 object-contain mt-4"
                              />
                            ) : (
                              <p className="mt-2">
                                {currentQuestion.question2}
                              </p>
                            )
                          ) : null}
                        </>
                      );
                    })()
                  : "Loading..."}
              </p>

              {/* Options */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                {mockTestData[currentSectionIndex]?.questions[currentQuestionIndex] ? (
                  (() => {
                    const currentQuestion =
                      mockTestData[currentSectionIndex]?.questions[currentQuestionIndex];

                    const cleanedOptions = currentQuestion?.options?.filter(
                      (option) =>
                        option &&
                        option.trim() !== "" &&
                        option.trim().toLowerCase() !== "none"
                    );

                    const cleanedFiles = currentQuestion?.files?.filter(
                      (file) =>
                        file &&
                        file !== null &&
                        file.trim() !== "" &&
                        file.trim().toLowerCase() !== "none"
                    );

                    const displayItems =
                      cleanedFiles?.length > 0 ? cleanedFiles : cleanedOptions;

                    return displayItems?.map((item, index) => {
                      const isFile = item && item.startsWith("http");
                      const optionText = isFile
                        ? cleanedOptions?.[index]?.trim() || null
                        : item?.trim() || null;

                      if (!item || item.trim().toLowerCase() === "none") return null;

                      return (
                        <label
                          key={index}
                          className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition duration-200 transform ${
                            selectedOption === item
                              ? "bg-blue-200 border-blue-800 shadow-md"
                              : "hover:bg-gray-50 hover:shadow-sm"
                          }`}
                        >
                          <input
                            type="radio"
                            name="option"
                            value={item}
                            checked={selectedOption === item}
                            onChange={() => handleOptionChange(item)}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center">
                            {isFile && (
                              <img
                                src={item}
                                alt={`Option ${index + 1}`}
                                className="max-w-full max-h-24 object-contain mb-2"
                              />
                            )}
                            {optionText && (
                              <div className="text-gray-800 font-medium text-center">
                                {optionText
                                  ?.replace(/\\n/g, "\n")
                                  ?.split("\n")
                                  ?.map((line, idx) => (
                                    <p
                                      key={idx}
                                      className="flex flex-wrap items-center gap-2"
                                    >
                                      {line
                                        ?.split(/(\$[^$]+\$)/g)
                                        ?.map((part, i) =>
                                          /^\$[^$]+\$$/.test(part) ? (
                                            <StaticMathField key={i}>
                                              {part.slice(1, -1)}
                                            </StaticMathField>
                                          ) : (
                                            <span key={i}>{part}</span>
                                          )
                                        )}
                                    </p>
                                  ))}
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    });
                  })()
                ) : (
                  <p>Loading...</p>
                )}
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
                      isFirstQuestion
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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
                    Skip & Next
                  </button>
                </div>
                <div className="col-span-1" />

                <button
                  onClick={handleSubmitNext}
                  className="px-5 py-3 col-span-3 rounded-lg shadow-md bg-green-500 text-white hover:bg-green-600"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </>
        </div>

        {/* Question Navigation Component */}
        <div className="lg:col-span-3 col-span-full space-y-3">
          <QuestionNavigation
            questions={mockTestData[currentSectionIndex]?.questions || []}
            selectedQuestionIndex={currentQuestionIndex}
            onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
            onSubmit={() => setSubmitted(true)}
            sectionName={
              mockTestData[currentSectionIndex]?.subject || "Unknown Subject"
            }
            answeredQuestions={answeredQuestions[currentSectionIndex] || []}
            markedForReview={markedForReview[currentSectionIndex] || []}
            questionTimeSpent={questionTimeSpent}
          />
        </div>
      </div>
    </div>
  );
};

export default MockDemo;