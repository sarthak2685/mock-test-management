import React, { useState, useEffect } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import { FaTrashAlt } from "react-icons/fa";
import Select from "react-select";

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
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
        subtopic: "", // Add subtopic field to the question
      },
    ],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMainSubtopic, setShowMainSubtopic] = useState(false);
  const [fileInputValue, setFileInputValue] = useState(""); // Track file input value

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

    // Check if all options are filled
    const allOptionsFilled = updatedQuestions[index].options.every(
      (option) => option !== ""
    );
    if (allOptionsFilled) {
      updatedQuestions[index].correctAnswer = ""; // Reset correct answer if options change
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
      reader.readAsDataURL(file); // Only read the file if it's not null
    } else {
      // When file is null, reset the image for that question
      const updatedQuestions = newTest.questions.map((question, i) =>
        i === index ? { ...question, image: null } : question
      );
      setNewTest({
        ...newTest,
        questions: updatedQuestions,
      });
    }
  };

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
          subtopic: "", // Add subtopic field to new question
        },
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions.splice(index, 1);
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleAddTest = () => {
    // Validate that all questions have a subtopic if the main subject is "ALL"
    const allQuestionsValid = newTest.questions.every((question) => {
      if (newTest.subject === "ALL") {
        return question.subtopic !== ""; // Check if subtopic is selected
      }
      return true; // If not "ALL", assume valid
    });

    if (!allQuestionsValid) {
      alert(
        "Please select a subtopic for each question when subject is 'ALL'."
      );
      return;
    }

    setMockTests([...mockTests, { ...newTest, id: mockTests.length + 1 }]);
    setNewTest({
      instituteNames: [],
      domain: "",
      subject: "",
      duration: "",
      questions: [
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          image: null,
          subtopic: "", // Reset subtopic on new test
        },
      ],
    });
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
    <div className="flex flex-col min-h-screen bg-gray-100">
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
            <h1 className="text-3xl font-bold mb-6 text-left">
              Mock Test Management
            </h1>
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
                    <div className="flex-grow">
                      <textarea
                        placeholder="Question Text"
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "questionText",
                            e.target.value
                          )
                        }
                        className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        rows="3"
                      />
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
                        onChange={(e) => {
                          handleImageUpload(index, e.target.files[0]);
                          setFileInputValue(e.target.value); // Update file input value to reflect the selected image
                        }}
                        value={fileInputValue} // Bind the file input value to a state
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
                              handleImageUpload(index, null); // Pass null to handleImageUpload to reset the image
                              setFileInputValue(""); // Reset the file input field
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

              <div className="flex justify-between mt-4">
                <button
                  onClick={addQuestion}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Add Question
                </button>

                <button
                  onClick={handleAddTest}
                  className="bg-green-500 text-white p-2 rounded-md"
                >
                  Save Mock Test
                </button>
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
