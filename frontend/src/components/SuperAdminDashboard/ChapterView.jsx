import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import DashboardHeader from "../SuperAdminDashboard/Header";
import axios from "axios";
import config from "../../config";
import { useLocation } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import Select from "react-select";

const ChapterView = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testDetails, setTestDetails] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testName = queryParams.get("test");
  const language = queryParams.get("lang").toUpperCase();
  const testId = queryParams.get("subject_id");
  

  // Data URL to Blob conversion function
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

  // Fetch test details
  const fetchTestDetails = async () => {
    setLoading(true);
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      if (!token || !testId) {
        console.error("No auth token or test ID available");
        setLoading(false);
        return;
      }

      // Fetch test basic details
      const testResponse = await axios.get(
        `${config.apiUrl}/tests/${testId}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const testData = testResponse.data;
      setTestDetails(testData);
      
      // Set editable details
      setEditedDetails({
        testName: testData.testName || "",
        positiveMarks: testData.correctMark || "",
        negativeMarks: testData.negativeMark || "",
      });

      // Fetch questions with language
      if (language) {
        await fetchQuestions(token);
      }

    } catch (error) {
      console.error("Failed to fetch test details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions
  const fetchQuestions = async (token) => {
    try {
      
      const questionsResponse = await axios.get(
        `${config.apiUrl}/tests/${testId}/with-questions/${language}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const questionsData = questionsResponse.data;
      console.log("Fetched questions data:", questionsData);
      const formattedQuestions = questionsData.questions.map((q, index) => ({
        id: q.id,
        questionText: q.questionText || "",
        questionText2: q.questionImageUrl || null,
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
        positiveMarks: q.marks || "",
        optionFiles: (q.options || []).map(option => ({
          text: option.optionText || "",
          image: option.optionImageUrl || null,
          isCorrect: option.isCorrect || false
        })),
        questionImageUrl: q.questionImageUrl || null,
        optionImagesUrls: q.optionImagesUrls || []
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // Update test details
  const updateTestDetails = async () => {
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      const payload = {
        testName: editedDetails.testName,
        correctMark: parseFloat(editedDetails.positiveMarks),
        negativeMark: parseFloat(editedDetails.negativeMarks)
      };

      await axios.put(
        `${config.apiUrl}/tests/${testId}`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsEditingDetails(false);
      // Refresh data
      fetchTestDetails();
    } catch (error) {
      console.error("Failed to update test details:", error);
    }
  };

  // Save edited question
  const saveEditedQuestion = async () => {
    if (editingIndex == null || !editingQuestion) {
      console.error("Editing index or editing question is not set");
      return;
    }

    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

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

      await axios.put(
        `${config.apiUrl}/tests/${testId}/questions/${editingQuestion.id}`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editingQuestion;
      setQuestions(updatedQuestions);
      
      // Reset editing states
      setEditingIndex(null);
      setEditingQuestion(null);
      setText("");
      
      // Refresh questions from server
      await fetchQuestions(token);
      
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  // Initialize and fetch data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (testId) {
      fetchTestDetails();
    } else {
      setLoading(false);
    }

    // Initialize MathJax
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
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
  }, [testId, language]);

  useEffect(() => {
    if (window.MathJax) {
      renderAllEquations();
    }
  }, [questions, editingIndex, editingQuestion]);

  const renderAllEquations = () => {
    if (window.MathJax) {
      if (renderRef.current) {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, renderRef.current]);
      }
      optionMathJaxRefs.current.forEach((ref) => {
        if (ref) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, ref]);
        }
      });
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:image")) {
      return path;
    }
    return `${config.apiUrl}${path}`;
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    const questionToEdit = questions[index];
    setEditingQuestion({ ...questionToEdit });
    setText(questionToEdit.questionText);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setEditingQuestion((prev) => ({
      ...prev,
      questionText: e.target.value,
    }));
  };

  const handleOptionTextChange = (optionIndex, value) => {
    const updatedEditingQuestion = { ...editingQuestion };
    if (!updatedEditingQuestion.optionFiles[optionIndex]) {
      updatedEditingQuestion.optionFiles[optionIndex] = {
        text: "",
        image: null,
      };
    }
    updatedEditingQuestion.optionFiles[optionIndex].text = value;
    setEditingQuestion(updatedEditingQuestion);
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedEditingQuestion = { ...editingQuestion };
        updatedEditingQuestion.questionText2 = reader.result;
        setEditingQuestion(updatedEditingQuestion);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadOption = (e, optionIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedEditingQuestion = { ...editingQuestion };
        if (!updatedEditingQuestion.optionFiles[optionIndex]) {
          updatedEditingQuestion.optionFiles[optionIndex] = {
            text: "",
            image: null,
          };
        }
        updatedEditingQuestion.optionFiles[optionIndex].image = reader.result;
        setEditingQuestion(updatedEditingQuestion);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteOptionImage = (optionIndex) => {
    const updatedEditingQuestion = { ...editingQuestion };
    if (updatedEditingQuestion.optionFiles[optionIndex]) {
      updatedEditingQuestion.optionFiles[optionIndex].image = null;
      setEditingQuestion(updatedEditingQuestion);
    }
  };

  const removeImage = () => {
    const updatedEditingQuestion = { ...editingQuestion };
    updatedEditingQuestion.questionText2 = null;
    setEditingQuestion(updatedEditingQuestion);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingQuestion(null);
    setText("");
  };

  const handleDetailsEdit = () => {
    setIsEditingDetails(true);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cancelDetailsEdit = () => {
    setIsEditingDetails(false);
    if (testDetails) {
      setEditedDetails({
        testName: testDetails.testName || "",
        positiveMarks: testDetails.correctMark || "",
        negativeMarks: testDetails.negativeMark || "",
      });
    }
  };

  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100">
      <div className="flex-1" dangerouslySetInnerHTML={{ __html: label }} />
      {data.image && (
        <img 
          src={getImageUrl(data.image)} 
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
        <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />
          <div className="p-4 md:p-8">
            <h1 className="text-sm md:text-3xl font-bold mb-2 md:mb-6">
              {testName ? `Questions for ${testName} (${language || "English"})` : "Questions"}
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading test details...</p>
              </div>
            ) : (
              <>
                {/* Test Details Section */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-bold mb-4">Test Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Institute Name - Non Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institute
                      </label>
                      <div className="border border-gray-300 p-2 rounded bg-gray-100 text-gray-600">
                        {testDetails?.instituteNames?.join(', ') || 'N/A'}
                      </div>
                    </div>

                    {/* Test Name - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Name
                      </label>
                      {isEditingDetails ? (
                        <input
                          type="text"
                          name="testName"
                          value={editedDetails.testName}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="border border-gray-300 p-2 rounded bg-white flex justify-between items-center">
                          <span>{editedDetails.testName}</span>
                          <button onClick={handleDetailsEdit} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subject Name - Non Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <div className="border border-gray-300 p-2 rounded bg-gray-100 text-gray-600">
                        {testDetails?.subjectNames?.join(', ') || testDetails?.subjectName || 'N/A'}
                      </div>
                    </div>

                    {/* Chapter Name - Non Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chapter
                      </label>
                      <div className="border border-gray-300 p-2 rounded bg-gray-100 text-gray-600">
                        {testDetails?.chapterNames?.join(', ') || 'N/A'}
                      </div>
                    </div>

                    {/* Correct Marks - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Marks
                      </label>
                      {isEditingDetails ? (
                        <input
                          type="number"
                          step="0.01"
                          name="positiveMarks"
                          value={editedDetails.positiveMarks}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <div className="border border-gray-300 p-2 rounded bg-white flex justify-between items-center">
                          <span>{editedDetails.positiveMarks}</span>
                          <button onClick={handleDetailsEdit} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Negative Marks - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Negative Marks
                      </label>
                      {isEditingDetails ? (
                        <input
                          type="number"
                          step="0.01"
                          name="negativeMarks"
                          value={editedDetails.negativeMarks}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      ) : (
                        <div className="border border-gray-300 p-2 rounded bg-white flex justify-between items-center">
                          <span>{editedDetails.negativeMarks}</span>
                          <button onClick={handleDetailsEdit} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingDetails && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={updateTestDetails}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save Details
                      </button>
                      <button
                        onClick={cancelDetailsEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Questions Section */}
                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id} className="bg-white p-6 rounded-lg shadow-lg">
                        {editingIndex === index ? (
                          // Edit Question View
                          <div className="border p-4 rounded-md shadow-md bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-lg">Edit Question {index + 1}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditedQuestion}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            {/* Question Text */}
                            <div className="mb-4">
                              <label className="block text-gray-700 font-semibold mb-2">Question Text</label>
                              <div ref={renderRef} className="p-2 mb-2 border rounded bg-gray-100 whitespace-pre-wrap" />
                              <textarea
                                value={text}
                                onChange={handleTextChange}
                                className="w-full p-2 border rounded"
                                placeholder="Enter question text"
                                rows={4}
                              />
                            </div>

                            {/* Question Image */}
                            <div className="mb-4">
                              <label className="block text-gray-700 font-semibold mb-2">Question Image</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleImageUpload(file);
                                  }}
                                  className="border p-2 rounded-md"
                                />
                                {editingQuestion?.questionText2 && (
                                  <div className="relative">
                                    <img
                                      src={getImageUrl(editingQuestion.questionText2)}
                                      alt="Question"
                                      className="h-32 w-32 object-cover rounded-md shadow-md"
                                    />
                                    <button
                                      onClick={removeImage}
                                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    >
                                      <FaTrashAlt size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {editingQuestion?.optionFiles?.map((option, optionIndex) => (
                                <div key={optionIndex} className="bg-white p-4 rounded-lg shadow-md">
                                  <div
                                    ref={(el) => (optionMathJaxRefs.current[optionIndex] = el)}
                                    className="p-2 mb-2 border rounded bg-gray-100 min-h-[40px]"
                                  />
                                  <textarea
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={option?.text || ""}
                                    onChange={(e) => handleOptionTextChange(optionIndex, e.target.value)}
                                    className="border p-2 w-full rounded-md mb-2"
                                    rows={3}
                                  />
                                  <input
                                    type="file"
                                    ref={(el) => (optionFileInputRefs.current[optionIndex] = el)}
                                    accept="image/*"
                                    onChange={(e) => handleImageUploadOption(e, optionIndex)}
                                    className="border p-2 w-full rounded-md mb-2"
                                  />
                                  {option?.image && (
                                    <div className="relative">
                                      <img
                                        src={getImageUrl(option.image)}
                                        alt={`Option ${optionIndex + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg"
                                      />
                                      <button
                                        onClick={() => deleteOptionImage(optionIndex)}
                                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}
 
                                </div>
                              ))}
                            </div>

                            {/* Correct Answer */}
                            <div className="mb-4">
                              <label className="block text-gray-700 font-semibold mb-2">Correct Answer</label>
                              <Select
                                options={editingQuestion?.optionFiles?.map((option, idx) => ({
                                  value: idx,
                                  label: option.text,
                                  image: option.image
                                }))}
                                value={editingQuestion?.optionFiles?.find((opt, idx) => 
                                  opt.text === editingQuestion.correctAnswer
                                ) ? {
                                  value: editingQuestion?.optionFiles?.findIndex(
                                    opt => opt.text === editingQuestion.correctAnswer
                                  ),
                                  label: editingQuestion.correctAnswer,
                                } : null}
                                onChange={(selectedOption) => {
                                  const updated = { ...editingQuestion };
                                  updated.correctAnswer = selectedOption?.label || "";
                                  setEditingQuestion(updated);
                                }}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select Correct Answer"
                                formatOptionLabel={(option) => (
                                  <div className="flex items-center">
                                    <div dangerouslySetInnerHTML={{ __html: option.label }} />
                                    {option.image && (
                                      <img 
                                        src={getImageUrl(option.image)} 
                                        alt="Option" 
                                        className="w-8 h-8 ml-2 object-contain"
                                      />
                                    )}
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        ) : (
                          // Display Question View
                          <>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold">
                                <span className="font-bold text-blue-600">Question {index + 1}:</span>
                                <span dangerouslySetInnerHTML={{ __html: question.questionText }} />
                              </h3>
                              <button
                                onClick={() => handleEditQuestion(index)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>

                            {question.questionText2 && (
                              <div className="mb-4">
                                <img
                                  src={getImageUrl(question.questionText2)}
                                  alt="Question"
                                  className="max-w-md h-auto rounded-lg shadow-md"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {question.optionFiles.map((option, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                  
                                  <div className="font-semibold">
                                    {String.fromCharCode(65 + idx)}) 
                                    <span dangerouslySetInnerHTML={{ __html: option.text }} />
                                  </div>
                                  {option.image && (
                                    <img
                                      src={getImageUrl(option.image)}
                                      alt={`Option ${String.fromCharCode(65 + idx)}`}
                                      className="mt-2 max-w-xs h-auto rounded-lg"
                                    />
                                  )}
                                  
                                </div>
                              ))}
                            </div>

                            <div className="bg-blue-100 p-3 rounded text-blue-800">
                              <strong>Correct Answer:</strong> {question.correctAnswer}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-lg">No questions available for this test.</p>
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

export default ChapterView;