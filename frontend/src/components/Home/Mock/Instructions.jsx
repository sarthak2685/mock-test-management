import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

const Instructions = () => {
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
  const [serialNo, setSerialNo] = useState(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [testDetails, setTestDetails] = useState(null);

  const storedDetails = JSON.parse(localStorage.getItem("selectedTestDetails"));
  const duration = JSON.parse(localStorage.getItem("selectedExamDuration"));
  console.log("storedDetails", storedDetails, duration);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setError1(""); // Clear error when a language is selected
    localStorage.setItem("selectedLanguage", selectedLanguage);
  };

  const fetchSerial = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.apiUrl}/get_slno/}`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("serial no", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOptionalSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setOptionalSubject(selectedSubject);
    setError2(""); // Clear error when a subject is selected
    localStorage.setItem("selectedOptionalSubject", selectedSubject);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate language selection if both Hindi and English are present
      if (storedDetails?.subjects.includes("Hindi") && storedDetails?.subjects.includes("English") && !language) {
        setError1("Please select a language before proceeding.");
        return;
      }
      setStep(2); // Move to the next step
    } else if (step === 2 && isChecked) {
      // Proceed to the mock demo
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

      const startTimeFormatted = formatDateTime(new Date());
      localStorage.setItem("start_time", startTimeFormatted); // Store start time in localStorage
      navigate("/mock-demo");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const user = JSON.parse(localStorage.getItem("user")) || {
    type: "guest",
    user: "Guest",
    name: "Guest",
    studentId: "1",
    examId: "1",
  };

  const subjects = storedDetails?.subjects || [];
  const totalQuestions = storedDetails?.totalQuestions || 0;
  const totalMarks = storedDetails?.totalMarks || 0;
  const examDuration = duration || 0; 
  const positiveMarks = storedDetails?.positiveMarks || 0;
  const negativeMarks = storedDetails?.negativeMarks || 0

  const subjectData = subjects.map((subject) => ({
    subject,
    questions: totalQuestions / subjects.length,
    marks: totalMarks / subjects.length,
    time: examDuration / subjects.length, // Assuming equal time distribution
  }));

  const optionalSubjectData = {
    subject: optionalSubject || "Optional Subject",
    questions: 10,
    marks: 20,
    time: 15,
  };

  useEffect(() => {
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
      <div className="w-full lg:w-3/4 pr-0 lg:pr-8">
        {step === 1 && (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4">
              General Instructions:
            </h2>
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
                </select>
              </div>
            </div>
            {error1 && <p className="text-red-500 text-sm mb-4">{error1}</p>}

            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The total duration of the examination is {examDuration} minutes.</li>
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
      {/* Render rows for subjects */}
      {subjectData.map((subject, index) => {
        if (
          subjects.includes("Hindi") &&
          subjects.includes("English") &&
          subject.subject === "Hindi" // Render dropdown for Hindi (skip separate English row)
        ) {
          return (
            <tr key={index}>
              <td className="px-2 sm:px-4 py-2 border border-gray-300">
                <select
                  value={language}
                  onChange={(e) => {
                    const selectedLang = e.target.value;
                    setLanguage(selectedLang); // Update the language state
                    localStorage.setItem("selectedLanguage", selectedLang); // Save to localStorage
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
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
          );
        } else if (
          (subject.subject === "Hindi" || subject.subject === "English") &&
          subjects.includes("Hindi") &&
          subjects.includes("English")
        ) {
          // Skip rendering separate row for English if dropdown is shown
          return null;
        } else {
          // Render rows for other subjects
          return (
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
          );
        }
      })}
    </tbody>
              </table>
            </div>
            {error2 && <p className="text-red-500 text-sm mb-4">{error2}</p>}
          </>
        )}

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
      </div>
    </div>
  );
};

export default Instructions;
