import React, { useState, useRef, useEffect } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";
import { jsPDF } from "jspdf";
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';
import config from "../../../config";
import { useNavigate } from "react-router-dom";

const ChapterScore = () => {
  const [activeTab, setActiveTab] = useState("testResult");


  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const testName = localStorage.getItem("selectedTestName") || "N/A";
  const examId = localStorage.getItem("exam_id") || "N/A";
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.id;
  const startTime = localStorage.getItem("start_time") || "N/A";
  const endTime = localStorage.getItem("end_time") || "N/A";
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate();
  const [sectionData, setSectionsData] = useState([]);
  const [examMarks, setExamMarks] = useState([]);

  const queryParams = `student_id=${studentId}&test_name=${testName}&start_time=${startTime}&end_time=${endTime}`;
  const apiUrl = `${config.apiUrl}/get-chapter-analysis/?${queryParams}`;

  // Fetch analysis data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }); if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("hero", data.data);
        setExamMarks(data);
        setAnalysisData(data.data);
        setSectionsData(data.average_marks)
        setLeaderboardData(data.leaderboard || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);



  const handleChange = () => {
    localStorage.removeItem("submittedData");
    localStorage.removeItem("selectedExamDuration");
    localStorage.removeItem("timerDuration");
    localStorage.removeItem("start_time");
    localStorage.removeItem("submissionResult");
    localStorage.removeItem("testDuration");
    localStorage.removeItem("end_time");
    localStorage.removeItem("selectedTestName");
    localStorage.removeItem("exam_id");
    navigate('/');
  }

  const reportRef = useRef();
  const handlePDFDownload = async () => {
    const apiUrl = `${config.apiUrl}/analysis-report/?student_id=${studentId}&exam_id=${examId}&test_name=${testName}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to fetch report data");
      }

      const apiData = await response.json();

      // Utility to sanitize text
      const sanitizeText = (text) => {
        if (typeof text === "string") {
          return text.replace(/\\/g, ""); // Remove all backslashes
        }
        return text;
      };
      
      // Transform API data to fit PDF format
      const data = {
        section: `${sanitizeText(apiData[0]?.exam_name)} - ${sanitizeText(apiData[0]?.subject_name)}`,
        questions: apiData.map((q) => ({
          question: sanitizeText(q.question),
          options: Object.values(q.options).map(sanitizeText), // Sanitize options
          correctAnswer: sanitizeText(q.correct_answer),
          markedAnswer: sanitizeText(q.selected_answer),
        })),
      };
      

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
        const wrappedQuestion = doc.splitTextToSize(
          questionText,
          questionWidth
        );

        const options = question.options.map(
          (option, idx) => `${String.fromCharCode(65 + idx)}) ${option}`
        );
        const correctAnswerText = `Correct Answer: ${question.correctAnswer}`;
        const markedAnswerText = `Marked Answer: ${
          question.markedAnswer || "Not Answered"
        }`;

        // Calculate the height of the question and options dynamically
        const wrappedHeight = wrappedQuestion.length * 8;
        const optionsHeight = options.length > 2 ? 16 : 8;
        const totalHeight = wrappedHeight + optionsHeight + 20;

        // Draw the card border with rounded corners and shadow effect
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.5);
        doc.setFillColor(...cardFillColor);
        doc.roundedRect(15, y, cardWidth, totalHeight, 5, 5, "FD");

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
        const answerYOffset =
          optionYOffset + Math.ceil(options.length / 2) * 8 + 3;

        // Correct Answer
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...correctAnswerColor);
        doc.text(correctAnswerText, 25, answerYOffset);

        // Marked Answer (Green if correct, red if incorrect)
        const markedAnswerColor =
          question.markedAnswer === question.correctAnswer
            ? markedAnswerCorrectColor
            : markedAnswerIncorrectColor;
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
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${totalPages}`,
        180,
        290
      );

      // Save the PDF
      doc.save("score-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      alert("Failed to generate the PDF. Please try again.");
    }
  };
  const parseDate = (str) => {
    const formattedStr = str.replace("_", " ").replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6");
    return new Date(formattedStr);
  };

  // Convert the start and end times to Date objects
  const startDate = parseDate(startTime);
  const endDate = parseDate(endTime);

  // Calculate the difference in milliseconds and convert to seconds
  const diffInSeconds = Math.floor((endDate - startDate) / 1000);
  const averageMarksData = analysisData?.average_marks_by_subject || [];

  //   section: "General Intelligence and Reasoning",
  //   questions: [
  //     {
  //       question:
  //         "What is the next number in the series: 1, 4, 9, 16, 25, ...?",
  //       options: ["36", "49", "34", "40"],
  //       correctAnswer: "36",
  //       markedAnswer: "36",
  //     },
  //     {
  //       question: "Which of the following is different from the rest?",
  //       options: ["Dog", "Cat", "Bird", "Fish"],
  //       correctAnswer: "Fish",
  //       markedAnswer: "Cat",
  //     },
  //     {
  //       question:
  //         "A person is facing west and turns 45° clockwise. What is the new direction?",
  //       options: ["North-West", "South-West", "North-East", "South-East"],
  //       correctAnswer: "North-West",
  //       markedAnswer: "",
  //     },
  //     {
  //       question:
  //         "Pointing to a man, Sita said, 'His mother is the only daughter of my mother.' How is Sita related to the man?",
  //       options: ["Mother", "Sister", "Daughter", "Aunt"],
  //       correctAnswer: "Mother",
  //       markedAnswer: "",
  //     },
  //   ]
  // };



  const renderContent = () => {
    switch (activeTab) {
      case "testResult":
        return (
          <div className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-6 md:mb-8 lg:mb-10">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-800 flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                <FaUserAlt className="text-indigo-600 text-2xl md:text-3xl lg:text-4xl mr-2" />
                Candidate:{" "}
                <span className="text-indigo-600 ml-2 font-bold">{user.name}</span>
              </h3>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                Start Time:{" "}
                <span className="font-medium text-gray-700">{startTime}</span> | Submit
                Time:{" "}
                <span className="font-medium text-gray-700">{endTime}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-4 sm:space-x-8 lg:space-x-12">
              <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <FaTrophy className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                  Total Score
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                  {(() => {
                    const subject = Object.keys(analysisData || {})[0];
                    const chapter = Object.keys(analysisData?.[subject] || {}).find(
                      (key) => key.startsWith("Chapter")
                    );
                    return (
                      examMarks.marks || "N/A"
                    );
                  })()}                </p>
              </div>
              <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64">
                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                <div
                  className="absolute w-full h-full rounded-full border-8 border-indigo-500 animate-pulse"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 0, 100% 50%, 0% 50%, 0 0%)",
                  }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all">
                  <FaTrophy className="text-white text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3" />
                  <p className="text-3xl md:text-4xl lg:text-6xl font-extrabold">
                    {(() => {
                      const subject = Object.keys(analysisData || {})[0];
                      const chapter = Object.keys(analysisData?.[subject] || {}).find(
                        (key) => key.startsWith("Chapter")
                      );
                      return (
                        analysisData?.[subject]?.[chapter]?.obtained_marks || "0"
                      );
                    })()}                  </p>
                  <p className="text-xs md:text-sm lg:text-lg mt-1 md:mt-2 font-medium">
                    Candidate's Score
                  </p>
                </div>
              </div>
              <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <MdTimer className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                  Time Taken
                </p>
                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-indigo-600">
                  {diffInSeconds} sec
                </p>
              </div>
            </div>
          </div>
        );

      case "scoreReport":

        return (
          <div
            ref={reportRef}
            className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                Score Report
              </h3>
              <div className="relative group flex items-center">
                <button
                  onClick={handlePDFDownload}
                  className="text-indigo-600 hover:text-indigo-400 text-4xl transition duration-300"
                >
                  <FaCloudDownloadAlt /> {/* Cloud Download Icon */}
                </button>

                {/* Tooltip Popup */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <span>Click to download your result!</span>
                  </div>
                </div>
              </div>


            </div>
            <p className="text-gray-600 mb-4 md:mb-8 text-sm md:text-base">
              Gain insights into your performance with a subject-wise breakdown and
              detailed analysis.
            </p>

            {/* Performance Table */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg">
              <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-indigo-600 mb-4">
                Performance Table
              </h4>
              {/* Responsive Table Wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-gray-700 text-xs sm:text-sm md:text-base border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-indigo-200 text-indigo-700">
                      <th className="p-2 md:p-4 text-left border-b border-gray-300">Section</th>
                      <th className="p-2 md:p-4 text-center border-b border-gray-300">
                        Correct
                      </th>
                      <th className="p-2 md:p-4 text-center border-b border-gray-300">
                        Wrong
                      </th>
                      <th className="p-2 md:p-4 text-center border-b border-gray-300">
                        Unattempted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const subject = Object.keys(analysisData || {})[0];
                      const chapter = Object.keys(analysisData?.[subject] || {}).find((key) => key.startsWith("Chapter"))


                      // Retrieve chapter data and question statistics
                      const chapterData = analysisData?.[subject]?.[chapter] || {};
                      const questionStats = chapterData?.question_stats || {};
                      const { correct_answers, wrong_answers, unattempted } = questionStats;

                      // Render the table row if data is available
                      return (
                        <tr className="border-b">
                          <td className="p-2 md:p-4 text-left">
                            {chapter || 'Unknown Chapter'}
                          </td>
                          <td className="p-2 md:p-4 text-center">{correct_answers}</td>
                          <td className="p-2 md:p-4 text-center">{wrong_answers}</td>
                          <td className="p-2 md:p-4 text-center">{unattempted}</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Peer Comparison */}
            <div className="mt-8 md:mt-10">
              <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-indigo-600 mb-4 md:mb-6">
                Peer Comparison
              </h4>
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg">
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Compare your performance with peers across sections.
                </p>
                <div className="flex flex-wrap justify-between gap-4">
                {(() => {
                  const subject = Object.keys(sectionData || {})[0];
                    const chapter = Object.keys(sectionData?.[subject] || {}).find(
                      (key) => key.startsWith("Chapter")
                    );
                    const subj = Object.keys(analysisData || {})[0];
                      const chap = Object.keys(analysisData?.[subject] || {}).find(
                        (key) => key.startsWith("Chapter")
                      );
                    return (
                      <div
                        className="w-full sm:w-1/2 lg:w-1/3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h5 className="text-sm md:text-lg font-semibold text-indigo-600 mb-2">
                          {chapter}
                        </h5>
                        <div className="text-xs md:text-sm">
                          <p className="text-gray-700 mb-1">
                            <strong>Your Score:</strong> {analysisData?.[subj]?.[chap]?.obtained_marks || "0"}
                          </p>
                          <p className="text-gray-700">
                            <strong>Avg Score:</strong> { sectionData?.[subject]?.[chapter]?.average_marks}
                          </p>
                        </div>
                      </div>
                    );
                  })()} 
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
                  {leaderboardData.map((participant) => {
                    const trophyColor = participant.rank === 1 ? 'gold' :
                      participant.rank === 2 ? 'silver' :
                        participant.rank === 3 ? 'bronze' : 'gray';

                    return (
                      <tr
                        key={participant.rank}
                        className={`border-b hover:bg-indigo-50 transition-all duration-300 ${participant.student_id === user.id ? "bg-yellow-100 font-bold" : ""}`}
                      >
                        <td className="p-3 font-semibold text-indigo-600 text-left">
                          {participant.rank === 1 ? <AiOutlineTrophy className="text-red-500" /> :
                            participant.rank === 2 ? <AiOutlineTrophy className="text-gray-300" /> :
                              participant.rank === 3 ? <AiOutlineTrophy className="text-brown-400" /> :
                                participant.rank}
                        </td>
                        <td className="p-3 text-left ">{participant.student_name}</td>
                        <td className="p-3 text-center">{participant.total_obtained}</td>
                      </tr>
                    );
                  })}
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
        )
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-tl from-blue-50 to-indigo-100 p-4 relative">
      {/* Cross symbol in the top-right corner */}
      <RiCloseLine
        className="absolute top-4 right-4 text-2xl sm:text-3xl text-gray-600 cursor-pointer hover:text-indigo-600 transition-all duration-300"
        onClick={handleChange} // Redirects to the homepage
      />

      <div className="w-full max-w-7xl mx-auto text-center font-sans text-gray-800 p-8 sm:p-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-8 sm:mb-12 -mt-12 tracking-wider">
          Test Performance
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-6 sm:space-x-12 mb-8 flex-wrap">
          <span
            onClick={() => setActiveTab("testResult")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "testResult"
              ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
              : "text-gray-600 hover:text-indigo-600"
              }`}
          >
            <AiOutlineFileDone className="mr-2 text-xl sm:text-2xl" /> Test Result
          </span>

          <span
            onClick={() => setActiveTab("scoreReport")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "scoreReport"
              ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
              : "text-gray-600 hover:text-indigo-600"
              }`}
          >
            <HiOutlineDocumentText className="mr-2 text-xl sm:text-2xl" /> Score Report
          </span>

          <span
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "leaderboard"
              ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
              : "text-gray-600 hover:text-indigo-600"
              }`}
          >
            <AiOutlineTrophy className="mr-2 text-xl sm:text-2xl" /> Leaderboard
          </span>
        </div>

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </div>
    </div>
  );

};

export default ChapterScore;
