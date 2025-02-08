import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
// import { quizData } from "../Mock/quiz";
import QuestionNavigation from "../Mock/navigation";
import MobileQuizLayout from "./MobileQuizLayout";
import config from "../../../config";
// import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections
import Timer from "../Mock/Timer";
import UserProfile from "../Mock/UserProfile";
import { StaticMathField } from "react-mathquill";

const MockDemo = () => {
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "", // Empty string or null means it will show initials
  };
  const S = JSON.parse(localStorage.getItem("user"));
  const institueName = S.institute_name;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  //const [students, setStudents] = useState([]);
  //const [error, setError] = useState("");

  //const S = JSON.parse(localStorage.getItem("user"));
  //const token = S.token;

  const storedTestName = localStorage.getItem("selectedTestName");

  // const UserProfile = () => {
  //   const [user, setUser] = useState({ name: "Unknown User", role: "Student" }); // Default user state with name and role
  //   useEffect(() => {
  //     // Fetch user details from local storage
  //     const storedData = localStorage.getItem("user"); // Assuming JSON object is stored under this key
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData); // Parse the JSON string
  //         if (parsedData && parsedData.name) {
  //           setUser({ name: parsedData.name, role: parsedData.type }); // Set user name and role (assuming type is role)
  //         }
  //       } catch (error) {
  //         console.error("Error parsing stored user data:", error);
  //         setUser({ name: "Unknown User", role: "Student" }); // Fallback in case of error
  //       }
  //     }
  //   }, []); // Runs once when the component mounts

  //   return (
  //     <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
  //       {/* Render initials based on user name */}
  //       <div className="w-12 h-12 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
  //         <span className="text-lg font-semibold">
  //           {user.name ? user.name.charAt(0).toUpperCase() : "U"}
  //         </span>{" "}
  //         {/* Initial of the name */}
  //       </div>

  //       <div>
  //         <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>{" "}
  //         {/* Display the user's name */}
  //         <p className="text-sm text-gray-500">{user.role}</p>{" "}
  //         {/* Display the user's role */}
  //       </div>
  //     </div>
  //   );
  // };

  const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0); // State for timer
  const SubjectId = localStorage.getItem("selectedSubjectId");
  const optional = localStorage.getItem("nonSelectedLanguage");
  const language = localStorage.getItem("selectedLanguage") || "english";

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details/?exam_id=${SubjectId}&institute_name=${institueName}&optional=${optional}&language=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }

        const result = await response.json();

        if (result.data) {
          // Check if the stored test name exists in the API response
          const mockTestKeys = Object.keys(result.data);
          const mockTestKey = mockTestKeys.find(
            (key) => key !== "exam_domain" && key === storedTestName // Match stored test name
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

                  // Only process questions if they exist
                  if (
                    Array.isArray(subjectDetails.questions) &&
                    subjectDetails.questions.length > 0
                  ) {
                    questions = subjectDetails.questions.map((question) => ({
                      id: question.id,
                      question: question.question,
                      question2: question.question2, // Include question2
                      marks: question.positive_marks,
                      negativeMarks: question.negative_marks,
                      subject: question.subject || subjectName,
                      options: [
                        question.option_1,
                        question.option_2,
                        question.option_3,
                        question.option_4,
                      ], // Dynamically map the options
                      files: [
                        question.file_1,
                        question.file_2,
                        question.file_3,
                        question.file_4,
                      ], // Dynamically map the files
                    }));
                  }

                  return {
                    subject: subjectName,
                    no_of_questions: subjectDetails.no_of_questions,
                    questions, // Only set if there are questions
                  };
                });

              setMockTestData(groupedTests);

              // Set the first subject as the selected subject
              setSelectedSubject(groupedTests[0]?.subject || "");

              // Store unique subjects in local storage
              const uniqueSubjects = [
                ...new Set(groupedTests.map((test) => test.subject)),
              ];


              // Save unique subjects to localStorage
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
  }, [SubjectId]);

  // Debugging: Check the timerDuration and mockTestData
  useEffect(() => {

  }, [timerDuration, mockTestData]);

  // const [answeredQuestions, setAnsweredQuestions] = useState(
  //   quizData.map(() => [])
  // );

  // const [markedForReview, setMarkedForReview] = useState(
  //   quizData.map(() => [])
  // );

  const [answeredQuestions, setAnsweredQuestions] = useState(
    mockTestData.map((subject) => new Array(subject.no_of_questions).fill(null)) // Initialize with null (or any default value)
  );

  const [markedForReview, setMarkedForReview] = useState(
    mockTestData.map((subject) =>
      new Array(subject.no_of_questions).fill(false)
    ) // Initialize with false (not marked for review)
  );

  useEffect(() => {
    // When mockTestData is fetched, update the answeredQuestions and markedForReview state
    if (mockTestData.length > 0) {
      setAnsweredQuestions(
        mockTestData.map((subject) =>
          new Array(subject.no_of_questions).fill(null)
        ) // Reset answered questions for each subject
      );
      setMarkedForReview(
        mockTestData.map((subject) =>
          new Array(subject.no_of_questions).fill(false)
        ) // Reset marked for review for each subject
      );
    }
  }, [mockTestData]); // Re-run whenever mockTestData changes

  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );
  // Function to handle filtered data (to display only relevant sections)
  // const filteredQuizData = quizData.filter((section) => {
  //   if (selectedSubject) {
  //     return (
  //       section.section === "General Intelligence and Reasoning" ||
  //       section.section === "General Awareness" ||
  //       section.section === "Quantitative Aptitude" ||
  //       section.section === selectedSubject
  //     );
  //   }
  //   return true;
  // });

  // Ensure that the current section is correctly assigned based on index
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

      // Prevent warning if submission is in progress or already submitted
      if (submissionInProgress === "true" || isTestSubmitted) return;

      event.preventDefault();
      event.returnValue = "Are you sure you want to refresh?"; // Standard browser warning
    };

    const handleUnload = () => {
      const submissionInProgress = localStorage.getItem("submissionInProgress");

      // Only remove data if the test is NOT being submitted
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
      // Retrieve existing data from localStorage or initialize an empty object
      const storedData =
        JSON.parse(localStorage.getItem("submittedData")) || {};

      // Get the current section and question
      const currentSection = mockTestData[currentSectionIndex];
      const currentQuestion =
        currentSection?.questions[currentQuestionIndex] || {};

      // Fetch the user's answer for the current question
      const userAnswer =
        answeredQuestions[currentSectionIndex]?.[currentQuestionIndex] || {}; // Fetch based on both section and question index

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User data not found. Please log in again.");
        return;
      }

      const student_id = user.id;
      const sectionName = currentSection?.subject || "Default Section";

      // Ensure the section exists in stored data
      if (!storedData[sectionName]) {
        storedData[sectionName] = {}; // Initialize section if not exists
      }

      // If the section already has answers, accumulate them; otherwise, initialize the section with an empty object
      if (!storedData[sectionName].questions) {
        storedData[sectionName].questions = {};
      }

      // Ensure questions is always an array
      if (!Array.isArray(storedData[sectionName].questions)) {
        storedData[sectionName].questions = [];
      }

      // Determine selected_answer and selected_answer_2 based on userAnswer
      const selectedAnswer =
        typeof userAnswer === "string" &&
        !userAnswer.startsWith("/media/uploads/")
          ? userAnswer
          : null; // Assign text answer if it's not an image
      const selectedAnswer2 =
        typeof userAnswer === "string" &&
        userAnswer.startsWith("/media/uploads/")
          ? userAnswer
          : null; // Assign image answer if it's a URL



      // Update the selected answer for the current question
      storedData[sectionName].questions = [
        ...storedData[sectionName].questions.filter(
          (q) => q.question !== currentQuestion.id
        ), // Remove the old entry with the same question ID (if exists)
        {
          question: currentQuestion.id,
          selected_answer: selectedAnswer, // Assign text if present
          selected_answer_2: selectedAnswer2, // Assign image if present
          student: student_id,
          language:language,
        },
      ];

      // Save the updated structure to localStorage
      localStorage.setItem("submittedData", JSON.stringify(storedData));


      // Move to the next question or section
      if (currentQuestionIndex < currentSection.questions.length - 1) {
        // Move to the next question in the current section
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentSectionIndex < mockTestData.length - 1) {
        // Move to the next section and reset question index
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);

        // Update the selected subject for the new section
        const nextSubject =
          mockTestData[currentSectionIndex + 1]?.questions[0]?.subject ||
          "Unknown Subject";
        setSelectedSubject(nextSubject); // Update the selected subject dynamically
      } else {
        // End of all sections and questions
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
    setCurrentSectionIndex(sectionIndex); // Update the active section index
    setSelectedSubject(subject); // Update the active subject
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
  // localStorage.setItem("mockTestData", mockTestData);

  const filteredSections = mockTestData.filter((section) =>
    section.questions.some((q) => q.subject === selectedSubject)
  );


  useEffect(() => {
    // Automatically set the active subject when the section index changes
    if (
      mockTestData.length > 0 &&
      mockTestData[currentSectionIndex]?.questions.length > 0
    ) {
      const activeSubject =
        mockTestData[currentSectionIndex]?.questions[0]?.subject ||
        "Unknown Subject";
      setSelectedSubject(activeSubject); // Set the selected subject dynamically
    }
  }, [mockTestData, currentSectionIndex]); // Re-run the effect when the section index changes

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
      // quizData={quizData} // Pass the fetched data here
      currentSection={mockTestData[currentSectionIndex]} // Adjusted to the fetched data
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
                // Get unique subjects from the section's questions
                const uniqueSubjects = [
                  ...new Set(section.questions.map((q) => q.subject)),
                ];

                return uniqueSubjects.map((subject, subjectIndex) => (
                  <button
                    key={`${sectionIndex}-${subjectIndex}`}
                    className={`flex items-center col-span-1 py-3 px-4 rounded-lg transition duration-300 ${
                      currentSectionIndex === sectionIndex &&
                      selectedSubject === subject
                        ? "bg-blue-700 text-white font-semibold shadow-lg" // Highlight active section
                        : "bg-white text-blue-700 hover:bg-blue-100 hover:shadow-sm" // Inactive sections
                    }`}
                    onClick={() => handleSectionChange(sectionIndex, subject)} // Handle section change
                  >
                    {/* <div className="mr-2">{sectionIcons[sectionIndex]}</div> */}
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

              {/* Log current question */}
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

                      // Replace '\\n' with actual newlines and split into an array
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
                                /^\$[^$]+\$$/.test(part) ? ( // Check if part is LaTeX
                                  <StaticMathField key={i}>
                                    {part.slice(1, -1)}
                                  </StaticMathField>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                            </p>
                          ))}

                          {/* Additional question (question_1), skipping the default value */}
                          {currentQuestion?.question_1 &&
                          currentQuestion.question_1 !== defaultFileValue ? (
                            currentQuestion.question_1.startsWith(
                              "/media/uploads/"
                            ) ? (
                              <img
                                src={`${config.apiUrl}${currentQuestion.question_1}`}
                                alt="Additional question"
                                className="max-w-full max-h-24 object-contain mt-4"
                              />
                            ) : (
                              <p className="mt-2">
                                {currentQuestion.question_1}
                              </p>
                            )
                          ) : null}
                        </>
                      );
                    })()
                  : "Loading..."}
              </p>

              {/* Log options */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                {mockTestData[currentSectionIndex]?.questions[
                  currentQuestionIndex
                ] ? (
                  (() => {
                    const currentQuestion =
                      mockTestData[currentSectionIndex]?.questions[
                        currentQuestionIndex
                      ];

                    const baseUrl = `${config.apiUrl}`;
                    const defaultFileValue =
                      "/media/uploads/questions/option_4_uFtm5qj.png";

                    // Check if valid files exist, excluding the default placeholder
                    const validFiles = currentQuestion?.files?.filter(
                      (file) => file && file !== defaultFileValue
                    );

                    // Use options if no valid files exist
                    const displayItems =
                      validFiles?.length > 0
                        ? validFiles
                        : currentQuestion?.options;

                    return displayItems?.map((item, index) => {
                      const isFile = item.startsWith("/media/uploads/");
                      const optionText =
                        currentQuestion?.options?.[index]?.trim() || null;

                      return item ? (
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
                            {/* Show image if item is a valid file */}
                            {isFile && (
                              <img
                                src={`${baseUrl}${item}`}
                                alt={`Option ${index + 1}`}
                                className="max-w-full max-h-24 object-contain mb-2"
                              />
                            )}
                            {/* Display text with LaTeX and normal text */}
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
                                          /^\$[^$]+\$$/.test(part) ? ( // Check if part is LaTeX
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
                      ) : null;
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
                    Next
                  </button>
                </div>
                <div className="col-span-1" />

                <button
                  onClick={handleSubmitNext}
                  // disabled={isLastQuestion && isLastSection}
                  className={`px-5 py-3 col-span-3 rounded-lg shadow-md ${
                    // isLastQuestion && isLastSection
                    //   ? "bg-green-200 text-green-700 cursor-not-allowed"
                    //   :
                    "bg-green-500 text-white hover:bg-green-600"
                  }`}
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
