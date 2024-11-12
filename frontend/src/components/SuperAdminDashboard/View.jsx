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
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSampleQuestion = () => {
    setShowSampleQuestion((prev) => !prev);
    setShowSubtopicDropdown((prev) => !prev);
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value);
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
          <div className="p-4 md:p-8">
            <h1 className="text-sm md:text-3xl font-bold mb-2 md:mb-6 flex items-center">
              <span>Questions</span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="w-2 h-2 mt-1 md:w-5 md:h-5 ml-1 md:ml-4 md:mt-2 text-blue-600 cursor-pointer"
                onClick={toggleSampleQuestion}
              />
            </h1>

            {questions.length > 0 ? (
              <div className="space-y-2 md:space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 md:p-6 rounded-lg shadow-lg w-full"
                  >
                    <h3 className="text-sm md:text-xl font-semibold mb-1 md:mb-2">
                      <span className="font-bold text-blue-600">
                        Question {index + 1}:
                      </span>{" "}
                      {question.questionText}
                    </h3>
                    <div className="mt-1 md:mt-4">
                      <h4 className="text-sm md:text-xl font-bold text-blue-600 mb-1 md:mb-2">
                        Options:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4">
                        {question.options.map((option, idx) => {
                          const optionLabel = String.fromCharCode(65 + idx);
                          return (
                            <div
                              key={idx}
                              className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md"
                            >
                              <label className="block text-xs md:text-lg font-semibold text-gray-700">
                                {optionLabel}) {option}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-1 md:mt-4 p-1 md:p-3 bg-blue-100 rounded text-blue-800">
                      <strong>Correct Answer:</strong>
                      <span className="ml-1 md:ml-2">
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
                <div className="text-gray-600 text-xs md:text-lg">
                  <p>No questions available to display.</p>
                  <p className="mt-1 md:mt-4 text-blue-600 font-semibold cursor-pointer">
                    <Link to="/create-test">Add Question</Link>
                  </p>
                </div>
              )
            )}

            {showSampleQuestion && (
              <div className="text-gray-600 text-xs md:text-lg mt-2 md:mt-6">
                <p>
                  No questions available to display. Below is a sample question:
                </p>

                <div className="flex flex-wrap gap-1 md:gap-4 mb-2 md:mb-6 mt-1 md:mt-4">
                  <div className="flex gap-1 md:gap-4 w-full">
                    {institutions.map((institution, index) => (
                      <h2
                        key={index}
                        className="text-xs md:text-2xl font-bold text-blue-600 bg-white p-1 md:p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600"
                      >
                        Institution: {institution}
                      </h2>
                    ))}
                  </div>

                  {/* Row for Domain and Test Name */}
                  <div className="flex gap-1 md:gap-4 w-full">
                    <h2 className="text-xs md:text-2xl font-bold text-blue-600 bg-white p-1 md:p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 flex-grow">
                      Test Name: Sample Test
                    </h2>
                    <h2 className="text-xs md:text-2xl font-bold text-blue-600 bg-white p-1 md:p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 flex-grow">
                      Domain: History
                    </h2>
                  </div>

                  {/* Row for Subject and Chapter */}
                  <div className="flex gap-1 md:gap-4 w-full">
                    <h2 className="text-xs md:text-2xl font-bold text-blue-600 bg-white p-1 md:p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 flex-grow">
                      Subject: History
                    </h2>
                    <h2 className="text-xs md:text-2xl font-bold text-blue-600 bg-white p-1 md:p-4 rounded-lg shadow-md border-2 border-transparent transition-all hover:border-blue-600 flex-grow">
                      Chapter: French Revolution
                    </h2>
                  </div>
                </div>

                {showSubtopicDropdown && (
                  <div className="mb-2 md:mb-6">
                    <label
                      htmlFor="subtopic"
                      className="block text-xs md:text-lg font-semibold text-gray-600 tracking-wide"
                    >
                      Select Subtopic:
                    </label>
                    <select
                      id="subtopic"
                      className="mt-1 md:mt-2 block w-full p-1 md:p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed shadow-inner"
                      value={selectedSubtopic}
                      onChange={handleSubtopicChange}
                      disabled
                    >
                      <option value="">Choose a subtopic</option>
                      <option value="subtopic1">Subtopic 1</option>
                      <option value="subtopic2">Subtopic 2</option>
                      <option value="subtopic3">Subtopic 3</option>
                    </select>
                  </div>
                )}

                <div className="bg-white p-2 md:p-6 rounded-lg shadow-xl w-full mt-1 md:mt-4">
                  <h3 className="text-xs md:text-xl font-semibold mb-1 md:mb-2">
                    <span className="font-bold text-blue-600 inline">
                      Question 1:
                    </span>
                    <p className="inline ml-1 md:ml-2">
                      What is the capital of France?
                    </p>
                  </h3>

                  {selectedImage && (
                    <div className="mt-2 md:mt-4">
                      <img
                        src={selectedImage}
                        alt="Question related"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  <div className="mt-1 md:mt-4">
                    <h4 className="text-xs md:text-xl font-bold text-blue-600 mb-1 md:mb-2">
                      Options:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4">
                      <div className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md">
                        <label className="block text-xs md:text-lg font-semibold text-gray-700">
                          A) Berlin
                        </label>
                      </div>
                      <div className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md">
                        <label className="block text-xs md:text-lg font-semibold text-gray-700">
                          B) Madrid
                        </label>
                      </div>
                      <div className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md">
                        <label className="block text-xs md:text-lg font-semibold text-gray-700">
                          C) Paris
                        </label>
                      </div>
                      <div className="bg-gray-50 p-1 md:p-4 rounded-lg shadow-md">
                        <label className="block text-xs md:text-lg font-semibold text-gray-700">
                          D) Rome
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 md:mt-4 p-1 md:p-3 bg-blue-100 rounded text-blue-800">
                    <strong>Correct Answer:</strong>
                    <span className="ml-1 md:ml-2">C) Paris</span>
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
