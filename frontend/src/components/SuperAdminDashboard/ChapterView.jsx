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
  const [examDetails, setExamDetails] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    testName: "",
    positiveMarks: "",
    negativeMarks: "",
  });
  const [chapterId, setChapterId] = useState("");

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
  const language = queryParams.get("lang");
  const examId = queryParams.get("subject_id");

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

    if (examId) {
      fetchExamDetails();
    } else {
      setLoading(false);
    }

    optionMathJaxRefs.current = optionMathJaxRefs.current.slice(0, 4);
    optionFileInputRefs.current = optionFileInputRefs.current.slice(0, 4);
    optionTextRefs.current = optionTextRefs.current.slice(0, 4);
  }, [examId]);

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

      const { data } = await axios.get(
        `${config.apiUrl}/get-single-exam-details-based-on-subjects/?subject_id=${examId}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setExamDetails(data);

      if (data.data?.chapters) {
        const chaptersList = Object.keys(data.data.chapters);
        if (chaptersList.length > 0) {
          const firstChapter = chaptersList[0];
          setChapterName(firstChapter);

          if (data.data.chapters[firstChapter].length > 1) {
            setChapterId(data.data.chapters[firstChapter][1].chapter_id);
          }

          loadQuestionsForChapter(firstChapter, data.data.chapters);

          const chapterMeta = data.data.chapters[firstChapter][0];
          setEditedDetails({
            testName: chapterMeta.test_name || "",
            positiveMarks: chapterMeta._positive_marks || "",
            negativeMarks: chapterMeta._negative_marks || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch exam details:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionsForChapter = (chapter, chaptersData) => {
    if (chaptersData && chaptersData[chapter]) {
      const chapterQuestions = chaptersData[chapter].slice(1);

      const formattedQuestions = chapterQuestions.map((q) => ({
        id: q.id,
        questionText: q.question,
        questionText2: q.question_1,
        options: [q.option_1, q.option_2, q.option_3, q.option_4].filter(
          Boolean
        ),
        correctAnswer: q.correct_answer,
        correctAnswerImage: q.correct_ans2,
        positiveMarks: q.marks,
        negativeMarks: q.negative_marks,
        optionFiles: [
          { text: q.option_1, image: q.file_1 },
          { text: q.option_2, image: q.file_2 },
          { text: q.option_3, image: q.file_3 },
          { text: q.option_4, image: q.file_4 },
        ].filter((opt) => opt.text),
        chapterId: q.chapter_id,
      }));

      setQuestions(formattedQuestions);
    } else {
      setQuestions([]);
    }
  };

  const fetchInstitutes = async () => {
    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

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

      if (Array.isArray(result.data)) {
        const formattedInstitutes = result.data.map((institute) => ({
          value: institute.id,
          label: institute.institute_name,
        }));

        setInstitutes(formattedInstitutes);
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

  const handleOptionTextChange = (questionIndex, optionIndex, value) => {
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

  const handleImageUpload = (questionIndex, file) => {
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

  const handleImageUploadOption = (e, questionIndex, optionIndex) => {
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

  const deleteOptionImage = (questionIndex, optionIndex) => {
    const updatedEditingQuestion = { ...editingQuestion };
    if (updatedEditingQuestion.optionFiles[optionIndex]) {
      updatedEditingQuestion.optionFiles[optionIndex].image = null;
      setEditingQuestion(updatedEditingQuestion);
    }
  };

  const removeImage = (questionIndex) => {
    const updatedEditingQuestion = { ...editingQuestion };
    updatedEditingQuestion.questionText2 = null;
    setEditingQuestion(updatedEditingQuestion);
  };

  const saveEditedQuestion = async () => {
    if (editingIndex == null || !editingQuestion) {
      console.error("Editing index or editing question is not set");
      return;
    }

    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      const payload = {
        id: editingQuestion.id,
        question: editingQuestion.questionText || "",
        option_1: editingQuestion.optionFiles?.[0]?.text || "",
        option_2: editingQuestion.optionFiles?.[1]?.text || "",
        option_3: editingQuestion.optionFiles?.[2]?.text || "",
        option_4: editingQuestion.optionFiles?.[3]?.text || "",
        correct_answer: editingQuestion.correctAnswer || "",
        marks: editedDetails.positiveMarks || editingQuestion.positiveMarks,
        negative_marks: editedDetails.negativeMarks || editingQuestion.negativeMarks || "0.50",
        language: language || "en",
        institutes: selectedInstitutes?.map((inst) => inst.value) || [],
        for_exam_subjects_o: [examId] || " ",
        for_exam_chapter_o_id: [editingQuestion.chapterId] || [chapterId],
        test_name: editedDetails.testName,
      };

      // Handle image uploads if they are new files (data URLs)
      if (editingQuestion.questionText2 && editingQuestion.questionText2.startsWith("data:image")) {
        payload.question_1 = editingQuestion.questionText2;
      }

      if (editingQuestion.correctAnswerImage && editingQuestion.correctAnswerImage.startsWith("data:image")) {
        payload.correct_answer2 = editingQuestion.correctAnswerImage;
      }

      for (let i = 0; i < 4; i++) {
        const option = editingQuestion.optionFiles?.[i];
        if (option?.image && option.image.startsWith("data:image")) {
          payload[`file_${i + 1}`] = option.image;
        }
      }

      await axios.put(`${config.apiUrl}/bulk-update-questions/`, [payload], {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update local state immediately with the edited question
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        ...editingQuestion,
        // Convert data URLs back to server paths if needed
        questionText2: editingQuestion.questionText2?.startsWith("data:image") 
          ? "updated-image.png" // This should be replaced with the actual path from the server response
          : editingQuestion.questionText2,
        correctAnswerImage: editingQuestion.correctAnswerImage?.startsWith("data:image")
          ? "updated-correct-answer.png" // This should be replaced with the actual path from the server response
          : editingQuestion.correctAnswerImage,
        optionFiles: editingQuestion.optionFiles.map(opt => ({
          text: opt.text,
          image: opt.image?.startsWith("data:image") 
            ? "updated-option-image.png" // This should be replaced with the actual path from the server response
            : opt.image
        }))
      };

      setQuestions(updatedQuestions);
      
      // Reset editing states
      setEditingIndex(null);
      setEditingQuestion(null);
      setText("");
      setIsEditingDetails(false);
      
      // Refresh data from server to get the actual paths
      fetchExamDetails();
    } catch (error) {
      console.error("Failed to update questions and exam details:", error);
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingQuestion(null);
    setText("");
    setIsEditingDetails(false);
  };

  const handleDetailsEdit = () => {
    setIsEditingDetails(true);
    if (questions.length > 0) {
      handleEditQuestion(0);
    }
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
    if (examDetails?.data?.chapters && chapterName) {
      const chapterMeta = examDetails.data.chapters[chapterName][0];
      setEditedDetails({
        testName: chapterMeta.test_name || "",
        positiveMarks: chapterMeta._positive_marks || "",
        negativeMarks: chapterMeta._negative_marks || "",
      });
    }
    cancelEditing();
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
              {testName
                ? `Questions for ${testName} (${language || "English"})`
                : "Questions"}
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading exam details...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-1 md:gap-4 mb-2 md:mb-6 mt-1 md:mt-4">
                  <div className="flex gap-1 md:gap-4 w-full">
                    <div className="flex-grow">
                      <div className="bg-white p-2 rounded-md border border-gray-300 shadow-sm flex items-center gap-2">
                        {isEditingDetails ? (
                          <input
                            type="text"
                            name="testName"
                            value={editedDetails.testName}
                            onChange={handleDetailsChange}
                            disabled
                            className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                          />
                        ) : (
                          <>
                            <span className="text-blue-600 font-semibold">
                              Test Name: {editedDetails.testName}
                            </span>
                            <button
                              onClick={handleDetailsEdit}
                              className="text-blue-600 hover:text-blue-800 ml-auto"
                            >
                              <FaEdit />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex-grow bg-white p-2 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                      Chapter: {chapterName || "Loading..."}
                    </div>
                  </div>

                  <div className="flex gap-1 md:gap-4 w-full">
                    <div className="flex-grow">
                      <Select
                        options={institutes}
                        onChange={handleInstituteChange}
                        value={selectedInstitutes}
                        isMulti
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
                  </div>

                  <div className="flex gap-1 md:gap-4 w-full">
                    <div className="flex-grow">
                      <div className="bg-white p-2 rounded-md border border-gray-300 shadow-sm">
                        {isEditingDetails ? (
                          <input
                            type="number"
                            name="positiveMarks"
                            value={editedDetails.positiveMarks}
                            onChange={handleDetailsChange}
                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        ) : (
                          <div className="text-green-600 font-semibold">
                            Positive Marks:{" "}
                            {editedDetails.positiveMarks || "N/A"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="bg-white p-2 rounded-md border border-gray-300 shadow-sm">
                        {isEditingDetails ? (
                          <input
                            type="number"
                            name="negativeMarks"
                            value={editedDetails.negativeMarks}
                            onChange={handleDetailsChange}
                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <div className="text-red-600 font-semibold">
                            Negative Marks:{" "}
                            {editedDetails.negativeMarks || "N/A"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-2 md:space-y-6">
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 md:p-6 rounded-lg shadow-lg w-full"
                      >
                        {editingIndex === index || isEditingDetails ? (
                          <div className="mb-2 sm:mb-4 border p-2 sm:p-4 rounded-md shadow-md bg-gray-50">
                            <div className="flex justify-between items-center mb-1 sm:mb-2">
                              <h4 className="font-semibold text-sm sm:text-lg">
                                Edit Question {index + 1}
                              </h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditedQuestion}
                                  className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 text-xs sm:text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
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
                              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                                Upload PNG Image For Question
                              </label>
                              <div className="flex items-center gap-4 flex-col sm:flex-row">
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
                                  className="border p-1 sm:p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 cursor-pointer text-xs sm:text-sm"
                                />
                                {editingQuestion?.questionText2 && (
                                  <div className="relative">
                                    <img
                                      src={getImageUrl(editingQuestion.questionText2)}
                                      alt="Uploaded"
                                      className="h-16 w-16 object-cover rounded-md shadow-md cursor-pointer"
                                    />
                                    <button
                                      onClick={() => {
                                        removeImage(index);
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

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
                              {editingQuestion?.optionFiles?.map(
                                (option, optionIndex) => (
                                  <div key={optionIndex} className="flex-grow">
                                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                      <div
                                        ref={(el) =>
                                          (optionMathJaxRefs.current[
                                            optionIndex
                                          ] = el)
                                        }
                                        className="p-2 mb-2 border rounded bg-gray-100 whitespace-pre-wrap min-h-[40px] text-sm"
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
                                        className="border p-1 sm:p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base"
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
                                          className="border p-1 sm:p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-base"
                                        />

                                        {option?.image && (
                                          <div className="relative mt-2">
                                            <img
                                              src={getImageUrl(option.image)}
                                              alt={`Option ${optionIndex + 1}`}
                                              className="w-16 h-16 object-cover rounded-lg cursor-pointer"
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
                                              className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full focus:outline-none text-xs sm:text-sm flex items-center justify-center hover:bg-red-600"
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
                              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                                Correct Answer
                              </label>
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
                                  image: editingQuestion.correctAnswerImage
                                } : null}
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
                              {editingQuestion?.correctAnswerImage && (
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
                                <h3 className="text-sm md:text-xl font-semibold">
                                  <span className="font-bold text-blue-600">
                                    Question {index + 1}:
                                  </span>{" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: question.questionText,
                                    }}
                                  />
                                </h3>
                                <button
                                  onClick={() => handleEditQuestion(index)}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs md:text-sm"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </div>

                              {question.questionText2 && (
                                <div className="mt-2">
                                  {question.questionText2.endsWith(".png") ||
                                  question.questionText2.endsWith(".jpg") ||
                                  question.questionText2.endsWith(".jpeg") ||
                                  question.questionText2.includes("/media/") ? (
                                    <img
                                      src={getImageUrl(question.questionText2)}
                                      alt={`Additional question ${
                                        index + 1
                                      } content`}
                                      className="h-16 w-16 object-cover rounded-lg shadow-md mt-2"
                                    />
                                  ) : (
                                    <p className="mt-2 text-sm md:text-lg">
                                      {question.questionText2}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-1 md:mt-4">
                              <h4 className="text-sm md:text-xl font-bold text-blue-600 mb-1 md:mb-2">
                                Options:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4">
                                {question.optionFiles &&
                                  question.optionFiles.map((option, idx) => {
                                    const optionLabel = String.fromCharCode(
                                      65 + idx
                                    );
                                    return (
                                      <div
                                        key={idx}
                                        className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md"
                                      >
                                        <label className="block text-xs md:text-lg font-semibold text-gray-700">
                                          {optionLabel}){" "}
                                          <span
                                            ref={(el) =>
                                              (optionTextRefs.current[idx] = el)
                                            }
                                            dangerouslySetInnerHTML={{
                                              __html: option.text,
                                            }}
                                          />
                                        </label>
                                        {option.image && (
                                          <div className="mt-2">
                                            <img
                                              src={getImageUrl(option.image)}
                                              alt={`Option ${optionLabel} image`}
                                              className="h-16 w-16 object-cover rounded-lg shadow-md mt-2"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="mt-1 md:mt-4 p-1 md:p-3 bg-blue-100 rounded text-blue-800">
                              <strong>Correct Answer:</strong>
                              <span className="ml-1 md:ml-2">
                                {question.correctAnswer}
                              </span>
                              {question.correctAnswerImage && (
                                <div className="mt-2">
                                  <img
                                    src={getImageUrl(
                                      question.correctAnswerImage
                                    )}
                                    alt="Correct answer image"
                                    className="h-16 w-16 object-cover rounded-lg shadow-md mt-2"
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-lg">
                      No questions available for this chapter.
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

export default ChapterView; 