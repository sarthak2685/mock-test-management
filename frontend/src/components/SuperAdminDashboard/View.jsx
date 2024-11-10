import React, { useState, useEffect } from "react";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import DashboardHeader from "../SuperAdminDashboard/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const View = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showSampleQuestion, setShowSampleQuestion] = useState(false);
  const [showSubtopicDropdown, setShowSubtopicDropdown] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(""); // State for selected subtopic
  const institutions = ["XYZ University", "ABC Institute", "LMN College"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const savedQuestions = JSON.parse(
      localStorage.getItem("questions") || "[]"
    );
    setQuestions(savedQuestions.length ? savedQuestions : []);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleSampleQuestion = () => {
    setShowSampleQuestion((prev) => !prev);
    setShowSubtopicDropdown((prev) => !prev); // Toggle subtopic dropdown visibility
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value); // Update the selected subtopic
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="hidden md:block"
        />
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <DashboardHeader user={user} toggleSidebar={toggleSidebar} />
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <span>Questions</span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="w-5 h-5 ml-4 mt-2 text-blue-600 cursor-pointer"
                onClick={toggleSampleQuestion} // Toggle sample question visibility
              />
            </h1>

            {questions.length > 0 ? (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-xl w-full"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      <span className="font-bold text-blue-600">
                        Question {index + 1}:
                      </span>{" "}
                      {question.questionText}
                    </h3>
                    <div className="mt-4">
                      <h4 className="text-xl font-bold text-blue-600 mb-2">
                        Options:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option, idx) => {
                          const optionLabel = String.fromCharCode(65 + idx);
                          return (
                            <div
                              key={idx}
                              className="bg-gray-50 p-4 rounded-lg shadow-md"
                            >
                              <label className="block text-lg font-semibold text-gray-700">
                                {optionLabel}) {option}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded text-blue-800">
                      <strong>Correct Answer:</strong>
                      <span className="ml-2">
                        {question.options.map((option, idx) => {
                          const optionLabel = String.fromCharCode(65 + idx);
                          return option === question.correctAnswer ? (
                            <span key={idx} className="font-semibold">
                              {optionLabel}) {option}
                            </span>
                          ) : null;
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showSampleQuestion && (
                <div className="text-gray-600 text-lg">
                  <p>No questions available to display.</p>
                  <p className="mt-4 text-blue-600 font-semibold cursor-pointer">
                    <Link to="/create-test">Add Question</Link>
                  </p>
                </div>
              )
            )}

            {showSampleQuestion && (
              <div className="text-gray-600 text-lg mt-6">
                <p>
                  No questions available to display. Below is a sample question:
                </p>

                {/* Institution, Domain, and Subject Section */}
                <div className="flex flex-wrap gap-4 mb-6 mt-4">
                  {/* Loop through multiple institutions */}
                  <div className="flex gap-4">
                    {institutions.map((institution, index) => (
                      <h2
                        key={index}
                        className="text-2xl font-bold text-blue-600 bg-white p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 hover:text-blue-600"
                      >
                        Institution: {institution}
                      </h2>
                    ))}
                  </div>

                  {/* Domain Section */}
                  <h2 className="text-2xl font-bold text-blue-600 bg-white p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 hover:text-blue-600 flex-grow">
                    Domain: History
                  </h2>

                  {/* Subject Section */}
                  <h2 className="text-2xl font-bold text-blue-600 bg-white p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 hover:text-blue-600 flex-grow">
                    Subject: History
                  </h2>
                </div>

                {/* Subtopic Dropdown */}
                {showSubtopicDropdown && (
                  <div className="mb-6">
                    <label
                      htmlFor="subtopic"
                      className="block text-lg font-semibold text-gray-600 tracking-wide"
                    >
                      Select Subtopic:
                    </label>
                    <select
                      id="subtopic"
                      className="mt-2 block w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed shadow-inner focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:shadow-none transform hover:shadow-md hover:border-gray-400"
                      value={selectedSubtopic} // Bind to selected subtopic state
                      onChange={handleSubtopicChange} // Add change handler
                      disabled
                    >
                      <option value="">Choose a subtopic</option>
                      <option value="subtopic1">Subtopic 1</option>
                      <option value="subtopic2">Subtopic 2</option>
                      <option value="subtopic3">Subtopic 3</option>
                    </select>
                  </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-4">
                  <h3 className="text-xl font-semibold mb-2">
                    <span className="font-bold text-blue-600 inline">
                      Question 1:
                    </span>
                    <p className="inline ml-2">
                      What is the capital of France?
                    </p>
                  </h3>
                  <div className="mt-4">
                    <h4 className="text-xl font-bold text-blue-600 mb-2">
                      Options:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <label className="block text-lg font-semibold text-gray-700">
                          A) Berlin
                        </label>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <label className="block text-lg font-semibold text-gray-700">
                          B) Madrid
                        </label>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <label className="block text-lg font-semibold text-gray-700">
                          C) Paris
                        </label>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <label className="block text-lg font-semibold text-gray-700">
                          D) Rome
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-100 rounded text-blue-800">
                    <strong>Correct Answer:</strong>
                    <span className="ml-2">C) Paris</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
