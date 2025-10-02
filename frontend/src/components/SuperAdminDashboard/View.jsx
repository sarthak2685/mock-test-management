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
  const language = queryParams.get("lang") || queryParams.get("language") || "en"; // Handle both parameter names
  const examId = queryParams.get("exam_id");
  const subjectId = queryParams.get("subject_id"); // For subject tests

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

    if (examId || subjectId) {
      fetchExamDetails();
    } else {
      setLoading(false);
    }

    optionMathJaxRefs.current = optionMathJaxRefs.current.slice(0, 4);
    optionFileInputRefs.current = optionFileInputRefs.current.slice(0, 4);
    optionTextRefs.current = optionTextRefs.current.slice(0, 4);
  }, [examId, subjectId]);

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

      let apiUrl = '';
      
      // Use appropriate API endpoint based on whether it's an exam or subject test
      if (examId) {
        apiUrl = `${config.apiUrl}/get-single-exam-details/?exam_id=${examId}&language=${language}`;
      } else if (subjectId) {
        apiUrl = `${config.apiUrl}/get-single-exam-details/?subject_id=${subjectId}&language=${language}`;
      } else {
        console.error("No exam_id or subject_id provided");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(apiUrl, {
        headers: { Authorization: `Token ${token}` },
      });

      setExamDetails(data);

      const examData = data.data[testName || Object.keys(data.data)[1]];
      const positiveMarks = examData?._positive_marks || "";
      const negativeMarks = examData?._negative_marks || "";

      setEditedDetails({
        testName: testName || Object.keys(data.data)[1],
        positiveMarks,
        negativeMarks,
      });

      if (data.data) {
        if (examData) {
          const subjectsList = Object.keys(examData)
            .filter(
              (key) =>
                typeof examData[key] === "object" &&
                !Array.isArray(examData[key]) &&
                key !== "exam_duration" &&
                !key.startsWith("_")
            )
            .map((subjectName) => {
              const firstQuestion = examData[subjectName]?.questions?.[0];
              return {
                name: subjectName,
                id: firstQuestion?.subject_id || "",
              };
            });

          setSubjects(subjectsList);

          if (subjectsList.length > 0 && !selectedSubject.name) {
            const firstSubject = subjectsList[0];
            setSelectedSubject(firstSubject);

            if (examData[firstSubject.name]?.questions) {
              const formattedQuestions = examData[
                firstSubject.name
              ].questions.map((q) => ({
                id: q.id,
                questionText: q.question,
                questionText2: q.question2,
                options: [
                  q.option_1,
                  q.option_2,
                  q.option_3,
                  q.option_4,
                  q.option_5,
                ].filter(Boolean),
                correctAnswer: q.correct_ans,
                correctAnswerImage: q.correct_ans2,
                positiveMarks: q.positive_marks || positiveMarks,
                negativeMarks: q.negative_marks || negativeMarks,
                optionFiles: [
                  { text: q.option_1, image: q.file_1 },
                  { text: q.option_2, image: q.file_2 },
                  { text: q.option_3, image: q.file_3 },
                  { text: q.option_4, image: q.file_4 },
                  { text: q.option_5, image: q.file_5 },
                ].filter((opt) => opt.text),
              }));

              setQuestions(formattedQuestions);
            }
          }
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

  const handleSubjectChange = (e) => {
    const selectedSubjectName = e.target.value;
    const subject = subjects.find(
      (sub) => sub.name === selectedSubjectName
    ) || { name: selectedSubjectName, id: "" };
    setSelectedSubject(subject);

    if (examDetails?.data && testName) {
      const examData =
        examDetails.data[testName] ||
        examDetails.data[Object.keys(examDetails.data)[1]];

      if (examData && examData[subject.name]?.questions) {
        const formattedQuestions = examData[subject.name].questions.map(
          (q) => ({
            id: q.id,
            questionText: q.question,
            questionText2: q.question2,
            options: [q.option_1, q.option_2, q.option_3, q.option_4, q.option_5].filter(
              Boolean
            ),
            correctAnswer: q.correct_ans,
            correctAnswerImage: q.correct_ans2,
            positiveMarks: q.positive_marks || editedDetails.positiveMarks,
            negativeMarks: q.negative_marks || editedDetails.negativeMarks,
            optionFiles: [
              { text: q.option_1, image: q.file_1 },
              { text: q.option_2, image: q.file_2 },
              { text: q.option_3, image: q.file_3 },
              { text: q.option_4, image: q.file_4 },
               { text: q.option_5, image: q.file_5 },
            ].filter((opt) => opt.text),
          })
        );
        setQuestions(formattedQuestions);
      } else {
        setQuestions([]);
      }
    }
  };

  const getExamData = () => {
    if (!examDetails?.data) return null;
    const examKey =
      testName ||
      Object.keys(examDetails.data).find((key) => key !== "exam_domain");
    if (!examKey) return null;
    return examDetails.data[examKey];
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

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    const questionToEdit = questions[index];
    setEditingQuestion(JSON.parse(JSON.stringify(questionToEdit))); // Deep copy
    setText(questionToEdit.questionText);
    setIsEditingDetails(true);
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
        updatedOptionFiles[optionIndex] = { text: "", image: null };
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
            updatedOptionFiles[optionIndex] = { text: "", image: null };
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

    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = {
      ...editingQuestion,
      id:
        questions[editingIndex]?.id ||
        editingQuestion?.id ||
        crypto.randomUUID(),
      positiveMarks: editedDetails.positiveMarks,
      negativeMarks: editedDetails.negativeMarks,
    };

    setQuestions(updatedQuestions);

    try {
      const S = JSON.parse(localStorage.getItem("user"));
      const token = S?.token;

      const payload = updatedQuestions.map((changedQuestion) => {
        const originalQuestion =
          questions.find((q) => q.id === changedQuestion.id) || {};

        const isNewFile = (file) => {
          return file && file.startsWith("data:image");
        };

        const imageData = {};

        if (isNewFile(changedQuestion.questionText2)) {
          imageData.question2 = changedQuestion.questionText2;
        } else if (
          changedQuestion.questionText2 !== originalQuestion.questionText2
        ) {
          imageData.question2 = changedQuestion.questionText2 || null;
        }

        if (isNewFile(changedQuestion.correctAnswerImage)) {
          imageData.correct_answer2 = changedQuestion.correctAnswerImage;
        } else if (
          changedQuestion.correctAnswerImage !==
          originalQuestion.correctAnswerImage
        ) {
          imageData.correct_answer2 =
            changedQuestion.correctAnswerImage || null;
        }

        for (let i = 0; i < 5; i++) {
          const originalOption = originalQuestion.optionFiles?.[i] || {};
          const changedOption = changedQuestion.optionFiles?.[i] || {};

          if (isNewFile(changedOption.image)) {
            imageData[`file_${i + 1}`] = changedOption.image;
          } else if (changedOption.image !== originalOption.image) {
            imageData[`file_${i + 1}`] = changedOption.image || null;
          }
        }

        return {
          id: changedQuestion.id,
          question: changedQuestion.questionText || "",
          option_1: changedQuestion.optionFiles?.[0]?.text || "",
          option_2: changedQuestion.optionFiles?.[1]?.text || "",
          option_3: changedQuestion.optionFiles?.[2]?.text || "",
          option_4: changedQuestion.optionFiles?.[3]?.text || "",
          option_5: changedQuestion.optionFiles?.[4]?.text || "",
          correct_answer: changedQuestion.correctAnswer || "",
          marks: editedDetails.positiveMarks || changedQuestion.positiveMarks,
          negative_marks:
            editedDetails.negativeMarks ||
            changedQuestion.negativeMarks ||
            "0.50",
          language: language, // Use the language from query parameter
          institutes: selectedInstitutes?.map((inst) => inst.value) || [],
          for_exam_subjects_o: [selectedSubject.id] || " ",
          for_exam_chapter_o: [],
          for_exam: examId,
          test_name: editedDetails.testName,
          ...imageData,
        };
      });

      await axios.put(`${config.apiUrl}/bulk-update-questions/`, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      setEditingIndex(null);
      setEditingQuestion(null);
      setText("");
      setIsEditingDetails(false);
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
                ? `Questions for ${testName} (${language === 'hi' ? 'Hindi' : 'English'})`
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
                        <input
                          type="text"
                          name="testName"
                          value={editedDetails.testName}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 cursor-not-allowed focus:ring-blue-500"
                          disabled
                        />
                        {!isEditingDetails && (
                          <FaEdit
                            className="ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={handleDetailsEdit}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-grow bg-white p-2 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                      Domain: {examDetails?.data?.exam_domain || "N/A"}
                    </div>
                  </div>

                  <div className="flex gap-1 md:gap-4 w-full">
                    <div className="flex-grow bg-white p-2 rounded-md border border-gray-300 shadow-sm text-blue-600 font-semibold">
                      Subject: {selectedSubject.name || "Select below"}{" "}
                    </div>
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
                        <input
                          type="number"
                          name="positiveMarks"
                          value={editedDetails.positiveMarks}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          disabled={!isEditingDetails}
                        />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="bg-white p-2 rounded-md border border-gray-300 shadow-sm">
                        <input
                          type="number"
                          name="negativeMarks"
                          value={editedDetails.negativeMarks}
                          onChange={handleDetailsChange}
                          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                          disabled={!isEditingDetails}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-xs md:text-lg font-semibold text-gray-600 tracking-wide"
                  >
                    Select Subject:
                  </label>
                  <select
                    id="subject"
                    className="mt-1 md:mt-2 block w-full p-1 md:p-3 border border-dashed rounded-lg bg-gray-50 shadow-inner border-gray-300 text-gray-700"
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

                {questions.length > 0 ? (
                  <div className="space-y-2 md:space-y-6">
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 md:p-6 rounded-lg shadow-lg w-full"
                      >
                        {editingIndex === index ? (
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
                                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full focus:outline-none text-xs sm:text-sm"
                                    >
                                      <FaTrashAlt size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1 sm:mb-2">
                              {editingQuestion.optionFiles.map(
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
                                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full focus:outline-none text-xs sm:text-sm flex items-center justify-center hover:bg-red-600"
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
                                options={editingQuestion.optionFiles.map((option, idx) => ({
                                  value: idx,
                                  label: option.text,
                                  image: option.image
                                }))}
                                value={editingQuestion.optionFiles.find((opt, idx) => 
                                  opt.text === editingQuestion.correctAnswer
                                ) ? {
                                  value: editingQuestion.optionFiles.findIndex(
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
                                          <div className="relative mt-2">
                                            <img
                                              src={getImageUrl(option.image)}
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
                            <div className="mt-1 md:mt-4 p-1 md:p-3 bg-blue-100 rounded text-blue-800">
                              <div className="flex justify-between items-center">
                                <div>
                                  <strong>Correct Answer:</strong>
                                  <span className="ml-1 md:ml-2">
                                    {question.correctAnswer}
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