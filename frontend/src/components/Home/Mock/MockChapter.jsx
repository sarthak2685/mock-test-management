import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
// import { quizData } from "../Mock/quiz";
import ChapterNavigation from "../Mock/ChapterNavigation";
import ChapterMobile from "../Mock/ChapterMobile";
import config from "../../../config";
// import { FaBrain, FaBook, FaCalculator, FaLanguage } from "react-icons/fa"; // Icons for sections
import Timer from "../Mock/Timer";
import UserProfile from "../Mock/UserProfile";

const MockChapter = () => {
  const user = {
    name: "John Doe",
    role: "Student",
    profileImage: "", // Empty string or null means it will show initials
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  //const [students, setStudents] = useState([]);
  //const [error, setError] = useState("");

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const institueName = S.institute_name;

  // const sectionIcons = [
  //   <FaBrain />,
  //   <FaBook />,
  //   <FaCalculator />,
  //   <FaLanguage />,
  //   <FaLanguage />,
  // ];

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

  // const [answeredQuestions, setAnsweredQuestions] = useState(
  //   quizData.map(() => [])
  // );

  // const [markedForReview, setMarkedForReview] = useState(
  //   quizData.map(() => [])
  // );

  // const [selectedSubject, setSelectedSubject] = useState(
  //   localStorage.getItem("selectedOptionalSubject") || ""
  // );

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

  const [mockTestData, setMockTestData] = useState([]);
  const [timerDuration, setTimerDuration] = useState(0); // State for timer
  const SubjectId = localStorage.getItem("selectedSubjectId");

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details-based-on-subjects/?subject_id=${SubjectId}&institute_name=${institueName}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mock test data");
        }

        const result = await response.json();
        console.log("Raw API Response:", result);

        // Retrieve selected chapter from localStorage
        const selectedChapter = localStorage.getItem("selectedChapter");
        console.log("Selected Chapter from LocalStorage:", selectedChapter);

        if (result && result.data && result.data.chapters) {
          const groupedTests = [];

          // Iterate through each chapter
          Object.keys(result.data.chapters).forEach((chapterName) => {
            const chapter = result.data.chapters[chapterName];

            // Only process the selected chapter
            if (selectedChapter && chapterName === selectedChapter) {
              let currentTestName = "";
              let currentTestDuration = 60; // Default duration if not provided

              // Iterate through each test or question in the chapter
              chapter.forEach((testDetails) => {
                if (testDetails.test_name && testDetails.duration) {
                  // Update the current test name and duration
                  currentTestName = testDetails.test_name;
                  currentTestDuration = parseInt(testDetails.duration, 10);
                  currentTestDuration =
                    isNaN(currentTestDuration) || currentTestDuration <= 0
                      ? 60
                      : currentTestDuration;
                }

                if (testDetails.id) {
                  // Create or find the test entry in groupedTests
                  let test = groupedTests.find(
                    (t) => t.test_name === currentTestName
                  );
                  if (!test) {
                    test = {
                      test_name: currentTestName,
                      exam_duration: currentTestDuration,
                      questions: [],
                    };
                    groupedTests.push(test);
                  }

                  // Set the timer duration once (based on the first valid test)
                  if (groupedTests.length === 1) {
                    setTimerDuration(currentTestDuration);
                  }

                  // Add the question to the test
                  test.questions.push({
                    id: testDetails.id,
                    question: testDetails.question || null, // Primary question
                    question_1: testDetails.question_1 || null, // Additional question
                    options: [
                      testDetails.option_1,
                      testDetails.option_2,
                      testDetails.option_3,
                      testDetails.option_4,
                    ],
                    files: [
                      testDetails.file_1,
                      testDetails.file_2,
                      testDetails.file_3,
                      testDetails.file_4,
                    ].filter(Boolean), // Include files only if they exist
                    correctAnswer:
                      testDetails.correct_answer || testDetails.correct_ans2, // Include fallback for correct_ans2
                    marks: testDetails.marks,
                    negativeMarks: testDetails.negative_marks,
                    subjects_details: testDetails.subjects_details,
                    test_name: currentTestName, // Associate the test name with each question
                    duration: currentTestDuration, // Associate the duration with each question
                  });
                }
              });
            }
          });

          console.log("Mapped Tests Data for Selected Chapter:", groupedTests);
          setMockTestData(groupedTests);
        } else {
          console.error(
            "Chapters field is missing or malformed in the API response"
          );
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
    console.log("Updated Timer Duration:", timerDuration);
    console.log("Updated mockTestData:", mockTestData);
  }, [timerDuration, mockTestData]);

  const [answeredQuestions, setAnsweredQuestions] = useState(
    mockTestData.map((subject) => new Array(subject.no_of_questions).fill(null)) // Initialize with null (or any default value)
  );

  const [markedForReview, setMarkedForReview] = useState(
    mockTestData.map((subject) =>
      new Array(subject.no_of_questions).fill(false)
    ) // Initialize with false (not marked for review)
  );

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
      // Ensure the previous structure exists
      const updatedAnswers = [...prevAnswers];

      // Initialize the current section if it doesn't exist
      if (!updatedAnswers[currentSectionIndex]) {
        updatedAnswers[currentSectionIndex] = [];
      }

      // Update the specific question
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

      console.log("User Answer:", userAnswer);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User data not found. Please log in again.");
        return;
      }

      const student_id = user.id;
      const sectionName = currentSection?.test_name || "Default Section";

      // Ensure the section exists in stored data
      if (!storedData[sectionName]) {
        storedData[sectionName] = { questions: [] }; // Initialize section with empty questions array
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

      console.log("Selected Answer:", selectedAnswer);
      console.log("Selected Answer 2:", selectedAnswer2);

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
        },
      ];

      // Save the updated structure to localStorage
      localStorage.setItem("submittedData", JSON.stringify(storedData));

      console.log("Updated LocalStorage Data:", storedData);

      // Move to the next question or section
      if (currentQuestionIndex < currentSection.questions.length - 1) {
        // Move to the next question in the current section
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentSectionIndex < mockTestData.length - 1) {
        // Move to the next section and reset question index
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);

        // Update the selected subject for the new section
        // const nextSubject =
        //   mockTestData[currentSectionIndex + 1]?.test_name || "Unknown Subject";
        // setSelectedSubject(nextSubject); // Update the selected subject dynamically
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

  //   const handleSectionChange = (sectionIndex, subject) => {
  //     setCurrentSectionIndex(sectionIndex); // Update the active section index
  //     setSelectedSubject(subject); // Update the active subject
  //   };

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

  return isMobile ? (
    <ChapterMobile
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
                {mockTestData.length > 0 && (
                  <Timer
                    totalMinutes={Number(mockTestData[0]?.exam_duration) || 0}
                  />
                )}
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
                      const baseUrl = "http://mockexam.pythonanywhere.com";
                      const defaultFileValue =
                        "/media/uploads/questions/option_4_uFtm5qj.png";

                      return (
                        <>
                          {/* Main question */}
                          <span>
                            {currentQuestion?.question ||
                              "No question available"}
                          </span>
                          <br />

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
                              <span>{currentQuestion.question_1}</span>
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
                    const baseUrl = "http://mockexam.pythonanywhere.com";
                    const defaultFileValue =
                      "/media/uploads/questions/option_4_uFtm5qj.png";

                    // Filter files to exclude default values
                    const validFiles = currentQuestion?.files?.filter(
                      (file) => file && file !== defaultFileValue
                    );

                    // Determine whether to show files or options
                    const displayItems =
                      validFiles?.length > 0
                        ? validFiles
                        : currentQuestion?.options;

                    // Render the selected items
                    return displayItems?.map((item, index) =>
                      item ? (
                        <label
                          key={index}
                          className={`border border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition duration-200 transform ${
                            selectedOption === item
                              ? "bg-blue-50 border-blue-500 shadow-md"
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
                          {/* Display image if item is a file, otherwise display text */}
                          {item.startsWith("/media/uploads/") ? (
                            <img
                              src={`${config.apiUrl}${item}`}
                              alt={`Option ${index + 1}`}
                              className="max-w-full max-h-24 object-contain"
                            />
                          ) : (
                            <span className="text-gray-800 font-medium">
                              {item}
                            </span>
                          )}
                        </label>
                      ) : null
                    );
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
                    // :
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
          <ChapterNavigation
            questions={mockTestData[currentSectionIndex]?.questions || []}
            selectedQuestionIndex={currentQuestionIndex}
            onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
            onSubmit={() => setSubmitted(true)}
            sectionName={
              mockTestData[currentSectionIndex]?.test_name || "Unknown Test"
            }
            answeredQuestions={answeredQuestions[currentSectionIndex] || []}
            markedForReview={markedForReview[currentSectionIndex] || []}
          />
        </div>
      </div>
    </div>
  );
};

export default MockChapter;
