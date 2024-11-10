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

const MockTestManagement = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mockTests, setMockTests] = useState([]);
  const [newTest, setNewTest] = useState({
    instituteNames: [],
    domain: "",
    subject: "",
    duration: "",
    questions: [
      {
        index: 0, // Add index to the first question
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
        subtopic: "",
      },
    ],
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1); // Starting index for the next question
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMainSubtopic, setShowMainSubtopic] = useState(false);
  const [fileInputValue, setFileInputValue] = useState(""); // Track file input value
  const fileInputRef = useRef(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuestionText(e.target.value);
  };

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
    setNewTest({ ...newTest, [name]: value });
  };

  const handleInstituteChange = (selectedOptions) => {
    const selectedInstitutes = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setNewTest({ ...newTest, instituteNames: selectedInstitutes });
  };

  const handleQuestionChange = (index, field, value, optionIndex) => {
    const updatedQuestions = [...newTest.questions];

    if (field === "options") {
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      updatedQuestions[index][field] = value;
    }

    // Check if any options are empty
    const anyOptionEmpty = updatedQuestions[index].options.some(
      (option) => option.trim() === ""
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
  const addQuestion = () => {
    setNewTest({
      ...newTest,
      questions: [
        ...newTest.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          image: null,
          subtopic: "", // Add subtopic field to the new question
          subject: "", // Add subject field to the new question
        },
      ],
    });
  };

  // Function to handle the "Save and Next" button
  const handleSaveAndNext = () => {
    // Check if newTest or the required fields are undefined or empty
    if (!newTest || !newTest.subject) {
      console.error("Subject is missing in newTest.");
      return;
    }

    // Log the newTest to check if subject and other properties are available
    console.log("Saving and moving to the next question:", newTest);

    // Save the current question data (e.g., saving questions)
    // This can involve saving to local state, database, etc.
    const savedQuestions = [...newTest.questions]; // Assuming you want to keep track of previous questions

    // Increment the index for the next question
    const nextQuestionIndex = currentQuestionIndex;

    // Proceed to reset the state for the next question
    setNewTest({
      ...newTest, // Keep existing data
      questions: [
        ...savedQuestions, // Keep previously saved questions
        {
          index: nextQuestionIndex, // Set index for the new question
          questionText: "", // Reset for the next question
          options: ["", "", "", ""], // Reset options
          correctAnswer: "", // Reset correct answer
          image: null, // Reset image
          subtopic: "", // Reset subtopic
        },
      ],
    });

    // Update the currentQuestionIndex to the next question
    setCurrentQuestionIndex(nextQuestionIndex + 1);

    // Optionally, focus on the next question if needed
    // e.g., document.querySelector("input[name='questionText']").focus();
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
          className="hidden md:block"
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-left">
                Mock Test Management
              </h1>
              <Link to="/view">
                {" "}
                <FaEye
                  className="cursor-pointer text-gray-600 hover:text-blue-500 transition-colors duration-300"
                  size={24}
                />
              </Link>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Create New Mock Test
              </h2>

              {/* Dropdowns Layout */}
              <div className="mb-4">
                <div className="flex gap-4 mb-4">
                  {/* Institute Name Multi-Select */}
                  <div className="flex-grow">
                    <Select
                      isMulti
                      options={instituteOptions}
                      onChange={handleInstituteChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select Institute(s)"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "lightgray",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "blue",
                          },
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

                <div className="flex gap-4">
                  {/* Subject Dropdown */}
                  <div className="flex-grow">
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

                  {/* Duration Input */}
                  <div className="flex-grow">
                    <select
                      name="duration"
                      value={newTest.duration}
                      onChange={handleTestChange}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Duration
                      </option>
                      {/* Replace the array below with your desired time options */}
                      {["30 mins", "60 mins", "90 mins", "120 mins"].map(
                        (duration) => (
                          <option key={duration} value={duration}>
                            {duration}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Show main subtopic dropdown when "ALL" is selected */}
                {newTest.subject === "ALL" && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">
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
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Questions</h2>

              {newTest.questions.map((question, index) => (
                <div
                  key={index}
                  className="mb-4 border p-4 rounded-md shadow-md bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">Question {index + 1}</h4>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <div className="flex gap-4 mb-2">
                    {/* Question Text Area */}
                    <div className="relative w-full">
                      {" "}
                      {/* Ensure the parent div has full width */}
                      {/* Textarea for user input */}
                      <textarea
                        placeholder="Question Text"
                        value={questionText}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        rows="3"
                      />
                      {/* Overlay div for rendering LaTeX in real-time */}
                      <div
                        className="absolute top-0 left-0 w-full h-full p-2 bg-transparent text-gray-700 pointer-events-none"
                        style={{
                          whiteSpace: "pre-wrap", // Preserve whitespace formatting
                          wordWrap: "break-word",
                          visibility: questionText ? "visible" : "hidden",
                        }}
                      >
                        {/* Render LaTeX expressions in real-time using InlineMath */}
                        <InlineMath>{questionText}</InlineMath>
                      </div>
                    </div>

                    {/* Subtopic Dropdown for each question */}
                    <div className="flex-shrink-0">
                      <select
                        value={question.subtopic}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "subtopic",
                            e.target.value
                          )
                        }
                        className={`border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 ${
                          newTest.subject === "ALL"
                            ? ""
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
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
                  </div>

                  {/* Options Input - Align options horizontally */}
                  <div className="flex gap-4 mb-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex-grow">
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "options",
                              e.target.value,
                              optionIndex
                            )
                          }
                          className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer Dropdown */}
                  <div className="flex gap-4 mb-2">
                    <select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      disabled={question.options.some(
                        (option) => option.trim() === ""
                      )}
                      className={`border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 ${
                        question.options.some((option) => option.trim() === "")
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select Correct Answer
                      </option>
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload Section */}
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Upload Image
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        ref={fileInputRef} // Attach ref to input
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (selectedFile) {
                            handleImageUpload(index, selectedFile);
                            setFileInputValue(selectedFile.name); // Update file input value to reflect the selected image name
                          }
                        }}
                        className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 cursor-pointer"
                      />
                      {question.image && (
                        <div className="relative">
                          <img
                            src={question.image}
                            alt="Uploaded"
                            className="h-32 w-32 object-cover rounded-md shadow-md cursor-pointer"
                            onClick={() => openModal(question.image)}
                          />
                          <button
                            onClick={() => {
                              removeImage(index); // Remove the image from the state
                              setFileInputValue(""); // Clear the file name
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null; // Clear file input using ref
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full focus:outline-none"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={addQuestion}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Add Question
                  </button>

                  <button
                    onClick={handleSaveAndNext}
                    className="bg-teal-500 text-white p-2 rounded-md"
                  >
                    Save and Next
                  </button>
                </div>

                <button
                  onClick={handleAddTest}
                  className="bg-green-500 text-white p-2 rounded-md"
                >
                  Submit Mock Test
                </button>
                {/* Confirmation Modal */}
                {showConfirmationModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <p>
                        All questions are submitted. Do you want to proceed to
                        the view page?
                      </p>
                      <button
                        onClick={confirmSubmission}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowConfirmationModal(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mt-4 ml-2"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded-lg relative max-w-3xl max-h-[90vh] overflow-auto">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-red-500 text-2xl" // Increased text size to text-2xl
                >
                  &times;
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full max-h-full object-contain" // Keeps the aspect ratio
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
