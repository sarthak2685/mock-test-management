import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
// import { InlineMath } from "react-katex"; // For inline math rendering
// import "katex/dist/katex.min.css"; // KaTeX styles
import config from "../../config";
import MathQuill, { addStyles, EditableMathField } from "react-mathquill";

// Add MathQuill styles
addStyles();

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
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [subjects, setSubjects] = useState([]);

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

  const handleQuestionChange = (index, field, value, optionIndex) => {
    const updatedQuestions = [...newTest.questions];

    if (!updatedQuestions[index]) {
      console.error(`Question at index ${index} not found`);
      return;
    }

    if (field === "options") {
      // Ensure options array exists
      if (
        !updatedQuestions[index].options ||
        !updatedQuestions[index].options[optionIndex]
      ) {
        console.error(
          `Option at index ${optionIndex} not found for question ${index}`
        );
        return;
      }

      // Update the text of the specified option
      updatedQuestions[index].options[optionIndex].text = value;
    } else {
      // Update the field value
      updatedQuestions[index][field] = value;
    }

    // Check if any options' text is empty or invalid
    const anyOptionEmpty = updatedQuestions[index].options.some(
      (option) => typeof option.text === "string" && option.text.trim() === ""
    );

    // Only reset correctAnswer if there's an empty option
    if (anyOptionEmpty) {
      updatedQuestions[index].correctAnswer = "";
    }

    // Update the state with modified questions
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
  // Array ref for tracking option file inputs
  const optionFileInputRefs = useRef([]);

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

    // Save the current question data
    const savedQuestions = [...newTest.questions];
    savedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      index: currentQuestionIndex,
      questionText: currentQuestion.questionText,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      subtopic: currentQuestion.subtopic,
      image: currentQuestion.image,
    };

    console.log(
      `Saved Question Data for Question ${currentQuestionIndex + 1}:`,
      savedQuestions[currentQuestionIndex]
    );

    // Reset the file inputs for the current question's options
    optionFileInputRefs.current.forEach((input) => {
      if (input) input.value = null;
    });

    // Prepare for the next question
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (savedQuestions.length <= nextQuestionIndex) {
      savedQuestions.push({
        index: nextQuestionIndex,
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

    // Update state for the next question
    const nextQuestion = savedQuestions[nextQuestionIndex] || {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      subtopic: "",
      image: null,
    };

    setCurrentQuestionIndex(nextQuestionIndex);
    setCorrectAnswer(nextQuestion.correctAnswer || "");
    setDropdownOpen(false);
    setQuestionText(nextQuestion.questionText || "");
    setOptions(nextQuestion.options || ["", "", "", ""]);
    setSubtopic(nextQuestion.subtopic || "");
    setImage(nextQuestion.image || null);
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
    const updatedQuestions = [...newTest.questions]; // Copy the questions array
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex], // Preserve other properties of the current question
      correctAnswer: {
        text: option?.text || null, // Store the text of the correct answer
        image: option?.image || null, // Store the image if it exists
      },
    };

    setNewTest({
      ...newTest,
      questions: updatedQuestions, // Update the questions with the modified correctAnswer
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
    const file = e.target.files[0]; // Get the first selected file

    if (file && file.type === "image/png") {
      // Only process if the file is a PNG image
      const reader = new FileReader();

      reader.onloadend = () => {
        // Get the base64 representation of the image
        const imageBase64 = reader.result;

        // Update the question's option with the base64 image
        const updatedQuestions = [...newTest.questions];

        // Ensure that the option is an object before assigning the image
        const option = updatedQuestions[questionIndex].options[optionIndex];

        if (typeof option === "string") {
          // If it's a string (i.e., text), convert it to an object with 'text' and 'image' properties
          updatedQuestions[questionIndex].options[optionIndex] = {
            text: option, // Store the existing text as 'text'
            image: imageBase64, // Add the image as 'image'
          };
        } else {
          // If it's already an object, just update the image property
          updatedQuestions[questionIndex].options[optionIndex].image =
            imageBase64;
        }

        // Update state with the new image data
        setNewTest({ ...newTest, questions: updatedQuestions });
      };

      reader.readAsDataURL(file); // Read the file as a base64 string (image/png)
    } else {
      alert("Please select a valid PNG image.");
    }
  };

  const [domains, setDomains] = useState([]);

  const fetchDomains = async () => {
    if (!token) {
      console.log("No token found, unable to fetch Domain.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/exams/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      console.log("Request", result);

      if (Array.isArray(result)) {
        setDomains(result);
      } else {
        console.error("no domain available", result);
      }
    } catch (error) {
      console.log("Error fetching Domain:", error);
      if (error.response) {
        console.log("Error Response:", error.response); // Check the response error
      }
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []); // Run once when the component mounts

  const fetchSubjects = async () => {
    if (!token) {
      console.log("No token found, unable to fetch Domain.");
      return;
    }

    try {
      // Construct the API URL with or without the domain ID based on the availability of newTest.domain
      const apiUrl = newTest.domain
        ? `${config.apiUrl}/get-subject/?id=${newTest.domain}`
        : `${config.apiUrl}/get-subject/`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        const RES = result.data;
        console.log("Subjects fetched:", RES);

        // Conditionally add 'ALL Subjects' only if newTest.domain is available
        if (newTest.domain) {
          const allOption = { name: "ALL Subjects", id: "ALL" };
          setSubjects([allOption, ...RES]);
        } else {
          setSubjects(RES);
        }
      } else {
        console.error(
          "No Subjects Available or Invalid Response Format",
          result
        );
      }
    } catch (error) {
      console.log("Error fetching Subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  console.log("Subjects", subjects);

  const [subTopic, setSubTopic] = useState([]);

  const fetchSubtopic = async () => {
    if (!token) {
      console.log("No token found, unable to fetch Subtopics.");
      return;
    }

    if (!newTest.domain) {
      console.log("No domain ID selected, unable to fetch Subtopics.");
      setSubTopic([]); // Clear subtopics if no domain ID is selected
      return;
    }

    try {
      // Construct the API URL with the domain ID
      const apiUrl = `${config.apiUrl}/exam-subjects/?domainId=${newTest.domain}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      console.log("Subtopics fetched:", result);

      if (Array.isArray(result)) {
        // Filter subtopics where for_exam matches newTest.domain
        const filteredSubTopics = result.filter(
          (subTopic) => subTopic.for_exam === newTest.domain
        );
        setSubTopic(filteredSubTopics); // Set the fetched subtopics directly
      } else {
        console.error(
          "No Subtopics Available or Invalid Response Format",
          result
        );
        setSubTopic([]); // Clear subtopics in case of an invalid response
      }
    } catch (error) {
      console.log("Error fetching Subtopics:", error);
      setSubTopic([]); // Clear subtopics in case of an error
    }
  };

  useEffect(() => {
    fetchSubtopic();
  }, []);

  const [chapters, setChapters] = useState([]);

  const fetchChapters = async () => {
    if (!token) {
      console.log("No token found, unable to fetch chapters.");
      return;
    }

    if (!newTest.subject) {
      console.log("No subject selected.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/exam-subject-chapters`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Request Chapter", result);

      if (Array.isArray(result)) {
        // Filter chapters where for_exam_subject matches newTest.subject
        const filteredChapters = result.filter(
          (chapter) => chapter.for_exam_subject === newTest.subject
        );

        // Add the "ALL Chapter" option at the beginning
        const allOption = { name: "ALL Chapter", id: "all" };
        setChapters([allOption, ...filteredChapters]);
      } else {
        console.error("Unexpected response format:", result);
      }
    } catch (error) {
      console.log("Error fetching chapters:", error);
      if (error.response) {
        console.log("Error Response:", error.response); // Check the response error
      }
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []); // Run once when the component mounts

  const [institutes, setInstitutes] = useState([]); // State to hold institutes

  const fetchInstitutes = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/vendor-admin-crud/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      // Assuming result.data contains the list of institutes with institute_name and id
      if (Array.isArray(result.data)) {
        const formattedInstitutes = result.data.map((institute) => ({
          value: institute.id, // Use id as value
          label: institute.institute_name, // Use institute_name as label
        }));

        setInstitutes(formattedInstitutes); // Set the institutes state in the correct format
      } else {
        console.error("Expected an array but received:", result.data);
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  // Handle changes in the select component
  const handleInstituteChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "selectAll")) {
      // Select all logic
      const allInstituteValues = institutes.map((institute) => institute.value);
      setSelectedOptions(
        institutes.map((institute) => ({
          value: institute.value,
          label: institute.label,
        }))
      );
    } else if (
      selectedOptions.some((option) => option.value === "deselectAll")
    ) {
      // Deselect all logic
      setSelectedOptions([]);
    } else {
      // Regular selection
      setSelectedOptions(selectedOptions);
    }
  };

  useEffect(() => {
    fetchInstitutes(); // Fetch institutes when component mounts
  }, []); // Run once when the component mounts

  const handleTest = async () => {
    try {
      const currentQuestion = newTest.questions[currentQuestionIndex];
      if (!currentQuestion) {
        console.error("No questions found at index:", currentQuestionIndex);
        return;
      }

      // Function to convert image files to Base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Handle options (both text and image)
      const options = await Promise.all(
        currentQuestion.options.map(async (option) => {
          if (typeof option === "string") {
            return option; // If it's just a string, return it directly.
          }

          if (option?.image instanceof File) {
            // Convert image to Base64 if it's a File object
            return await fileToBase64(option.image);
          }

          // If it's already Base64 or text, return it.
          return option?.image || option?.text || null;
        })
      );

      // Ensure option text length is capped at 100 characters
      const truncatedOptions = options.map((option) => {
        if (typeof option === "string" && option.length > 100) {
          return option.slice(0, 100);
        }
        return option;
      });

      // Handle the correct answer, which can be text or an image (Base64 or File)
      let correctAnswer = null;
      let correctAnswer2 = null;

      if (currentQuestion.correctAnswer?.text) {
        correctAnswer = currentQuestion.correctAnswer.text;
      } else if (currentQuestion.correctAnswer?.image instanceof File) {
        // Convert correct answer image to Base64
        correctAnswer2 = await fileToBase64(
          currentQuestion.correctAnswer.image
        );
      } else if (currentQuestion.correctAnswer?.image) {
        // If the image is already Base64, just use it
        correctAnswer2 = currentQuestion.correctAnswer.image;
      }

      // Ensure correct answer text length is capped at 100 characters
      if (typeof correctAnswer === "string" && correctAnswer.length > 100) {
        correctAnswer = correctAnswer.slice(0, 100);
      }

      // Prepare the list of subject IDs correctly
      const forExamSubjects =
        newTest.subject === "ALL"
          ? subTopic
              .filter((sub) => sub.name === currentQuestion.subtopic)
              .map((sub) => sub.id)
          : newTest.selectedSubjects?.filter((id) => id !== "ALL") || [];

      // Create a FormData object
      const formData = new FormData();
      formData.append("test_name", newTest.testName);
      formData.append("exam_duration", newTest.duration);
      formData.append("for_exam", newTest.domain);

      // Append institutes as array of UUIDs
      selectedOptions.forEach((option) =>
        formData.append("institutes", option.value)
      );

      // Append for_exam_subjects_o as array of UUIDs
      forExamSubjects.forEach((id) =>
        formData.append("for_exam_subjects_o", id)
      );

      // Append for_exam_chapter_o as array of UUIDs if present
      if (newTest.chapter?.id) {
        formData.append("for_exam_chapter_o", newTest.chapter.id);
      }

      formData.append("marks", newTest.correctMark);
      formData.append("negative_marks", newTest.negativeMark);
      formData.append("question", currentQuestion.questionText || null);

      // Append question image file as Base64 if available
      if (currentQuestion.image) {
        if (currentQuestion.image instanceof File) {
          const base64Image = await fileToBase64(currentQuestion.image);
          formData.append("question_1", base64Image);
        } else if (typeof currentQuestion.image === "string") {
          formData.append("question_1", currentQuestion.image);
        }
      }

      // Append subtopic if subject is ALL
      if (newTest.subject === "ALL") {
        formData.append("subtopic", currentQuestion.subtopic);
      }

      // Append both option text and image (if any)
      await Promise.all(
        currentQuestion.options.map(async (option, index) => {
          const optionTextKey = `option_${index + 1}`;
          const optionImageKey = `file_${index + 1}`;

          if (typeof option === "string") {
            formData.append(optionTextKey, option); // Directly append the option text
          } else {
            formData.append(optionTextKey, option?.text || null); // Append the text if available
          }

          // Handle option image (Base64 or URL)
          if (option?.image) {
            if (option.image instanceof File) {
              const base64Image = await fileToBase64(option.image);
              formData.append(optionImageKey, base64Image);
            } else if (typeof option.image === "string") {
              formData.append(optionImageKey, option.image); // Append image as URL or Base64
            }
          }
        })
      );

      // Append correct_answer and correct_answer2 fields
      formData.append("correct_answer", correctAnswer); // It will be null if no text answer
      if (correctAnswer2) {
        formData.append("correct_answer2", correctAnswer2); // Image (Base64 or URL)
      }

      // Send the request using fetch
      const response = await fetch(
        "https://mockexam.pythonanywhere.com/exam-subject-chapter-questions/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            // Do not set 'Content-Type': FormData automatically handles it.
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Test submitted successfully:", data);
        handleSaveAndNext();
      } else {
        const errorData = await response.json();
        console.error("Failed to submit test:", errorData);
      }
    } catch (error) {
      console.error("Error while submitting test:", error);
    }
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
                  <div className="flex-grow" onClick={fetchInstitutes}>
                    <Select
                      isMulti
                      options={[
                        { value: "selectAll", label: "Select All" },
                        { value: "deselectAll", label: "Deselect All" },
                        ...institutes, // Institutes are now in the correct format for the Select component
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
                  <div className="flex-grow" onClick={fetchDomains}>
                    <select
                      name="domain"
                      value={newTest.domain || ""} // Use empty string when no value is selected
                      onChange={(e) => {
                        const selectedDomainId = e.target.value;

                        setNewTest((prevTest) => ({
                          ...prevTest,
                          domain: selectedDomainId, // Store domain ID directly
                          chapter: null, // Reset chapter selection when domain changes
                        }));
                      }}
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Domain
                      </option>
                      {domains.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                          {domain.name}{" "}
                          {/* Display the name, but send the ID */}
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
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      value={newTest.duration || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        setNewTest((prevTest) => ({
                          ...prevTest,
                          duration: value, // Update duration value
                        }));
                      }}
                      placeholder="Enter duration in minutes"
                      className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div onClick={fetchSubjects}>
                    <select
                      name="subject"
                      value={newTest.subject}
                      onChange={(e) => {
                        const selectedSubjectId = e.target.value;

                        if (selectedSubjectId === "ALL") {
                          // Include all subject IDs
                          setNewTest((prevTest) => ({
                            ...prevTest,
                            subject: selectedSubjectId,
                            selectedSubjects: subjects.map(
                              (subject) => subject.id
                            ),
                          }));
                        } else {
                          setNewTest((prevTest) => ({
                            ...prevTest,
                            subject: selectedSubjectId,
                            selectedSubjects: prevTest.selectedSubjects
                              ? [
                                  ...prevTest.selectedSubjects,
                                  selectedSubjectId,
                                ]
                              : [selectedSubjectId],
                          }));
                        }

                        if (selectedSubjectId !== "ALL") {
                          const updatedQuestions = newTest.questions.map(
                            (question) => ({
                              ...question,
                              subtopic: "", // Reset subtopics
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
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter Dropdown */}
                  <div onClick={fetchChapters}>
                    <select
                      name="chapter"
                      value={newTest.chapter?.id || ""} // No default value if disabled
                      onChange={(e) => {
                        const selectedChapterId = e.target.value;
                        const selectedChapter = chapters.find(
                          (chapter) => chapter.id === selectedChapterId
                        );

                        setNewTest((prevTest) => ({
                          ...prevTest,
                          chapter: selectedChapter || null, // Set to null if no selection
                        }));
                      }}
                      disabled={!!newTest.domain} // Disable when domain is selected
                      className={`border p-2 w-full rounded-md transition duration-200 ${
                        newTest.domain
                          ? "bg-gray-200 cursor-not-allowed focus:ring-0" // Adjust styles when disabled
                          : "focus:outline-none focus:ring focus:ring-blue-400"
                      }`}
                    >
                      <option value="" disabled>
                        Select Chapter
                      </option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
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
                        rows="4"
                      />
                    </div>

                    {/* Subtopic Dropdown */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <select
                        value={
                          newTest.questions[currentQuestionIndex]?.subtopic ||
                          ""
                        }
                        onClick={() => {
                          // Fetch subtopics only if "ALL" is selected
                          if (newTest.subject === "ALL") {
                            fetchSubtopic();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value?.trim() || ""; // Ensure value is defined and trimmed
                          handleQuestionChange(
                            currentQuestionIndex,
                            "subtopic",
                            value
                          );
                        }}
                        className={`border p-1 sm:p-2 w-full sm:w-auto rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base ${
                          newTest.subject === "ALL"
                            ? ""
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                        disabled={newTest.subject !== "ALL"}
                      >
                        <option value="" disabled>
                          Select Sub-Subject
                        </option>
                        {subTopic.map((subtopic) => (
                          <option key={subtopic.id} value={subtopic.name}>
                            {subtopic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="mt-2 mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      Upload PNG Image For Question
                    </label>
                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".png,image/png" // Restrict to PNG files only
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (selectedFile) {
                            // Validate file type
                            if (selectedFile.type === "image/png") {
                              handleImageUpload(
                                currentQuestionIndex,
                                selectedFile
                              );
                              setFileInputValue(selectedFile.name);
                            } else {
                              alert(
                                "Only PNG files are allowed. Please upload a valid PNG image."
                              );
                              // Reset the input value
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                              }
                            }
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

                  {/* Options Input */}
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
                    {newTest.questions[currentQuestionIndex].options.map(
                      (option, optionIndex) => (
                        <div key={optionIndex} className="flex-grow">
                          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            {/* Option Input Field (Text) */}
                            <input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option.text || ""}
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
                                ref={(el) =>
                                  (optionFileInputRefs.current[optionIndex] =
                                    el)
                                } // Attach dynamic ref
                                accept="image/png"
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
                                    onClick={() => openModal(option.image)}
                                  />
                                  <button
                                    onClick={() => {
                                      deleteOptionImage(
                                        currentQuestionIndex,
                                        optionIndex
                                      );
                                      if (
                                        optionFileInputRefs.current[optionIndex]
                                      ) {
                                        optionFileInputRefs.current[
                                          optionIndex
                                        ].value = null; // Reset file input
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
                      )
                    )}
                  </div>

                  {/* Correct Answer Dropdown */}
                  <div className="relative w-full mt-6">
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
                    onClick={handleTest}
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
