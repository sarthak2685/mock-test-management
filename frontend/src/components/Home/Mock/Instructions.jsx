import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Instructions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1); // Track current instruction step
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2 && isChecked) navigate("/mock-demo");
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // User data
  const user = {
    name: "John Doe",
    studentId: "12345",
    examId: "67890",
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
    { subject: "ENGLISH COMPREHENSION", questions: 25, marks: 50, time: 15 },
  ];

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
                </tbody>
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
              <li>2 marks for each correct answer.</li>
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
              className="px-2 sm:px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-md hover:bg-gray-400 transition text-xs sm:text-sm"
            >
              PREVIOUS ←
            </button>
          )}
          <button
            onClick={handleNextStep}
            disabled={step === 2 && !isChecked}
            className={`px-2 sm:px-4 py-2 font-semibold rounded-md transition text-xs sm:text-sm ${
              (step === 2 && isChecked) || step === 1
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {step === 1 ? "NEXT →" : "I AM READY TO BEGIN →"}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="w-full lg:w-1/4 mt-8 lg:mt-0 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
        <img
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 mb-4"
          src={user.profileImage || "https://via.placeholder.com/100"}
          alt="User Profile"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          {user.name}
        </h3>
        <p className="text-gray-500 text-sm">Student ID: {user.studentId}</p>
        <p className="text-gray-500 text-sm">Exam ID: {user.examId}</p>
      </div>
    </div>
  );
};

export default Instructions;
