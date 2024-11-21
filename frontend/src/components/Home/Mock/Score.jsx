import React, { useState,useRef } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";
import { jsPDF } from "jspdf";


const Score = () => {
  const [activeTab, setActiveTab] = useState("testResult");
  const sections = [
    {
      name: 'Math',
      correct: 30,
      wrong: 10,
      unattempted: 5,
    },
    {
      name: 'Science',
      correct: 25,
      wrong: 8,
      unattempted: 7,
    },
    {
      name: 'English',
      correct: 20,
      wrong: 15,
      unattempted: 5,
    },
  ];
  const leaderboardData = [
    { rank: 1, name: 'John Doe', score: 95 },
    { rank: 2, name: 'Jane Smith', score: 92 },
    { rank: 3, name: 'Alice Johnson', score: 89 },
    { rank: 4, name: 'Bob Brown', score: 87 },
    { rank: 5, name: 'Charlie Davis', score: 85 },
  ];

  const reportRef = useRef();
  const handlePDFDownload = () => {
    const doc = new jsPDF();
  
    // Define reusable colors
    const titleColor = [50, 50, 50];
    const sectionColor = [80, 80, 80];
    const questionColor = [0, 102, 204];
    const correctAnswerColor = [34, 139, 34]; // Green
    const markedAnswerCorrectColor = [34, 139, 34];
    const markedAnswerIncorrectColor = [255, 51, 51]; // Bright red for incorrect answers
    const borderColor = [200, 200, 200]; // Light grey for borders
    const cardFillColor = [248, 249, 250]; // Light background color for the card
  
    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...titleColor);
    doc.text("Score Report", 20, 15);
  
    let y = 30; // Starting position for content
  
    // Section Title
    if (data.section) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(`Section: ${data.section}`, 20, y);
      y += 12; // Space after section title
    }
  
    // Loop through questions
    data.questions.forEach((question, index) => {
      const questionId = index + 1; // Numbering for questions
  
      // Card border around question content (rounded corners, shadow effect)
      const cardWidth = 180;
      const questionWidth = 140;
      const questionText = `Question ${questionId}: ${question.question}`;
      const wrappedQuestion = doc.splitTextToSize(questionText, questionWidth);
  
      const options = question.options.map(
        (option, idx) => `${String.fromCharCode(65 + idx)}) ${option}`
      );
      const correctAnswerText = `Correct Answer: ${question.correctAnswer}`;
      const markedAnswerText = `Marked Answer: ${question.markedAnswer || "Not Answered"}`;
  
      // Calculate the height of the question and options dynamically
      const wrappedHeight = wrappedQuestion.length * 8;
      const optionsHeight = options.length > 2 ? 16 : 8;
      const totalHeight = wrappedHeight + optionsHeight + 20;
  
      // Draw the card border with rounded corners and shadow effect
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.setFillColor(...cardFillColor);
      doc.roundedRect(15, y, cardWidth, totalHeight, 5, 5, 'FD');
  
      // Question Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...questionColor);
      doc.text(wrappedQuestion, 25, y + 10); 
  
      // Space before options
      let optionYOffset = y + 10 + wrappedHeight;
  
      // Options (wrap the options text for better fitting)
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      const columnSpacing = 80;
      options.forEach((opt, idx) => {
        const wrappedOption = doc.splitTextToSize(opt, questionWidth);
        const xOffset = idx % 2 === 0 ? 25 : 25 + columnSpacing;
        const yOffset = optionYOffset + Math.floor(idx / 2) * 8;
        doc.text(wrappedOption, xOffset, yOffset);
      });
  
      // Correct and Marked Answers side by side
      const answerYOffset = optionYOffset + Math.ceil(options.length / 2) * 8 + 3;
  
      // Correct Answer
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...correctAnswerColor);
      doc.text(correctAnswerText, 25, answerYOffset);
  
      // Marked Answer (Green if correct, red if incorrect)
      const markedAnswerColor = question.markedAnswer === question.correctAnswer ? markedAnswerCorrectColor : markedAnswerIncorrectColor;
      doc.setTextColor(...markedAnswerColor);
      doc.text(markedAnswerText, 105, answerYOffset);
  
      y += totalHeight + 8;
  
     
  
      // Page break if necessary (check remaining space on page)
      if (y + totalHeight > 270) {
        doc.addPage();
        y = 20; // Reset y for the new page
      }
    });
  
    // Add Footer with page number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150); // Light grey for page numbers
    const totalPages = doc.internal.getNumberOfPages();
    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${totalPages}`, 180, 290);
  
    // Save the PDF
    doc.save("score-report.pdf");
  };
  











  const data = {
    section: "General Intelligence and Reasoning",
    questions: [
      {
        question:
          "What is the next number in the series: 1, 4, 9, 16, 25, ...?",
        options: ["36", "49", "34", "40"],
        correctAnswer: "36",
        markedAnswer: "36",
      },
      {
        question: "Which of the following is different from the rest?",
        options: ["Dog", "Cat", "Bird", "Fish"],
        correctAnswer: "Fish",
        markedAnswer: "Cat",
      },
      {
        question:
          "A person is facing west and turns 45° clockwise. What is the new direction?",
        options: ["North-West", "South-West", "North-East", "South-East"],
        correctAnswer: "North-West",
        markedAnswer: "",
      },
      {
        question:
          "Pointing to a man, Sita said, 'His mother is the only daughter of my mother.' How is Sita related to the man?",
        options: ["Mother", "Sister", "Daughter", "Aunt"],
        correctAnswer: "Mother",
        markedAnswer: "",
      },
    ]
  };



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
            <div
              ref={reportRef}
              className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800">Score Report</h3>
                <button
                  onClick={handlePDFDownload}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  Download PDF
                </button>
               
              </div>
              <p className="text-gray-600 mb-8">
                Gain insights into your performance with a subject-wise breakdown and
                detailed analysis.
              </p>
        
              {/* Performance Table */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 sm:p-8 rounded-xl shadow-lg">
                <h4 className="text-2xl font-semibold text-indigo-600 mb-4">
                  Performance Table
                </h4>
                <table className="w-full text-gray-700 text-sm sm:text-base border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-indigo-200 text-indigo-700">
                      <th className="p-4 text-left border-b border-gray-300">Section</th>
                      <th className="p-4 text-center border-b border-gray-300">
                        Correct
                      </th>
                      <th className="p-4 text-center border-b border-gray-300">Wrong</th>
                      <th className="p-4 text-center border-b border-gray-300">
                        Unattempted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section) => (
                      <tr key={section.name} className="border-b">
                        <td className="p-4 text-left">{section.name}</td>
                        <td className="p-4 text-center">{section.correct}</td>
                        <td className="p-4 text-center">{section.wrong}</td>
                        <td className="p-4 text-center">{section.unattempted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        
              {/* Peer Comparison */}
              <div className="mt-10">
                <h4 className="text-2xl font-semibold text-indigo-600 mb-6">
                  Peer Comparison
                </h4>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 sm:p-8 rounded-xl shadow-lg">
                  <p className="text-gray-600 mb-4">
                    Compare your performance with peers across sections.
                  </p>
                  <div className="flex justify-between space-x-4">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className="w-1/3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h5 className="text-lg font-semibold text-indigo-600 mb-2">
                          {section.name}
                        </h5>
                        <div className="text-sm">
                          <p className="text-gray-700 mb-1">
                            <strong>Your Score:</strong> {80 + index * 5}%
                          </p>
                          <p className="text-gray-700">
                            <strong>Avg Score:</strong> {75 + index * 5}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        

        
      case "leaderboard":
        
          return (
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Leaderboard
              </h3>
              <p className="text-gray-600 mt-4">
                See how you rank among other participants. Top performers are highlighted.
              </p>
        
              {/* Leaderboard Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full table-auto text-sm sm:text-base text-gray-700">
                  <thead>
                    <tr className="bg-indigo-100 text-indigo-700">
                      <th className="p-3 text-left">Rank</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((participant) => (
                      <tr
                        key={participant.rank}
                        className="border-b hover:bg-indigo-50 transition-all duration-300"
                      >
                        <td className="p-3 font-semibold text-indigo-600">{participant.rank}</td>
                        <td className="p-3">{participant.name}</td>
                        <td className="p-3 text-center">{participant.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        
              {/* Visual Enhancement */}
              <div className="mt-8 flex justify-center items-center">
                <AiOutlineTrophy className="text-6xl text-indigo-600" />
                <p className="text-xl sm:text-2xl ml-4 text-indigo-600 font-semibold">
                  Congratulations to the top performers!
                </p>
              </div>
            </div>
          );
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
