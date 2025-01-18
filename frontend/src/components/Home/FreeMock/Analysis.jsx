import React, { useState, useEffect } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("testResult");
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const storedCorrectAnswers = localStorage.getItem("correctAnswers");
    const storedWrongAnswers = localStorage.getItem("wrongAnswers");

    if (storedCorrectAnswers !== null && storedWrongAnswers !== null) {
      setCorrectAnswers(Number(storedCorrectAnswers));
      setWrongAnswers(Number(storedWrongAnswers));
    }
  }, []);

  const startTime = localStorage.getItem("start_time") || "N/A";
  const endTime = localStorage.getItem("end_time") || "N/A";

  const totalScore = (correctAnswers + wrongAnswers) * 4;
  const CandidateScore = correctAnswers * 4 - wrongAnswers;
  const parseDate = (str) => {
    const formattedStr = str
      .replace("_", " ")
      .replace(
        /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
      );
    return new Date(formattedStr);
  };
  // Convert the start and end times to Date objects
  const startDate = parseDate(startTime);
  const endDate = parseDate(endTime);
  // Calculate the difference in milliseconds and convert to seconds
  const diffInSeconds = Math.floor((endDate - startDate) / 1000);
  const averageMarksData = analysisData?.average_marks_by_subject || [];

  const renderContent = () => {
    switch (activeTab) {
      case "testResult":
        return (
          <div className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-6 md:mb-8 lg:mb-10">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-800 flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                <FaUserAlt className="text-indigo-600 text-2xl md:text-3xl lg:text-4xl mr-2" />
                Candidate:{" "}
                <span className="text-indigo-600 ml-2 font-bold">
                  GUEST USER
                </span>
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Start Time:{" "}
                <span className="font-medium text-gray-700">{startTime}</span> |
                Submit Time:{" "}
                <span className="font-medium text-gray-700">{endTime}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-md transform hover:scale-105 transition-all duration-500">
                <FaTrophy className="text-indigo-600 text-3xl sm:text-4xl mb-2" />
                <p className="text-sm sm:text-lg font-medium text-gray-600 mb-2">
                  Total Score
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  {totalScore}
                </p>
              </div>
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48">
                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                <div
                  className="absolute w-full h-full rounded-full border-8 border-indigo-500 animate-pulse"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 0, 100% 50%, 0% 50%, 0 0%)",
                  }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-lg transform hover:scale-110 transition-all">
                  <FaTrophy className="text-white text-3xl sm:text-4xl mb-2" />
                  <p className="text-2xl sm:text-3xl font-extrabold">
                    {CandidateScore}
                  </p>
                  <p className="text-xs sm:text-sm mt-1 font-medium">
                    Candidate's Score
                  </p>
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-md transform hover:scale-105 transition-all duration-500">
                <MdTimer className="text-indigo-600 text-3xl sm:text-4xl mb-2" />
                <p className="text-sm sm:text-lg font-medium text-gray-600 mb-2">
                  Time Taken
                </p>
                <p className="text-lg sm:text-xl font-bold text-indigo-600">
                  {diffInSeconds} sec
                </p>
              </div>
            </div>
          </div>
        );
      case "scoreReport":
        return (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Score Report
            </h3>
            <p className="text-gray-600 mt-4">
              Detailed analysis of your performance, including subject-wise
              breakdown and comparison with peers.
            </p>
          </div>
        );
      case "leaderboard":
        return (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Leaderboard
            </h3>
            <p className="text-gray-600 mt-4">
              See how you rank among other participants. Top performers are
              highlighted.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-tl from-blue-50 to-indigo-100 p-4">
      <div className="max-w-screen-lg mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-8">
          Test Performance
        </h2>
        <div className="flex justify-center flex-wrap gap-4 mb-6">
          {["testResult", "scoreReport", "leaderboard"].map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 sm:px-6 sm:py-3 cursor-pointer text-sm sm:text-lg font-medium flex items-center transition-all duration-300 transform rounded-lg ${
                activeTab === tab
                  ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-lg"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {tab === "testResult" && (
                <AiOutlineFileDone className="mr-2 text-lg" />
              )}
              {tab === "scoreReport" && (
                <HiOutlineDocumentText className="mr-2 text-lg" />
              )}
              {tab === "leaderboard" && (
                <AiOutlineTrophy className="mr-2 text-lg" />
              )}
              {tab.replace(/([A-Z])/g, " $1")}
            </span>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Analysis;
