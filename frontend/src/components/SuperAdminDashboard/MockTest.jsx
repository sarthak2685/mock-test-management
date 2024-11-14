import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { InlineMath } from "react-katex"; // For inline math rendering
import "katex/dist/katex.min.css"; // KaTeX styles

const institutes = ["Institute A", "Institute B", "Institute C"];
const subjects = ["Mathematics", "Science", "History", "ALL"];
const subtopics = ["Subtopic 1", "Subtopic 2", "Subtopic 3"];
const domains = ["Domain 1", "Domain 2", "Domain 3"];
const chapterOptions = [
  { value: "chapter1", label: "Chapter 1" },
  { value: "chapter2", label: "Chapter 2" },
  { value: "chapter3", label: "Chapter 3" },
  // Add more chapters as needed
];

const MockTestManagement = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mockTests, setMockTests] = useState([]);
  const [newTest, setNewTest] = useState({
    instituteNames: [], // Array for institute names
    domain: "", // String for domain name
    subject: "", // String for subject
    duration: "", // String for duration
    testName: "", // String for test name
    chapter: "ALL", // Default chapter set to "ALL"
    questions: [
      {
        index: 0, // Index for tracking question order
        questionText: "", // Text of the question
        options: [
          // Array of option objects for the question
          { text: "", image: null }, // Option 1
          { text: "", image: null }, // Option 2
          { text: "", image: null }, // Option 3
          { text: "", image: null }, // Option 4
        ],
        correctAnswer: "", // The correct answer for the question
        subtopic: "", // Subtopic associated with the question
      },
    ],
    correctMark: "", // Marks for a correct answer
    negativeMark: "", // Marks to deduct for an incorrect answer
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Starting index for the next question
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMainSubtopic, setShowMainSubtopic] = useState(false);
  const [fileInputValue, setFileInputValue] = useState(""); // Track file input value
  const fileInputRef = useRef(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  //const [questionText, setQuestionText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTestChange = (e) => {
    const { name, value } = e.target;

    // Show main subtopic dropdown when "ALL" is selected in subject dropdown
    if (name === "subject") {
      setShowMainSubtopic(value === "ALL");
    }

    // Update the newTest state
    setNewTest((prevTest) => ({
      ...prevTest,
      [name]: value, // Dynamically set the value of any field
    }));
  };

  const [selectedOptions, setSelectedOptions] = useState([]); // track selected options

  const handleInstituteChange = (options) => {
    // Check if "Select All" or "Deselect All" was clicked
    if (options.some((option) => option.value === "selectAll")) {
      // Select all options (excluding "Select All" and "Deselect All")
      setSelectedOptions(instituteOptions);
      setNewTest({
        ...newTest,
        instituteNames: instituteOptions.map((option) => option.value),
      });
    } else if (options.some((option) => option.value === "deselectAll")) {
      // Deselect all options
      setSelectedOptions([]);
      setNewTest({ ...newTest, instituteNames: [] });
    } else {
      // Otherwise, handle normally
      setSelectedOptions(options);
      const selectedInstitutes = options
        ? options.map((option) => option.value)
        : [];
      setNewTest({ ...newTest, instituteNames: selectedInstitutes });
    }
  };

  const handleQuestionChange = (index, field, value, optionIndex) => {
    const updatedQuestions = [...newTest.questions];

    if (field === "options") {
      updatedQuestions[index].options[optionIndex].text = value; // Update the text of the option
    } else {
      updatedQuestions[index][field] = value;
    }

    // Check if any options' text is empty
    const anyOptionEmpty = updatedQuestions[index].options.some(
      (option) => option.text.trim() === "" // Access 'text' and apply trim() on it
    );

    // Only reset correctAnswer if there's an empty option
    if (anyOptionEmpty) {
      updatedQuestions[index].correctAnswer = "";
    }

    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedQuestions = newTest.questions.map((question, i) =>
          i === index ? { ...question, image: reader.result } : question
        );
        setNewTest({
          ...newTest,
          questions: updatedQuestions,
        });
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      const updatedQuestions = newTest.questions.map((question, i) =>
        i === index ? { ...question, image: null } : question
      );
      setNewTest({
        ...newTest,
        questions: updatedQuestions,
      });
    }
  };

  // Function to add a new question
  {
    /*const addQuestion = () => {
    setNewTest({
      ...newTest,
      questions: [
        ...newTest.questions,
        {
          questionText: "",
          options: [
            { text: "", image: null }, // Option 1: Text + Image
            { text: "", image: null }, // Option 2: Text + Image
            { text: "", image: null }, // Option 3: Text + Image
            { text: "", image: null }, // Option 4: Text + Image
          ],
          correctAnswer: "",
          image: null,
          subtopic: "", // Add subtopic field to the new question
          subject: "", // Add subject field to the new question
        },
      ],
    });
  };*/
  }

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [image, setImage] = useState(null);

  // Function to handle the "Save and Next" button
  const handleSaveAndNext = () => {
    if (!newTest || !newTest.subject || !Array.isArray(newTest.questions)) {
      console.error("Subject or questions are missing in newTest.");
      return;
    }

    if (
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= newTest.questions.length
    ) {
      console.error("Invalid currentQuestionIndex:", currentQuestionIndex);
      return;
    }

    const currentQuestion = newTest.questions[currentQuestionIndex];
    const hasEmptyOption = currentQuestion.options.some(
      (option) => typeof option === "string" && option.trim() === ""
    );

    const isValid =
      currentQuestion.questionText &&
      !hasEmptyOption &&
      currentQuestion.correctAnswer;

    if (!isValid) {
      alert(
        "Please fill in all the required fields (Question Text, Options, Correct Answer) before proceeding."
      );
      return;
    }

    // Copy questions array to modify
    const savedQuestions = [...newTest.questions];

    // Update the current question data and add the index field
    savedQuestions[currentQuestionIndex] = {
      ...savedQuestions[currentQuestionIndex],
      index: currentQuestionIndex, // Add index here
      questionText: currentQuestion.questionText,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      subtopic: currentQuestion.subtopic,
      image: currentQuestion.image,
    };

    // Log the saved question data, now including the index field
    console.log(
      `Saved Question Data for Question ${currentQuestionIndex + 1}:`,
      savedQuestions[currentQuestionIndex]
    );

    // Prepare for the next question
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (savedQuestions.length <= nextQuestionIndex) {
      savedQuestions.push({
        index: nextQuestionIndex, // Add index for the new question
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        subtopic: "",
        image: null,
      });
    }

    setNewTest({
      ...newTest,
      questions: savedQuestions,
    });

    setCurrentQuestionIndex(nextQuestionIndex);
    setCorrectAnswer("");
    setDropdownOpen(false);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setSubtopic("");
    setImage(null);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions.splice(index, 1);
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleAddTest = () => {
    const allQuestionsValid = newTest.questions.every((question) => {
      if (newTest.subject === "ALL") {
        return question.subtopic !== "";
      }
      return true;
    });

    if (!allQuestionsValid) {
      alert(
        "Please select a subtopic for each question when subject is 'ALL'."
      );
      return;
    }

    setShowConfirmationModal(true); // Show modal if validation passes
  };

  const confirmSubmission = () => {
    if (mockTests) {
      setMockTests([...mockTests, { ...newTest, id: mockTests.length + 1 }]);
      setShowModal(false);
      navigate("/view"); // Navigate to the view page
    } else {
      console.error("mockTests is not defined or initialized as an array.");
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const isDropdownEnabled = newTest.questions[0].options.some(
    (option) => (option.text && option.text.trim() !== "") || option.image
  );

  // Function to delete image for a specific option
  const deleteOptionImage = (currentQuestionIndex, optionIndex) => {
    // Clear the image from the option
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[currentQuestionIndex].options[optionIndex].image = null;
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  // Handle selection of an answer from dropdown
  const handleSelectChange = (option) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      correctAnswer: option, // Set the selected option as the correct answer
    };
    setNewTest({
      ...newTest,
      questions: updatedQuestions,
    });
    setDropdownOpen(false); // Close dropdown after selection
  };

  const handleOptionTextChange = (questionIndex, optionIndex, newText) => {
    // Create a deep copy of the questions array to maintain immutability
    const updatedQuestions = newTest.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        // Clone the question and update the specific option's text
        return {
          ...question,
          options: question.options.map((option, oIndex) =>
            oIndex === optionIndex ? { ...option, text: newText } : option
          ),
        };
      }
      return question;
    });

    // Update the state with the modified questions array
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleImageUploadOption = (e, questionIndex, optionIndex) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file); // Get the image URL

    // Update the image for the option
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[questionIndex].options[optionIndex].image = imageUrl;

    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const instituteOptions = institutes.map((institute) => ({
    value: institute,
    label: institute,
  }));

  const domainOptions = domains.map((domain) => ({
    value: domain,
    label: domain,
  }));

  const subjectOptions = subjects.map((subject) => ({
    value: subject,
    label: subject,
  }));

  const subtopicOptions = subtopics.map((subtopic) => ({
    value: subtopic,
    label: subtopic,
  }));

  const removeImage = (index) => {
    const updatedQuestions = newTest.questions.map((question, i) =>
      i === index ? { ...question, image: null } : question
    );
    setNewTest({
      ...newTest,
      questions: updatedQuestions,
    });
    setFileInputValue(""); // Reset the file input value when an image is removed
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`md:block ${isCollapsed ? "hidden" : "block"} w-full`}
        />

        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader
            user={user || { name: "Guest" }}
            toggleSidebar={toggleSidebar}
          />

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-left">
                Test Management
              </h1>
              <Link to="/view">
                <FaEye
                  className="cursor-pointer text-gray-600 hover:text-blue-500 transition-colors duration-300"
                  size={20} // Adjusted icon size for mobile
                />
              </Link>
            </div>

            <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">
                Create New Test
              </h2>

              {/* Dropdowns Layout */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                  {/* Institute Name Multi-Select */}
                  <div className="flex-grow">
                    <Select
                      isMulti
                      options={[
                        { value: "selectAll", label: "Select All" },
                        { value: "deselectAll", label: "Deselect All" },
                        ...instituteOptions,
                      ]}
                      onChange={handleInstituteChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select Institute(s)"
                      value={selectedOptions} // track current selected options
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "lightgray",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "blue",
                          },
                        }),
                        option: (base, { data }) => ({
                          ...base,
                          display:
                            data.value === "selectAll" ||
                            data.value === "deselectAll"
                              ? "inline-block"
                              : "block",
                          width:
                            data.value === "selectAll" ||
                            data.value === "deselectAll"
                              ? "50%"
                              : "100%", // Ensure equal width for select/deselect options
                          textAlign: "center", // Center-align the labels
                        }),
                        menu: (base) => ({
                          ...base,
                          display: "flex",
                          flexDirection: "column",
                        }),
                      }}
                    />
                  </div>

                  {/* Domain Dropdown */}
                  <div className="flex-grow">
                    <select
                      name="domain"
                      value={newTest.domain}
                      onChange={handleTestChange}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Domain
                      </option>
                      {domainOptions.map((domain) => (
                        <option key={domain.value} value={domain.value}>
                          {domain.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Test Name Input */}
                  <div>
                    <input
                      type="text"
                      name="testName"
                      value={newTest.testName}
                      onChange={(e) => {
                        const updatedTestName = e.target.value;
                        setNewTest((prevTest) => ({
                          ...prevTest,
                          testName: updatedTestName,
                        }));
                      }}
                      placeholder="Enter Test Name/Chapter Name"
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    />
                  </div>

                  {/* Duration Input */}
                  <div>
                    <select
                      name="duration"
                      value={newTest.duration}
                      onChange={handleTestChange}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Duration
                      </option>
                      {["30 mins", "60 mins", "90 mins", "120 mins"].map(
                        (duration) => (
                          <option key={duration} value={duration}>
                            {duration}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <select
                      name="subject"
                      value={newTest.subject}
                      onChange={(e) => {
                        const selectedSubject = e.target.value;

                        // Update the subject field
                        setNewTest((prevTest) => ({
                          ...prevTest,
                          subject: selectedSubject,
                        }));

                        handleTestChange(e);

                        // Reset subtopic and question subtopics only if a specific subject is selected
                        if (selectedSubject !== "ALL") {
                          const updatedQuestions = newTest.questions.map(
                            (question) => ({
                              ...question,
                              subtopic: "", // Reset subtopic for all questions
                            })
                          );

                          setNewTest((prevTest) => ({
                            ...prevTest,
                            mainSubtopic: "", // Reset main subtopic
                            questions: updatedQuestions,
                          }));
                        }
                      }}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Subject
                      </option>
                      {subjectOptions.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter Dropdown */}
                  <div>
                    <select
                      name="chapter"
                      value={newTest.chapter || "ALL"} // Default to "ALL" if newTest.chapter is empty
                      onChange={(e) => {
                        const selectedChapter = e.target.value;
                        setNewTest((prevTest) => ({
                          ...prevTest,
                          chapter: selectedChapter,
                        }));
                      }}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      {/* "All" option */}
                      <option value="ALL">All Chapter</option>
                      {/* Other chapter options */}
                      {chapterOptions.map((chapter) => (
                        <option key={chapter.value} value={chapter.value}>
                          {chapter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Correct Mark and Negative Mark Inputs in Same Row */}
                <div className="flex gap-4 mt-3">
                  {/* Correct Mark Input */}
                  <div className="flex-grow">
                    <input
                      type="number"
                      step="0.01" // Allows decimal inputs
                      name="correctMark"
                      value={newTest.correctMark}
                      onChange={(e) => {
                        const updatedCorrectMark =
                          parseFloat(e.target.value) || ""; // Parse as float or empty if NaN
                        setNewTest((prevTest) => ({
                          ...prevTest,
                          correctMark: updatedCorrectMark,
                        }));
                      }}
                      placeholder="Correct Mark"
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    />
                  </div>

                  {/* Negative Mark Input */}
                  <div className="flex-grow">
                    <input
                      type="number"
                      step="0.01" // Allows decimal inputs
                      name="negativeMark"
                      value={newTest.negativeMark}
                      onChange={(e) => {
                        let updatedNegativeMark = e.target.value;

                        // Ensure the value has a negative sign
                        if (
                          !updatedNegativeMark.startsWith("-") &&
                          updatedNegativeMark !== ""
                        ) {
                          updatedNegativeMark = `-${updatedNegativeMark}`;
                        }
                        setNewTest((prevTest) => ({
                          ...prevTest,
                          negativeMark: parseFloat(updatedNegativeMark) || "", // Parse as float or empty if NaN
                        }));
                      }}
                      placeholder="Negative Mark"
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    />
                  </div>
                </div>

                {/* Show main subtopic dropdown when "ALL" is selected */}
                {newTest.subject === "ALL" && (
                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-sm sm:text-md font-semibold mb-2">
                      Select Subtopic for Mock Test
                    </h3>
                    <select
                      name="mainSubtopic"
                      className={`border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 ${
                        newTest.subject === "ALL"
                          ? ""
                          : "bg-gray-200 cursor-not-allowed"
                      }`}
                      onChange={(e) => {
                        setNewTest({
                          ...newTest,
                          mainSubtopic: e.target.value,
                        });
                      }}
                      value={newTest.mainSubtopic} // Control the value of the dropdown
                      disabled={newTest.subject !== "ALL"} // Disable when subject is not ALL
                    >
                      <option value="" disabled>
                        Select Subtopic
                      </option>
                      {subtopicOptions.map((subtopic) => (
                        <option key={subtopic.value} value={subtopic.value}>
                          {subtopic.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white p-3 sm:p-6 shadow-md rounded-lg mb-3 sm:mb-8">
              <h2 className="text-md sm:text-xl font-semibold mb-2 sm:mb-4">
                Questions
              </h2>

              {/* Render only the current question */}
              {newTest.questions[currentQuestionIndex] && (
                <div className="mb-2 sm:mb-4 border p-2 sm:p-4 rounded-md shadow-md bg-gray-50">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <h4 className="font-semibold text-sm sm:text-lg">
                      Question {currentQuestionIndex + 1}
                    </h4>
                    <button
                      onClick={() => handleDeleteQuestion(currentQuestionIndex)}
                      className="text-red-500 text-xs sm:text-base hover:underline"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
                    {/* Question Text Area */}
                    <div className="relative w-full">
                      <textarea
                        placeholder="Question Text"
                        value={
                          newTest.questions[currentQuestionIndex]
                            ?.questionText || ""
                        }
                        onChange={(e) => {
                          const updatedQuestions = [...newTest.questions];
                          updatedQuestions[currentQuestionIndex].questionText =
                            e.target.value;
                          setNewTest((prevState) => ({
                            ...prevState,
                            questions: updatedQuestions,
                          }));
                        }}
                        className="border p-1 sm:p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base"
                        rows="3"
                      />
                    </div>

                    {/* Subtopic Dropdown */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <select
                        value={
                          newTest.questions[currentQuestionIndex]?.subtopic ||
                          ""
                        }
                        onChange={(e) =>
                          handleQuestionChange(
                            currentQuestionIndex,
                            "subtopic",
                            e.target.value
                          )
                        }
                        className={`border p-1 sm:p-2 w-full sm:w-auto rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base ${
                          newTest.subject === "ALL"
                            ? ""
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                        disabled={newTest.subject !== "ALL"}
                      >
                        <option value="" disabled>
                          Select Subtopic
                        </option>
                        {subtopicOptions.map((subtopic) => (
                          <option key={subtopic.value} value={subtopic.value}>
                            {subtopic.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Options Input */}
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
                    {newTest.questions[currentQuestionIndex].options.map(
                      (option, optionIndex) => (
                        <div key={optionIndex} className="flex-grow">
                          {/* Card for Each Option */}
                          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            {/* Option Input Field (Text) */}
                            <input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option.text || ""} // Use option.text or "" if it's undefined
                              onChange={(e) =>
                                handleOptionTextChange(
                                  currentQuestionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="border p-1 sm:p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base"
                            />

                            {/* Image Upload for Each Option */}
                            <div className="mt-2">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleImageUploadOption(
                                    e,
                                    currentQuestionIndex,
                                    optionIndex
                                  )
                                }
                                className="border p-1 sm:p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base"
                              />
                              {option.image && (
                                <div className="relative mt-2">
                                  <img
                                    src={option.image}
                                    alt={`Option ${optionIndex + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                    onClick={() => openModal(option.image)} // Open modal on image click
                                  />
                                  {/* Trash Icon to Delete Image */}
                                  <button
                                    onClick={() =>
                                      deleteOptionImage(
                                        currentQuestionIndex,
                                        optionIndex
                                      )
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full focus:outline-none text-xs sm:text-sm"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* Modal for Enlarged Image */}
                    {isModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-4 rounded-lg relative max-w-full max-h-[90vh] overflow-auto w-full sm:max-w-3xl sm:max-h-[90vh] mx-4">
                          <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 text-xl sm:text-2xl"
                          >
                            &times;
                          </button>
                          <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Correct Answer Dropdown */}
                  <div className="relative w-full">
                    <div
                      onClick={() =>
                        isDropdownEnabled && setDropdownOpen(!isDropdownOpen)
                      }
                      className={`border p-2 w-full rounded-md focus:outline-none ${
                        isDropdownEnabled
                          ? "bg-gray-100 cursor-pointer focus:ring focus:ring-blue-400"
                          : "bg-gray-200 cursor-not-allowed"
                      } text-xs sm:text-base flex items-center justify-between`}
                    >
                      {newTest.questions[currentQuestionIndex].correctAnswer ? (
                        newTest.questions[currentQuestionIndex].correctAnswer
                          .image ? (
                          <img
                            src={
                              newTest.questions[currentQuestionIndex]
                                .correctAnswer.image
                            }
                            alt="Selected option"
                            className="w-6 h-6 object-cover rounded-full mr-2"
                          />
                        ) : (
                          newTest.questions[currentQuestionIndex].correctAnswer
                            .text
                        )
                      ) : (
                        "Select Correct Answer"
                      )}
                      <span className="ml-2 text-gray-500">&#9662;</span>
                    </div>

                    {isDropdownOpen && isDropdownEnabled && (
                      <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-2 rounded-md shadow-lg z-10">
                        {newTest.questions[currentQuestionIndex].options.map(
                          (option, optionIndex) => (
                            <div
                              key={optionIndex}
                              onClick={() => handleSelectChange(option)}
                              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                            >
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt={`Option ${optionIndex + 1}`}
                                  className="w-6 h-6 object-cover rounded-full mr-2"
                                />
                              )}
                              {option.text}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      Upload Image For Question
                    </label>
                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (selectedFile) {
                            handleImageUpload(
                              currentQuestionIndex,
                              selectedFile
                            );
                            setFileInputValue(selectedFile.name);
                          }
                        }}
                        className="border p-1 sm:p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 cursor-pointer text-xs sm:text-sm"
                      />
                      {newTest.questions[currentQuestionIndex].image && (
                        <div className="relative">
                          <img
                            src={newTest.questions[currentQuestionIndex].image}
                            alt="Uploaded"
                            className="h-20 w-20 sm:h-32 sm:w-32 object-cover rounded-md shadow-md cursor-pointer"
                            onClick={() =>
                              openModal(
                                newTest.questions[currentQuestionIndex].image
                              )
                            }
                          />
                          <button
                            onClick={() => {
                              removeImage(currentQuestionIndex);
                              setFileInputValue("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full focus:outline-none text-xs sm:text-sm"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4">
                <div className="flex flex-row gap-1 w-full sm:w-auto">
                  {/*<button
                    onClick={addQuestion}
                    className="bg-blue-500 text-white p-2 rounded-md w-full sm:w-auto h-8 sm:h-auto text-xs sm:text-base"
                  >
                    Add Question
                  </button>*/}
                  <button
                    onClick={handleSaveAndNext}
                    className="bg-teal-500 text-white p-2 rounded-md w-full sm:w-auto h-8 sm:h-auto text-xs sm:text-base"
                  >
                    Save and Next
                  </button>
                </div>
                <button
                  onClick={handleAddTest}
                  className="bg-green-500 text-white p-2 rounded-md w-full sm:w-auto mt-2 sm:mt-0 text-xs sm:text-base"
                >
                  Submit Test
                </button>
                {/* Confirmation Modal */}
                {showConfirmationModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 sm:bg-opacity-75">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center w-10/12 max-w-md sm:max-w-lg">
                      <p className="text-sm sm:text-base">
                        All questions are submitted. Do you want to proceed to
                        the view page?
                      </p>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={confirmSubmission}
                          className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base mr-2"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowConfirmationModal(false)}
                          className="bg-gray-300 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded-lg relative max-w-full max-h-[90vh] overflow-auto w-full sm:max-w-3xl sm:max-h-[90vh] mx-4">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-red-500 text-xl sm:text-2xl"
                >
                  &times;
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTestManagement;
