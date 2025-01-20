import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

const ChapterTestInstructions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState(
    localStorage.getItem("selectedLanguage") || ""
  );
  const [optionalSubject, setOptionalSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setError1(""); // Clear error when a language is selected
    localStorage.setItem("selectedLanguage", selectedLanguage);
  };
  const [selectedChapter, setSelectedChapter] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [positiveMarks, setPositiveMarks] = useState("");
  const [negativeMarks, setNegativeMarks] = useState("")

  useEffect(() => {
    // Get items from localStorage
    const chapter = localStorage.getItem("selectedChapter");
    const duration = localStorage.getItem("testDuration");
    const questions = localStorage.getItem("noOfQuestions");
    const positiveMarks = localStorage.getItem("positiveMarks");
    const negativeMarks = localStorage.getItem("negativeMarks");

    // Set them in state
    setSelectedChapter(chapter || "");
    setTestDuration(duration || "");
    setNoOfQuestions(questions || "");
    setPositiveMarks(positiveMarks || 0);
    setNegativeMarks(negativeMarks || 0);
  }, []);


  // const handleOptionalSubjectChange = (e) => {
  //   const selectedSubject = e.target.value;
  //   setOptionalSubject(selectedSubject);
  //   setError2(""); // Clear error when a subject is selected
  //   localStorage.setItem("selectedOptionalSubject", selectedSubject);
  // };

  const handleNextStep = () => {
    if (step === 1) {
      if (!language) {
        setError1("Please select a language before proceeding.");
        return;
      }
      setStep(2);
    } else if (step === 2 && isChecked) {
      // Format function for date-time (same as in handleSubmit)
      const formatDateTime = (date) => {
        return new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
          .format(date)
          .replace(", ", "_")
          .replace(/\//g, "-");
      };

      // Store formatted start time when transitioning to step 2
      const startTimeFormatted = formatDateTime(new Date());
      localStorage.setItem("start_time", startTimeFormatted);
      navigate("/chapter-exam");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // User data
  const user = JSON.parse(localStorage.getItem("user")) || {
    type: "guest",
    user: "Guest",
    name: "Guest",
    studentId: "1",
    examId: "1",
  };

 

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-3xl mx-auto bg-white shadow-md rounded-lg flex flex-col lg:flex-row">
      {/* Instructions Section */}
      <div className="w-full lg:w-3/4 pr-0 lg:pr-8">
        {/* Page 1: General Instructions */}
        {step === 1 && (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4">
              General Instructions:
            </h2>
            {/* Language Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <div className="space-x-2 flex flex-row items-center">
                <span className="text-[#007bff]">View in: </span>
                <select
                  style={{
                    cursor: "pointer",
                    width: "150px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "4px",
                  }}
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="">Select Language</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  {/* Add more languages as needed */}
                </select>
              </div>
            </div>
            {error1 && <p className="text-red-500 text-sm mb-4">{error1}</p>}

            {/* General Instructions */}
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The total duration of the examination is {testDuration} minutes.</li>
              <li>
                The clock will be set at the server. The countdown timer in the
                top right corner will display the remaining time. When the timer
                reaches zero, the exam will end automatically.
              </li>
              <li>
                The Question Palette on the right shows the question status:
                <ul className="list-decimal list-inside ml-5 space-y-1">
                  <li>
                    Current Question in{" "}
                    <span
                      className="inline-block bg-blue-500 rounded-md"
                      style={{ width: "16px", height: "16px" }}
                    ></span>{" "}
                    blue color.
                  </li>
                  <li>
                    Answered questions in{" "}
                    <span
                      className="inline-block bg-green-500 rounded-md"
                      style={{ width: "16px", height: "16px" }}
                    ></span>{" "}
                    green color.
                  </li>
                  <li>
                    Not Answered questions in{" "}
                    <span
                      className="inline-block bg-gray-400 rounded-md"
                      style={{ width: "16px", height: "16px" }}
                    ></span>{" "}
                    gray color.
                  </li>
                  <li>
                    Marked for review questions in{" "}
                    <span
                      className="inline-block bg-red-500 rounded-md"
                      style={{ width: "16px", height: "16px" }}
                    ></span>{" "}
                    red color.
                  </li>
                </ul>
              </li>
              <li>
                Marked for review means you want to review the question again.
              </li>
              <li>
                Only answered or marked-for-review questions will be considered
                for evaluation.
              </li>
            </ul>
            {/* Subjects Table */}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-gray-300 text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="px-2 sm:px-4 py-2 border border-gray-300 text-left">
                      Subject
                    </th>
                    <th className="px-2 sm:px-4 py-2 border border-gray-300 text-left">
                      No of Questions
                    </th>
                    <th className="px-2 sm:px-4 py-2 border border-gray-300 text-left">
                      Maximum Marks
                    </th>
                    <th className="px-2 sm:px-4 py-2 border border-gray-300 text-left">
                      Total Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {selectedChapter}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {noOfQuestions}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {testDuration}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                    {testDuration} min
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  {/* <tr className="font-semibold ">
                    <td className="px-4 py-2 border border-gray-300">Total</td>
                    <td className="px-4 py-2 border border-gray-300">25</td>
                    <td className="px-4 py-2 border border-gray-300">100</td>
                    <td className="px-4 py-2 border border-gray-300">60 min</td>
                  </tr> */}
                </tfoot>
              </table>
            </div>
          </>
        )}

        {/* Page 2: Additional Instructions */}
        {step === 2 && (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4">
              Read the following Instruction carefully:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>This test comprises multiple-choice questions.</li>
              <li>Only one option is correct for each question.</li>
              <li>
                Do not close the browser window before submitting the test.
              </li>
              <li>If the test freezes, refresh the browser to reload.</li>
            </ul>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mt-6 mb-4">
              Marking Scheme:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{positiveMarks} marks for each correct answer.</li>
              <li>{negativeMarks} negative marking for incorrect answers.</li>
              <li>No penalty for un-attempted questions.</li>
            </ul>
            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                  aria-label="I agree to proceed with the examination"
                />
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">
                  I have read and understood all instructions and agree to
                  proceed with the exam.
                </span>
              </label>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={step === 2 && !isChecked}
          >
            {step === 2 ? "Proceed" : "Next"}
          </button>
        </div>
      </div>
      {/* Profile Sidebar */}
      <div className="w-full lg:w-1/4 mt-8 lg:mt-0 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
      {user.pic ? (
          <img
            src={`${config.apiUrl}${user.pic}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          user.name ? user.name.charAt(0).toUpperCase() : "G"
        )}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          {user.name}
        </h3>
        {/* <p className="text-gray-500 text-sm">Student ID: {user.studentId}</p>
        <p className="text-gray-500 text-sm">Exam ID: {user.examId}</p> */}
      </div>
    </div>
  );
};

export default ChapterTestInstructions;
