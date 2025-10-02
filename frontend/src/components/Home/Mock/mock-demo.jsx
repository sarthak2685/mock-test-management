import React, { useState, useEffect } from "react";
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
  const institueName = S.institute_name;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const storedTestName = localStorage.getItem("selectedTestName");

  const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0);
  const SubjectId = localStorage.getItem("selectedSubjectId");
  
  // Get language parameters - use short codes
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  const optional = localStorage.getItem("nonSelectedLanguage") || "";
  
  console.log("Language Params - Selected:", selectedLanguage, "Optional:", optional);

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        console.log("API Call - Language:", selectedLanguage, "Optional:", optional);
        
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details/?exam_id=${SubjectId}&institute_name=${institueName}&optional=${optional}&language=${selectedLanguage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }

        const result = await response.json();

        if (result.data) {
          const mockTestKeys = Object.keys(result.data);
          const mockTestKey = mockTestKeys.find(
            (key) => key !== "exam_domain" && key === storedTestName
          );

          if (mockTestKey) {
            const testDetails = result.data[mockTestKey];

            if (testDetails) {
              setTimerDuration(Number(testDetails.exam_duration) || 0);

              const groupedTests = Object.entries(testDetails)
                .filter(
                  ([key]) =>
                    key !== "exam_duration" &&
                    key !== "total_marks" &&
                    key !== "total_questions" &&
                    key !== "_positive_marks" &&
                    key !== "_negative_marks"
                )
                .map(([subjectName, subjectDetails]) => {
                  let questions = [];

                  if (
                    Array.isArray(subjectDetails.questions) &&
                    subjectDetails.questions.length > 0
                  ) {
                    questions = subjectDetails.questions.map((question) => ({
                      id: question.id,
                      question: question.question,
                      question2: question.question2,
                      marks: question.positive_marks,
                      negativeMarks: question.negative_marks,
                      subject: question.subject || subjectName,
                      options: [
                        question.option_1,
                        question.option_2,
                        question.option_3,
                        question.option_4,
                        question.option_5,
                      ].filter(option => option && option.trim() !== ""),
                      files: [
                        question.file_1,
                        question.file_2,
                        question.file_3,
                        question.file_4,
                        question.file_5,
                      ].filter(file => file && file.trim() !== ""),
                    }));
                  }

                  return {
                    subject: subjectName,
                    no_of_questions: subjectDetails.no_of_questions,
                    questions,
                  };
                });

              setMockTestData(groupedTests);
              setSelectedSubject(groupedTests[0]?.subject || "");

              const uniqueSubjects = [
                ...new Set(groupedTests.map((test) => test.subject)),
              ];

              localStorage.setItem(
                "uniqueSubjects",
                JSON.stringify(uniqueSubjects)
              );
            } else {
              console.error("Mock test data is missing");
            }
          } else {
            console.error(
              "Stored test name does not match any test in the API response"
            );
          }
        } else {
          console.error("Data field is missing from the API response");
        }
      } catch (error) {
        console.error("Error fetching mock test data:", error);
      }
    };
    if (SubjectId) {
      fetchMockTests();
    }
  }, [SubjectId, selectedLanguage, optional]);

  useEffect(() => {
    console.log("Timer Duration:", timerDuration);
    console.log("Mock Test Data:", mockTestData);
  }, [timerDuration, mockTestData]);

  const [answeredQuestions, setAnsweredQuestions] = useState(
    mockTestData.map((subject) => new Array(subject.no_of_questions).fill(null))
  );

  const [markedForReview, setMarkedForReview] = useState(
    mockTestData.map((subject) =>
      new Array(subject.no_of_questions).fill(false)
    )
  );

  useEffect(() => {
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

      const selectedAnswer =
        typeof userAnswer === "string" &&
        !userAnswer.startsWith("/media/uploads/")
          ? userAnswer
          : null;
      const selectedAnswer2 =
        typeof userAnswer === "string" &&
        userAnswer.startsWith("/media/uploads/")
          ? userAnswer
          : null;

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
        },
      ];

      localStorage.setItem("submittedData", JSON.stringify(storedData));

      if (currentQuestionIndex < currentSection.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentSectionIndex < mockTestData.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);

        const nextSubject =
          mockTestData[currentSectionIndex + 1]?.questions[0]?.subject ||
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
        mockTestData[currentSectionIndex]?.questions[0]?.subject ||
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
                const uniqueSubjects = [
                  ...new Set(section.questions.map((q) => q.subject)),
                ];

                return uniqueSubjects.map((subject, subjectIndex) => (
                  <button
                    key={`${sectionIndex}-${subjectIndex}`}
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
                ));
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
                      const baseUrl = `${config.apiUrl}`;
                      const defaultFileValue =
                        "/media/uploads/questions/option_4_uFtm5qj.png";

                      const formattedQuestion =
                        currentQuestion?.question
                          .replace(/\\n/g, "\n")
                          .split("\n") || [];

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

                          {currentQuestion?.question2 &&
                          currentQuestion.question2 !== defaultFileValue ? (
                            currentQuestion.question2.startsWith(
                              "/media/uploads/"
                            ) ? (
                              <img
                                src={`${config.apiUrl}${currentQuestion.question2}`}
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

                    const baseUrl = `${config.apiUrl}`;
                    const defaultFileValue = "/media/uploads/questions/option_4_uFtm5qj.png";

                    const cleanedOptions = currentQuestion?.options?.filter(
                      (option) =>
                        option &&
                        option.trim() !== "" &&
                        option.trim().toLowerCase() !== "none"
                    );

                    const cleanedFiles = currentQuestion?.files?.filter(
                      (file) =>
                        file &&
                        file.trim() !== "" &&
                        file !== defaultFileValue &&
                        file.trim().toLowerCase() !== "none"
                    );

                    const displayItems =
                      cleanedFiles?.length > 0 ? cleanedFiles : cleanedOptions;

                    return displayItems?.map((item, index) => {
                      const isFile = item.startsWith("/media/uploads/");
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
                                src={`${baseUrl}${item}`}
                                alt={`Option ${index + 1}`}
                                className="max-w-full max-h-24 object-contain mb-2"
                              />
                            )}
                            {optionText && (
                              <div className="text-gray-800 font-medium text-center">
                                {optionText
                                  .replace(/\\n/g, "\n")
                                  .split("\n")
                                  .map((line, idx) => (
                                    <p
                                      key={idx}
                                      className="flex flex-wrap items-center gap-2"
                                    >
                                      {line
                                        .split(/(\$[^$]+\$)/g)
                                        .map((part, i) =>
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
              mockTestData[currentSectionIndex]?.questions
                ?.filter((question) => question.subject === selectedSubject)
                .map((question) => question.subject)[0] || "Unknown Subject"
            }
            answeredQuestions={answeredQuestions[currentSectionIndex] || []}
            markedForReview={markedForReview[currentSectionIndex] || []}
          />
        </div>
      </div>
    </div>
  );
};

export default MockDemo;