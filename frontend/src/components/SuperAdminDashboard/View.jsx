import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import DashboardHeader from "../SuperAdminDashboard/Header";
import axios from "axios";
import config from "../../config";
import { useLocation } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import Select from "react-select";

const View = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({ name: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [examDetails, setExamDetails] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingBasicDetails, setIsEditingBasicDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    testName: "",
    positiveMarks: "",
    negativeMarks: "",
  });

  // State for editing questions
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const optionFileInputRefs = useRef([]);
  const renderRef = useRef(null);
  const optionMathJaxRefs = useRef([]);
  const optionTextRefs = useRef([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testName = queryParams.get("test");
  const test_id = queryParams.get("test_id");
  const language = queryParams.get("lang") || queryParams.get("language") || "ENGLISH";
  const examId = queryParams.get("exam_id");
  const subjectId = queryParams.get("subject_id");

  // Initialize MathJax and set up configuration
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [["$", "$"]],
          displayMath: [["$$", "$$"]],
          processEscapes: true,
        },
      });
      renderAllEquations();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.MathJax) {
      renderAllEquations();
    }
  }, [questions, editingIndex, editingQuestion]);

  const renderAllEquations = () => {
    if (window.MathJax) {
      if (renderRef.current) {
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          renderRef.current,
        ]);
      }

      optionMathJaxRefs.current.forEach((ref) => {
        if (ref) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, ref]);
        }
      });

      optionTextRefs.current.forEach((ref) => {
        if (ref) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, ref]);
        }
      });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (test_id) {
      fetchExamDetails();
    } else {
      setLoading(false);
    }

    optionMathJaxRefs.current = optionMathJaxRefs.current.slice(0, 4);
    optionFileInputRefs.current = optionFileInputRefs.current.slice(0, 4);
    optionTextRefs.current = optionTextRefs.current.slice(0, 4);
  }, [test_id]);

  const fetchExamDetails = async () => {
    setLoading(true);
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      if (!token) {
        console.error("No auth token available");
        setLoading(false);
        return;
      }

      const apiUrl = `${config.apiUrl}/tests/${test_id}/with-questions/${language}`;

      const { data } = await axios.get(apiUrl, {
        headers: { Authorization: `${token}` },
      });

      console.log("Fetched exam details:", data); // Debug log
      setExamDetails(data);
      
      // Set basic exam details
      setEditedDetails({
        testName: data.testName || "",
        positiveMarks: data.correctMark || "",
        negativeMarks: data.negativeMark || "",
      });

      // Handle institute data
      if (data.instituteNames && data.instituteNames.length > 0) {
        const instituteOptions = data.instituteNames.map((name, index) => ({
          value: data.instituteIds?.[index] || `inst-${index}`,
          label: name
        }));
        console.log("Setting institutes:", instituteOptions);
        setSelectedInstitutes(instituteOptions);
      }

      // Handle subjects from questionsBySubject
      if (data.questionsBySubject) {
        // Extract subject names from the questionsBySubject object
        const subjectNames = Object.keys(data.questionsBySubject);
        
        // Map subject names to subject objects
        const subjectsList = subjectNames.map((subjectName) => {
          // Find the first question to get subjectId
          const firstQuestion = data.questionsBySubject[subjectName]?.[0];
          return {
            name: subjectName,
            id: firstQuestion?.subjectId || ""
          };
        });
        
        setSubjects(subjectsList);
        
        // If there are subjects, select the first one
        if (subjectsList.length > 0 && !selectedSubject.name) {
          const firstSubject = subjectsList[0];
          setSelectedSubject(firstSubject);
          
          // Get questions for the first subject
          const subjectQuestions = data.questionsBySubject[firstSubject.name] || [];
          
          // Format questions
          const formattedQuestions = subjectQuestions.map((q) => {
            // Find correct option
            let correctOption = null;
            let correctOptionText = "";
            
            if (q.options && Array.isArray(q.options)) {
              correctOption = q.options.find(opt => opt.isCorrect === true);
              correctOptionText = correctOption?.optionText || "";
            }
            
            // Format optionFiles
            const optionFiles = q.options ? q.options.map(opt => ({
              text: opt.optionText || "",
              image: opt.optionImageUrl,
              isCorrect: opt.isCorrect || false
            })) : [];
            
            return {
              id: q.id,
              questionText: q.questionText || "",
              questionText2: q.questionImageUrl,
              options: q.options || [],
              correctAnswer: correctOptionText,
              correctAnswerImage: null,
              positiveMarks: data.correctMark,
              negativeMarks: data.negativeMark,
              optionFiles: optionFiles,
              subjectId: q.subjectId,
              subjectName: q.subjectName
            };
          });
          
          console.log("Formatted questions for first subject:", formattedQuestions);
          setQuestions(formattedQuestions);
        }
      } else if (data.examType === "SUBJECT_WISE") {
        // Fallback for old structure
        const subjectData = {
          name: data.subjectName || "Subject",
          id: data.subjectId || ""
        };
        setSelectedSubject(subjectData);
        setSubjects([subjectData]);
        
        if (data.questions && data.questions.length > 0) {
          const formattedQuestions = data.questions.map((q) => {
            let correctOption = null;
            let correctOptionText = "";
            
            if (q.options && Array.isArray(q.options)) {
              correctOption = q.options.find(opt => opt.isCorrect === true);
              correctOptionText = correctOption?.optionText || "";
            }
            
            const optionFiles = q.options ? q.options.map(opt => ({
              text: opt.optionText,
              image: opt.optionImageUrl,
              isCorrect: opt.isCorrect
            })) : [];
            
            return {
              id: q.id,
              questionText: q.questionText || q.question,
              questionText2: q.questionImageUrl,
              options: q.options || [],
              correctAnswer: correctOptionText,
              correctAnswerImage: null,
              positiveMarks: data.correctMark,
              negativeMarks: data.negativeMark,
              optionFiles: optionFiles,
              instituteIds: data.instituteIds || [],
            };
          });
          console.log("Formatted subject-wise questions:", formattedQuestions);
          setQuestions(formattedQuestions);
        }
      }

    } catch (error) {
      console.error("Failed to fetch exam details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutes = async () => {
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      const response = await fetch(`${config.apiUrl}/users/role/ADMIN`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        setInstitutes(result);
      } else {
        console.error("Expected an array but received:", result.data);
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const handleInstituteChange = (selectedOptions) => {
    setSelectedInstitutes(selectedOptions);
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectName = e.target.value;
    const subject = subjects.find(
      (sub) => sub.name === selectedSubjectName
    ) || { name: selectedSubjectName, id: "" };
    setSelectedSubject(subject);

    // Get questions for selected subject from questionsBySubject
    if (examDetails?.questionsBySubject && examDetails.questionsBySubject[subject.name]) {
      const subjectQuestions = examDetails.questionsBySubject[subject.name];
      
      const formattedQuestions = subjectQuestions.map((q) => {
        // Find correct option
        let correctOption = null;
        let correctOptionText = "";
        
        if (q.options && Array.isArray(q.options)) {
          correctOption = q.options.find(opt => opt.isCorrect === true);
          correctOptionText = correctOption?.optionText || "";
        }
        
        // Format optionFiles
        const optionFiles = q.options ? q.options.map(opt => ({
          text: opt.optionText || "",
          image: opt.optionImageUrl,
          isCorrect: opt.isCorrect || false
        })) : [];
        
        return {
          id: q.id,
          questionText: q.questionText || "",
          questionText2: q.questionImageUrl,
          options: q.options || [],
          correctAnswer: correctOptionText,
          correctAnswerImage: null,
          positiveMarks: examDetails.correctMark,
          negativeMarks: examDetails.negativeMark,
          optionFiles: optionFiles,
          subjectId: q.subjectId,
          subjectName: q.subjectName
        };
      });
      
      console.log(`Formatted questions for ${subject.name}:`, formattedQuestions);
      setQuestions(formattedQuestions);
    } else {
      setQuestions([]);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) {
      return path;
    }
    if (path.startsWith("data:image")) {
      return path;
    }
    return `${config.apiUrl}${path}`;
  };

  // New function to handle basic details edit
  const handleBasicDetailsEdit = () => {
    setIsEditingBasicDetails(true);
  };

  // New function to save basic details
  const saveBasicDetails = async () => {
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      if (!token) {
        console.error("No auth token available");
        return;
      }

      const payload = {
        testName: editedDetails.testName,
        correctMark: parseFloat(editedDetails.positiveMarks),
        negativeMark: parseFloat(editedDetails.negativeMarks),
      };

      const apiUrl = `${config.apiUrl}/tests/${test_id}`;

      await axios.put(apiUrl, payload, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsEditingBasicDetails(false);
      // Refresh exam details to get updated data
      fetchExamDetails();
      
    } catch (error) {
      console.error("Failed to update basic details:", error);
    }
  };

  // New function to cancel basic details editing
  const cancelBasicDetailsEditing = () => {
    setIsEditingBasicDetails(false);
    // Reset to original values
    if (examDetails) {
      setEditedDetails({
        testName: examDetails.testName || "",
        positiveMarks: examDetails.correctMark || "",
        negativeMarks: examDetails.negativeMark || "",
      });
    }
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    const questionToEdit = questions[index];
    setEditingQuestion(JSON.parse(JSON.stringify(questionToEdit))); // Deep copy
    setText(questionToEdit.questionText);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setEditingQuestion((prev) => ({
      ...prev,
      questionText: e.target.value,
    }));
  };

  const handleOptionTextChange = (questionIndex, optionIndex, value) => {
    setEditingQuestion((prev) => {
      const updatedOptionFiles = [...prev.optionFiles];
      if (!updatedOptionFiles[optionIndex]) {
        updatedOptionFiles[optionIndex] = { text: "", image: null, isCorrect: false };
      }
      updatedOptionFiles[optionIndex].text = value;
      return {
        ...prev,
        optionFiles: updatedOptionFiles,
      };
    });
  };

  const handleImageUpload = (questionIndex, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingQuestion((prev) => ({
          ...prev,
          questionText2: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadOption = (e, questionIndex, optionIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingQuestion((prev) => {
          const updatedOptionFiles = [...prev.optionFiles];
          if (!updatedOptionFiles[optionIndex]) {
            updatedOptionFiles[optionIndex] = { text: "", image: null, isCorrect: false };
          }
          updatedOptionFiles[optionIndex].image = reader.result;
          return {
            ...prev,
            optionFiles: updatedOptionFiles,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteOptionImage = (questionIndex, optionIndex) => {
    setEditingQuestion((prev) => {
      const updatedOptionFiles = [...prev.optionFiles];
      if (updatedOptionFiles[optionIndex]) {
        updatedOptionFiles[optionIndex].image = null;
      }
      return {
        ...prev,
        optionFiles: updatedOptionFiles,
      };
    });
  };

  const removeImage = (questionIndex) => {
    setEditingQuestion((prev) => ({
      ...prev,
      questionText2: null,
    }));
  };

  const saveEditedQuestion = async () => {
    if (editingIndex == null || !editingQuestion) {
      console.error("Editing index or editing question is not set");
      return;
    }

    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      // Prepare question data payload according to the required format
      const questionData = {
        questionText: editingQuestion.questionText,
        marks: parseFloat(editedDetails.positiveMarks),
        options: editingQuestion.optionFiles.map((option, index) => ({
          optionNumber: index + 1,
          optionText: option.text,
          isCorrect: editingQuestion.correctAnswer === option.text
        }))
      };

      console.log("Saving question data:", questionData);

      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append('questionData', JSON.stringify(questionData));
      
      // Add question image if exists
      if (editingQuestion.questionText2 && editingQuestion.questionText2.startsWith('data:image')) {
        const questionImageBlob = dataURLtoBlob(editingQuestion.questionText2);
        formData.append('questionImage', questionImageBlob, 'question.png');
      }

      // Add option images if exist
      editingQuestion.optionFiles.forEach((option, index) => {
        if (option.image && option.image.startsWith('data:image')) {
          const optionImageBlob = dataURLtoBlob(option.image);
          formData.append(`option${index + 1}File`, optionImageBlob, `option${index + 1}.png`);
        }
      });

      const apiUrl = `${config.apiUrl}/tests/${test_id}/questions/${editingQuestion.id}`;

      await axios.put(apiUrl, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingIndex(null);
      setEditingQuestion(null);
      setText("");
      fetchExamDetails(); // Refresh data
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  // Helper function to convert data URL to blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingQuestion(null);
    setText("");
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100">
      <div className="flex-1" dangerouslySetInnerHTML={{ __html: label }} />
      {data.image && (
        <img 
          src={data.image.startsWith("data:image") ? data.image : `${config.apiUrl}${data.image}`} 
          alt="Option" 
          className="w-8 h-8 ml-2 object-contain"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />
          <div className="p-4 md:p-8">
            <h1 className="text-sm md:text-3xl font-bold mb-2 md:mb-6">
              {examDetails?.testName
                ? `Questions for ${examDetails.testName} (${language === 'hi' ? 'Hindi' : 'English'})`
                : "Questions"}
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading exam details...</p>
              </div>
            ) : (
              <>
                {/* Basic Details Section */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-600">Basic Test Details</h2>
                    {!isEditingBasicDetails ? (
                      <button
                        onClick={handleBasicDetailsEdit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaEdit /> Edit Details
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={saveBasicDetails}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={cancelBasicDetailsEditing}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Institute - Non Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Institute
                      </label>
                      <Select
                        options={institutes.map(inst => ({
                          value: inst.id,
                          label: inst.instituteName || `Institute ${inst.id}`
                        }))}
                        value={selectedInstitutes}
                        onChange={handleInstituteChange}
                        isMulti
                        isDisabled={true}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select Institute(s)"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Current: {selectedInstitutes.map(inst => inst.label).join(", ") || "No institutes selected"}
                      </div>
                    </div>

                    {/* Test Name - Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Test Name
                      </label>
                      <input
                        type="text"
                        name="testName"
                        value={editedDetails.testName}
                        onChange={handleDetailsChange}
                        className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 ${
                          isEditingBasicDetails 
                            ? "focus:ring-blue-500 bg-white" 
                            : "cursor-not-allowed bg-gray-100"
                        }`}
                        disabled={!isEditingBasicDetails}
                      />
                    </div>

                    {/* Exam Name - Non Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Exam Name
                      </label>
                      <input
                        type="text"
                        value={examDetails?.examName || "N/A"}
                        className="border border-gray-300 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    {/* Subjects - Non Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Subjects
                      </label>
                      <input
                        type="text"
                        value={subjects.map(sub => sub.name).join(", ") || "N/A"}
                        className="border border-gray-300 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    {/* Correct Marks - Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Correct Marks
                      </label>
                      <input
                        type="number"
                        name="positiveMarks"
                        value={editedDetails.positiveMarks}
                        onChange={handleDetailsChange}
                        className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 ${
                          isEditingBasicDetails 
                            ? "focus:ring-green-500 bg-white" 
                            : "cursor-not-allowed bg-gray-100"
                        }`}
                        disabled={!isEditingBasicDetails}
                        step="0.1"
                        min="0"
                      />
                    </div>

                    {/* Negative Marks - Editable */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Negative Marks
                      </label>
                      <input
                        type="number"
                        name="negativeMarks"
                        value={editedDetails.negativeMarks}
                        onChange={handleDetailsChange}
                        className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 ${
                          isEditingBasicDetails 
                            ? "focus:ring-red-500 bg-white" 
                            : "cursor-not-allowed bg-gray-100"
                        }`}
                        disabled={!isEditingBasicDetails}
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                    Exam Type: {examDetails?.examType || "N/A"}
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                    Duration: {examDetails?.durationMinutes || "N/A"} minutes
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                    Total Questions: {examDetails?.totalQuestions || "N/A"}
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                    Total Marks: {examDetails?.totalMarks || "N/A"}
                  </div>
                </div>

                {/* Subject dropdown (only show if multiple subjects exist) */}
                {subjects.length > 1 && (
                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-lg font-semibold text-gray-600 tracking-wide"
                    >
                      Select Subject:
                    </label>
                    <select
                      id="subject"
                      className="mt-2 block w-full p-3 border border-dashed rounded-lg bg-gray-50 shadow-inner border-gray-300 text-gray-700"
                      value={selectedSubject.name}
                      onChange={handleSubjectChange}
                    >
                      <option value="">Choose Subject</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Questions Section */}
                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div
                        key={question.id || index}
                        className="bg-white p-6 rounded-lg shadow-lg w-full"
                      >
                        {editingIndex === index ? (
                          <div className="mb-4 border p-4 rounded-md shadow-md bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold text-lg">
                                Edit Question {index + 1}
                              </h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditedQuestion}
                                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 mb-2">
                              <div className="w-full">
                                <div
                                  ref={renderRef}
                                  className="p-2 mb-2 border rounded bg-gray-100 whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{ __html: text }}
                                />
                                <textarea
                                  value={text}
                                  onChange={handleTextChange}
                                  className="w-full p-2 border rounded"
                                  placeholder="Enter text or LaTeX expressions (use $ for inline)"
                                  rows={4}
                                />
                              </div>
                            </div>

                            <div className="mt-2 mb-6">
                              <label className="block text-gray-700 font-semibold mb-2">
                                Upload PNG Image For Question
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  accept=".png,image/png"
                                  onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                      if (selectedFile.type === "image/png") {
                                        handleImageUpload(index, selectedFile);
                                        setFileInputValue(selectedFile.name);
                                      } else {
                                        alert(
                                          "Only PNG files are allowed. Please upload a valid PNG image."
                                        );
                                        if (fileInputRef.current) {
                                          fileInputRef.current.value = null;
                                        }
                                      }
                                    }
                                  }}
                                  className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 cursor-pointer"
                                />
                                {editingQuestion.questionText2 && (
                                  <div className="relative">
                                    <img
                                      src={getImageUrl(
                                        editingQuestion.questionText2
                                      )}
                                      alt="Uploaded"
                                      className="h-16 w-16 object-contain rounded-md shadow-md cursor-pointer"
                                    />
                                    <button
                                      onClick={() => {
                                        removeImage(index);
                                        setFileInputValue("");
                                        if (fileInputRef.current) {
                                          fileInputRef.current.value = null;
                                        }
                                      }}
                                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full focus:outline-none"
                                    >
                                      <FaTrashAlt size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {editingQuestion.optionFiles && editingQuestion.optionFiles.map(
                                (option, optionIndex) => (
                                  <div key={optionIndex} className="flex-grow">
                                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                      <div
                                        ref={(el) =>
                                          (optionMathJaxRefs.current[
                                            optionIndex
                                          ] = el)
                                        }
                                        className="p-2 mb-2 border rounded bg-gray-100 whitespace-pre-wrap min-h-[40px]"
                                        dangerouslySetInnerHTML={{
                                          __html: option?.text || "",
                                        }}
                                      />

                                      <textarea
                                        placeholder={`Option ${
                                          optionIndex + 1
                                        } (use $ for mathematical expressions)`}
                                        value={option?.text || ""}
                                        onChange={(e) =>
                                          handleOptionTextChange(
                                            index,
                                            optionIndex,
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                                        required
                                        rows={3}
                                      />

                                      <div className="mt-2">
                                        <input
                                          type="file"
                                          ref={(el) =>
                                            (optionFileInputRefs.current[
                                              optionIndex
                                            ] = el)
                                          }
                                          accept="image/png"
                                          onChange={(e) =>
                                            handleImageUploadOption(
                                              e,
                                              index,
                                              optionIndex
                                            )
                                          }
                                          className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                                        />

                                        {option?.image && (
                                          <div className="relative mt-2">
                                            <img
                                              src={getImageUrl(option.image)}
                                              alt={`Option ${optionIndex + 1}`}
                                              className="w-12 h-12 object-contain rounded-lg cursor-pointer"
                                            />
                                            <button
                                              onClick={() => {
                                                deleteOptionImage(
                                                  index,
                                                  optionIndex
                                                );
                                                if (
                                                  optionFileInputRefs.current[
                                                    optionIndex
                                                  ]
                                                ) {
                                                  optionFileInputRefs.current[
                                                    optionIndex
                                                  ].value = null;
                                                }
                                              }}
                                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full focus:outline-none text-sm flex items-center justify-center hover:bg-red-600"
                                              aria-label="Delete image"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="relative w-full mt-6">
                              <label className="block text-gray-700 font-semibold mb-2">
                                Correct Answer
                              </label>
                              <Select
                                options={editingQuestion.optionFiles ? editingQuestion.optionFiles.map((option, idx) => ({
                                  value: idx,
                                  label: option.text,
                                  image: option.image
                                })) : []}
                                value={editingQuestion.optionFiles ? editingQuestion.optionFiles.find((opt, idx) => 
                                  opt.text === editingQuestion.correctAnswer
                                ) ? {
                                  value: editingQuestion.optionFiles.findIndex(
                                    opt => opt.text === editingQuestion.correctAnswer
                                  ),
                                  label: editingQuestion.correctAnswer,
                                  image: editingQuestion.correctAnswerImage
                                } : null : null}
                                onChange={(selectedOption) => {
                                  const updatedEditingQuestion = { ...editingQuestion };
                                  updatedEditingQuestion.correctAnswer = selectedOption?.label || "";
                                  updatedEditingQuestion.correctAnswerImage = selectedOption?.image || null;
                                  setEditingQuestion(updatedEditingQuestion);
                                }}
                                components={{ Option: CustomOption }}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select Correct Answer"
                                getOptionLabel={option => option.label}
                                getOptionValue={option => option.value}
                                styles={{
                                  option: (provided) => ({
                                    ...provided,
                                    display: 'flex',
                                    alignItems: 'center'
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    display: 'flex',
                                    alignItems: 'center'
                                  })
                                }}
                                formatOptionLabel={(option) => (
                                  <div className="flex items-center">
                                    <div dangerouslySetInnerHTML={{ __html: option.label }} />
                                    {option.image && (
                                      <img 
                                        src={option.image.startsWith("data:image") ? 
                                          option.image : 
                                          `${config.apiUrl}${option.image}`} 
                                        alt="Option" 
                                        className="w-8 h-8 ml-2 object-contain"
                                      />
                                    )}
                                  </div>
                                )}
                              />
                              {editingQuestion.correctAnswerImage && (
                                <div className="mt-2">
                                  <img
                                    src={getImageUrl(editingQuestion.correctAnswerImage)}
                                    alt="Correct answer"
                                    className="h-16 w-16 object-cover rounded-lg shadow-md mt-2"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">
                                  <span className="font-bold text-blue-600">
                                    Question {index + 1}:
                                  </span>{" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: question.questionText || "No question text",
                                    }}
                                  />
                                </h3>
                                <button
                                  onClick={() => handleEditQuestion(index)}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </div>

                              {question.questionText2 && (
                                <div className="mt-2">
                                  {question.questionText2.endsWith(".png") ||
                                  question.questionText2.endsWith(".jpg") ||
                                  question.questionText2.endsWith(".jpeg") ||
                                  question.questionText2.includes("/media/") ||
                                  question.questionText2.startsWith(
                                    "data:image"
                                  ) ? (
                                    <div className="relative">
                                      <img
                                        src={getImageUrl(
                                          question.questionText2
                                        )}
                                        alt={`Additional question ${
                                          index + 1
                                        } content`}
                                        className="max-w-xs max-h-32 rounded-lg shadow-md mt-2"
                                      />
                                    </div>
                                  ) : (
                                    <p className="mt-2 text-lg">
                                      {question.questionText2}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-4">
                              <h4 className="text-xl font-bold text-blue-600 mb-2">
                                Options:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options && question.options.map((option, idx) => {
                                  const optionLabel = String.fromCharCode(65 + idx);
                                  return (
                                    <div
                                      key={option.id || idx}
                                      className={`bg-gray-50 p-4 rounded-lg shadow-md ${
                                        option.isCorrect ? 'border-2 border-green-500 bg-green-50' : ''
                                      }`}
                                    >
                                      <label className="block text-lg font-semibold text-gray-700">
                                        {optionLabel}){" "}
                                        <span
                                          ref={(el) => (optionTextRefs.current[idx] = el)}
                                          dangerouslySetInnerHTML={{
                                            __html: option.optionText || "",
                                          }}
                                        />
                                        {option.isCorrect && (
                                          <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                                        )}
                                      </label>
                                      {option.optionImageUrl && (
                                        <div className="relative mt-2">
                                          <img
                                            src={getImageUrl(option.optionImageUrl)}
                                            alt={`Option ${optionLabel} image`}
                                            className="max-w-xs max-h-24 rounded-lg shadow-md mt-2"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="mt-4 p-3 bg-green-100 rounded text-green-800">
                              <div className="flex justify-between items-center">
                                <div>
                                  <strong>Correct Answer:</strong>
                                  <span className="ml-2">
                                    {question.correctAnswer || "No correct answer specified"}
                                  </span>
                                </div>
                              </div>
                              {question.correctAnswerImage && (
                                <div className="relative mt-2">
                                  <img
                                    src={getImageUrl(
                                      question.correctAnswerImage
                                    )}
                                    alt="Correct answer image"
                                    className="max-w-xs max-h-24 rounded-lg shadow-md mt-2"
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : selectedSubject.name ? (
                  <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-lg">
                      No questions available for {selectedSubject.name}.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-lg">
                      Please select a subject to view questions.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;