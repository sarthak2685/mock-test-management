import React, { useState, useEffect, useRef } from "react";
import { RiInformation2Line } from "react-icons/ri";
import Timer from "../Mock/Timer";
import config from "../../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InstructionsModal = ({ isVisible, onClose }) => {
  const [optionalSubject, setOptionalSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );
  const handleOptionalSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setOptionalSubject(selectedSubject);
    localStorage.setItem("selectedOptionalSubject", selectedSubject);
  };
  const storedTestName = localStorage.getItem("selectedTestName");
  const SubjectId = localStorage.getItem("selectedSubjectId");
  const optional = localStorage.getItem("nonSelectedLanguage");
  const storedDetails = JSON.parse(localStorage.getItem("selectedTestDetails"));
  const duration = JSON.parse(localStorage.getItem("selectedExamDuration"));

  const subjects = storedDetails?.subjects || [];
  const totalQuestions = storedDetails?.totalQuestions || 0;
  const totalMarks = storedDetails?.totalMarks || 0;
  const examDuration = duration || 0;
  const positiveMarks = storedDetails?.postiveMarks || 0;
  const negativeMarks = storedDetails?.negativeMarks || 0;

  const subjectData = subjects.map((subject) => ({
    subject,
    questions: totalQuestions / subjects.length,
    marks: totalMarks / subjects.length,
    time: examDuration / subjects.length,
  }));

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Test Instructions
        </h2>

        {/* Important Test Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Important Test Instructions:
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              This test comprises multiple-choice questions. Only one option is
              correct for each question.
            </li>
            <li>Do not close the browser window before submitting the test.</li>
            <li>If the test freezes, refresh the browser to reload.</li>
          </ul>
        </div>

        {/* Marking Scheme: */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Marking Scheme:
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>{positiveMarks} marks for each correct answer.</li>
            <li>{negativeMarks} negative marking for incorrect answers.</li>
            <li>No penalty for un-attempted questions.</li>
          </ul>
        </div>

        {/* Section Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Section Details:
          </h3>
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
              {subjectData
                .filter((subject) => subject.subject !== optional)
                .map((subject, index) => (
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

        {/* Button Functionality */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Button Functionality:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg shadow-sm">
              <span className="w-6 h-6 bg-blue-500 rounded-md"></span>
              <span className="text-sm text-gray-700 font-medium">
                Current Question
              </span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg shadow-sm">
              <span className="w-6 h-6 bg-green-500 rounded-md"></span>
              <span className="text-sm text-gray-700 font-medium">
                Answered
              </span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg shadow-sm">
              <span className="w-6 h-6 bg-red-500 rounded-md"></span>
              <span className="text-sm text-gray-700 font-medium">
                Marked for Review
              </span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg shadow-sm">
              <span className="w-6 h-6 bg-gray-400 rounded-md"></span>
              <span className="text-sm text-gray-700 font-medium">
                Not Answered
              </span>
            </div>
          </div>
        </div>

        {/* Timer Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Timer Instructions:
          </h3>
          <p className="text-gray-700 text-sm">
            - The timer is located at the top of the screen and counts down the
            total remaining time.
            <br />
            - A warning will appear when only 5 minutes are left.
            <br />- Ensure you submit before the timer runs out, as the test
            will auto-submit upon timeout.
          </p>
        </div>

        {/* Question Navigation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Question Navigation:
          </h3>
          <p className="text-gray-700 text-sm">
            - You can navigate between questions using the "Previous" and "Next"
            buttons.
            <br />- Mark questions for review if unsure, or move to the next
            question immediately.
          </p>
        </div>

        {/* General Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            General Overview:
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Read each question carefully before selecting your answer.</li>
            <li>You can change your answer before submitting the test.</li>
            <li>Make sure to complete all questions before submitting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const QuestionNavigation = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onSubmit,
  sectionName,
  answeredQuestions = [],
  markedForReview = [],
  questionTimeSpent = {}
}) => {
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const prevSectionName = useRef(sectionName);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedOptionalSubject") || ""
  );
  const language = localStorage.getItem("selectedLanguage") || "english";

  useEffect(() => {
    if (prevSectionName.current !== sectionName) {
      onSelectQuestion(0);
      prevSectionName.current = sectionName;
    }
  }, [sectionName, onSelectQuestion]);
  
  const navigate = useNavigate();

  const filteredQuestions = showMarkedOnly
    ? questions.filter((_, i) => markedForReview.includes(i))
    : questions;

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  const testId = localStorage.getItem("selectedTestId");
  const savedMinutes = localStorage.getItem("selectedExamDuration");

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // New submission function for the new API
  const handleNewSubmission = async () => {
    try {
      localStorage.setItem("submissionInProgress", "true");

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User data not found. Please log in again.");
        localStorage.setItem("submissionInProgress", "false");
        return;
      }

      const studentId = user.id;
      const instituteEmail = user.email || "sahil@mockperiod.com";

      // Calculate total time spent (in seconds)
      const testStartTime = parseInt(localStorage.getItem("testStartTime") || Date.now());
      const totalTimeSpent = Math.floor((Date.now() - testStartTime) / 1000);

      // Get stored submitted data
      const storedData = JSON.parse(localStorage.getItem("submittedData")) || {};
      
      // Prepare question attempts payload
      const questionAttempts = [];
      
      // Process each question from localStorage
      Object.values(storedData).forEach(section => {
        if (section.questions && Array.isArray(section.questions)) {
          section.questions.forEach(questionData => {
            if (questionData.selected_option_id) {
              questionAttempts.push({
                questionId: questionData.question,
                selectedOptionId: questionData.selected_option_id,
                timeSpent: questionData.time_spent || 0
              });
            }
          });
        }
      });

      // Prepare the final payload
      const payload = {
        testId: parseInt(testId),
        studentId: parseInt(studentId),
        instituteEmail: instituteEmail,
        totalTimeSpent: totalTimeSpent,
        questionAttempts: questionAttempts
      };

      console.log("Submitting to new API with payload:", payload);

      const response = await fetch(
        `${config.apiUrl}/test-results/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Submission successful:", result);
        localStorage.setItem("submissionResult", "true");
        setModalMessage("Submission successful!");

        setTimeout(() => {
          localStorage.setItem("submissionInProgress", "false");
          navigate("/score", { replace: true });
        }, 1000);
      } else {
        const errorDetails = await response.json();
        console.error("Submission failed:", errorDetails);
        setModalMessage(`Submission failed: ${response.statusText}. Please try again later.`);
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setModalMessage("An unexpected error occurred. Please try again.");
      setModalOpen(true);
    } finally {
      localStorage.setItem("submissionInProgress", "false");
    }
  };

  // Keep the old submission function as fallback
  const handleOldSubmission = async () => {
    try {
      localStorage.setItem("submissionInProgress", "true");

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User data not found. Please log in again.");
        localStorage.setItem("submissionInProgress", "false");
        return;
      }

      const test_name = localStorage.getItem("selectedTestName") || "Default Test Name";
      const exam_id = localStorage.getItem("testId") || "default_exam_id";
      const student_id = user.id;

      const start_time = localStorage.getItem("start_time") || new Date().toISOString();
      const end_time = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(new Date())
        .replace(", ", "_")
        .replace(/\//g, "-");

      localStorage.setItem("start_time", start_time);
      localStorage.setItem("end_time", end_time);

      const storedData = JSON.parse(localStorage.getItem("submittedData")) || {};
      const payload = Object.values(storedData).flat();

      const enhancedPayload = payload.map((item) => ({
        ...item,
      }));

      const queryParams = `student_id=${student_id}&test_name=${test_name}&start_time=${start_time}&exam_id=${exam_id}&end_time=${end_time}`;

      const response = await fetch(
        `${config.apiUrl}/submit-answers/?${queryParams}`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enhancedPayload),
        }
      );

      if (response.ok) {
        localStorage.setItem("submissionResult", "true");
        setModalMessage("Submission successful!");

        setTimeout(() => {
          localStorage.setItem("submissionInProgress", "false");
          navigate("/score", { replace: true });
        }, 1000);
      } else {
        const errorDetails = await response.json();
        setModalMessage(`Submission failed: ${response.statusText}. Please try again later.`);
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setModalMessage("An unexpected error occurred. Please try again.");
      setModalOpen(true);
    } finally {
      localStorage.setItem("submissionInProgress", "false");
    }
  };

  const handleSubmit = async () => {
    // Try new API first, fallback to old API if needed
    await handleNewSubmission();
  };

  const handleAutoSubmit = () => {
    if (!hasSubmitted) {
      setHasSubmitted(true);
      setModalMessage("Test is being submitted...");
      setModalOpen(true);
      handleSubmit();
    }
  };

  const handleTabSwitch = () => {
    if (document.hidden && !hasSubmitted) {
      setTabSwitchCount((prev) => {
        const newCount = prev + 1;

        if (newCount < 4) {
          toast.warn(
            `Warning ${newCount}: Tab switching is not allowed. ${
              4 - newCount
            } more and the test will auto-submit.`
          );
        } else if (newCount === 4) {
          toast.error("You switched tabs too many times. Submitting the test.");
          setHasSubmitted(true);
          handleSubmit();
        }

        return newCount;
      });
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleTabSwitch);

    return () => {
      document.removeEventListener("visibilitychange", handleTabSwitch);
    };
  }, []);

  return (
    <>
      <div className="bg-white p-7 rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => setShowInstructionsModal(true)}
            className="text-blue-500 hover:text-blue-700 text-xl flex items-center space-x-2"
          >
            <RiInformation2Line className="w-6 h-6" />
            <span>Instructions</span>
          </button>
        </div>
        
        {/* Instructions Modal */}
        <InstructionsModal
          isVisible={showInstructionsModal}
          onClose={() => setShowInstructionsModal(false)}
        />
        
        {/* Question Status Legend */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg shadow-sm">
            <span className="w-6 h-6 bg-blue-500 rounded-md"></span>
            <span className="text-md font-medium text-gray-700">
              Current Question
            </span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg shadow-sm">
            <span className="w-6 h-6 bg-green-500 rounded-md"></span>
            <span className="text-md font-medium text-gray-700">Answered</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg shadow-sm">
            <span className="w-6 h-6 bg-red-500 rounded-md"></span>
            <span className="text-md font-medium text-gray-700">
              Marked for Review
            </span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg shadow-sm">
            <span className="w-6 h-6 bg-gray-400 rounded-md"></span>
            <span className="text-md font-medium text-gray-700">
              Not Answered
            </span>
          </div>
        </div>
        
        {/* Section Title */}
        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-4 border-b pb-2">
          {sectionName}
        </h3>
        
        {/* Show Marked Only Toggle */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showMarkedOnly}
              onChange={() => setShowMarkedOnly(!showMarkedOnly)}
              className="form-checkbox text-blue-500 transition duration-200"
            />
            <span className="ml-2 text-gray-600">
              Show Marked Only ({markedForReview.length})
            </span>
          </label>
        </div>
        
        {/* Question Navigation Buttons */}
        <div className="grid grid-cols-5 gap-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, i) => {
              return (
                <button
                  key={i}
                  onClick={() => onSelectQuestion(i)}
                  title={
                    markedForReview.includes(i)
                      ? "Marked for Review"
                      : answeredQuestions[i] !== undefined
                      ? "Answered"
                      : "Not Answered"
                  }
                  className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition duration-200 focus:outline-none focus:ring ${
                    selectedQuestionIndex === i
                      ? "bg-blue-200 text-blue-700 ring-2 ring-blue-300"
                      : markedForReview.includes(i)
                      ? "bg-red-500 text-white"
                      : answeredQuestions[i] !== undefined &&
                        answeredQuestions[i] !== null
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })
          ) : (
            <p className="col-span-5 text-center text-gray-500">
              No questions available for selected subject
            </p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="hidden">
          <Timer totalMinutes={savedMinutes} onTimeUp={handleAutoSubmit} />
        </div>
        <button
          onClick={() => {
            setModalMessage("Are you sure you want to submit the test?");
            setModalOpen(true);
          }}
          className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300 shadow-sm mt-4"
        >
          Submit Test
        </button>
        
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{modalMessage}</p>
              {![
                "Test is being submitted...",
                "Submission successful!",
              ].includes(modalMessage) && (
                <div className="modal-buttons">
                  <button
                    className="modal-btn confirm"
                    onClick={() => {
                      setModalOpen(false);
                      handleSubmit();
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="modal-btn cancel"
                    onClick={() => setModalOpen(false)}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            width: 300px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          }
          .modal-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }
          .modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          .modal-btn.confirm {
            background: #28a745;
            color: white;
          }
          .modal-btn.cancel {
            background: #dc3545;
            color: white;
          }
          .modal-btn.close {
            background: #007bff;
            color: white;
            margin-top: 10px;
          }
        `}</style>
      </div>
    </>
  );
};

export default QuestionNavigation;