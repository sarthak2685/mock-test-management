import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import the user icon

const GuestInstruction = () => {
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

  const handleOptionalSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setOptionalSubject(selectedSubject);
    setError2(""); // Clear error when a subject is selected
    localStorage.setItem("selectedOptionalSubject", selectedSubject);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!language) {
        setError1("Please select a language before proceeding.");
        return;
      } else if (!optionalSubject) {
        setError2("Please select an optional subject before proceeding.");
        return;
      }
      setStep(2);
    } else if (step === 2 && isChecked) {
      navigate("/examdesktop");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // User data
  const user = {
    name: "Guest User",
    profileImage: "", // Add image URL or leave as empty
  };

  // Data for subjects and marks
  const subjectData = [
    {
      subject: "GENERAL INTELLIGENCE & REASONING",
      questions: 25,
      marks: 50,
      time: 15,
    },
    { subject: "GENERAL AWARENESS", questions: 25, marks: 50, time: 15 },
    { subject: "QUANTITATIVE APTITUDE", questions: 25, marks: 50, time: 15 },
  ];

  const optionalSubjectData = {
    subject: optionalSubject || "Optional Subject",
    questions: 25,
    marks: 50,
    time: 15,
  };
  // Calculate totals
  const totalQuestions =
    subjectData.reduce((acc, subject) => acc + subject.questions, 0) +
    (optionalSubject ? optionalSubjectData.questions : 0);
  const totalMarks =
    subjectData.reduce((acc, subject) => acc + subject.marks, 0) +
    (optionalSubject ? optionalSubjectData.marks : 0);
  const totalTime =
    subjectData.reduce((acc, subject) => acc + subject.time, 0) +
    (optionalSubject ? optionalSubjectData.time : 0);

  useEffect(() => {
    // Retrieve selections from local storage on component mount
    const storedLanguage = localStorage.getItem("selectedLanguage");
    const storedOptionalSubject = localStorage.getItem(
      "selectedOptionalSubject"
    );
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    if (storedOptionalSubject) {
      setOptionalSubject(storedOptionalSubject);
    }
  }, []);

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
              <li>The total duration of the examination is 60 minutes.</li>
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
                  {subjectData.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-2 sm:px-4 py-2 border border-gray-300">
                        {subject.subject}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border border-gray-300">
                        {subject.questions}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border border-gray-300">
                        {subject.marks}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border border-gray-300">
                        {subject.time} min
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      <select
                        style={{
                          cursor: "pointer",
                          width: "200px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          padding: "4px",
                        }}
                        value={optionalSubject}
                        onChange={handleOptionalSubjectChange}
                      >
                        <option value="">Select Optional Subject</option>
                        <option value="English Comprehension">
                          English Comprehension
                        </option>
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {optionalSubjectData.questions}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {optionalSubjectData.marks}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-300">
                      {optionalSubjectData.time} min
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="px-4 py-2 border border-gray-300">Total</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {totalQuestions}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {totalMarks}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {totalTime} min
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {error2 && <p className="text-red-500 text-sm mb-4">{error2}</p>}
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
              <li>4 marks for each correct answer.</li>
              <li>1/4th negative marking for incorrect answers.</li>
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {step === 2 ? "Proceed to Test" : "Next"}
          </button>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className="w-full lg:w-1/4 mt-8 lg:mt-0 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
        {/* Profile Image or Fallback */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 mb-4 flex items-center justify-center bg-blue-500">
          {/* Fallback with the letter "G" */}
          <span className="text-white text-xl sm:text-2xl font-semibold">
            G
          </span>
        </div>

        {/* User Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          Guest User
        </h3>
      </div>
    </div>
  );
};

export default GuestInstruction;
