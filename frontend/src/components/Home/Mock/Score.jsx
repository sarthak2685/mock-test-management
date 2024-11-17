import React, { useState } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";

const Score = () => {
  const [activeTab, setActiveTab] = useState("testResult");

  const renderContent = () => {
    switch (activeTab) {
      case "testResult":
        return (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center justify-center mb-4">
                <FaUserAlt className="text-indigo-600 text-3xl sm:text-4xl mr-2" />
                Candidate:{" "}
                <span className="text-indigo-600 ml-2 font-bold">Lucy</span>
              </h3>
              <p className="text-gray-600 text-base sm:text-lg">
                Start Time:{" "}
                <span className="font-medium text-gray-700">
                  2021-03-23 11:53:46
                </span>{" "}
                | Submit Time:{" "}
                <span className="font-medium text-gray-700">
                  2021-03-23 11:54:06
                </span>
              </p>
            </div>
            <div className="flex justify-evenly items-center space-x-8 sm:space-x-12">
              <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <FaTrophy className="text-indigo-600 text-4xl sm:text-5xl mx-auto mb-4" />
                <p className="text-lg sm:text-xl text-gray-600 mb-3 font-medium">
                  Total Score
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-indigo-600">
                  100
                </p>
              </div>
              <div className="relative w-48 sm:w-64 h-48 sm:h-64">
                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                <div
                  className="absolute w-full h-full rounded-full border-8 border-indigo-500 animate-pulse"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 0, 100% 50%, 0% 50%, 0 0%)",
                  }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all">
                  <FaTrophy className="text-white text-5xl sm:text-6xl mb-3" />
                  <p className="text-4xl sm:text-6xl font-extrabold">100</p>
                  <p className="text-sm sm:text-lg mt-2 font-medium">
                    Candidate's Score
                  </p>
                </div>
              </div>
              <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <MdTimer className="text-indigo-600 text-4xl sm:text-5xl mx-auto mb-4" />
                <p className="text-lg sm:text-xl text-gray-600 mb-3 font-medium">
                  Time Taken
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  20 sec
                </p>
              </div>
            </div>
          </div>
        );
      case "scoreReport":
        return (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
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
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
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
      <div className="w-full max-w-7xl mx-auto text-center font-sans text-gray-800 p-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-12 -mt-12 tracking-wider">
          Test Performance
        </h2>
        <div className="flex justify-center space-x-6 sm:space-x-12 mb-8">
          <span
            onClick={() => setActiveTab("testResult")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${
              activeTab === "testResult"
                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <AiOutlineFileDone className="mr-2 text-xl sm:text-2xl" /> Test
            Result
          </span>
          <span
            onClick={() => setActiveTab("scoreReport")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${
              activeTab === "scoreReport"
                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <HiOutlineDocumentText className="mr-2 text-xl sm:text-2xl" /> Score
            Report
          </span>
          <span
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${
              activeTab === "leaderboard"
                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <AiOutlineTrophy className="mr-2 text-xl sm:text-2xl" /> Leaderboard
          </span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Score;
