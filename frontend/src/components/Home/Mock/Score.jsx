import React, { useState, useRef, useEffect } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";
import { jsPDF } from "jspdf";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

const Score = () => {
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
  const optional = localStorage.getItem("nonSelectedLanguage");
  const reportRef = useRef(); // Added this
  const averageMarksData = analysisData?.average_marks_by_subject || []; // Added this


  const queryParams = `student_id=${studentId}&test_name=${testName}&start_time=${startTime}&exam_id=${examId}&end_time=${endTime}&optional=${optional}`;
  const apiUrl = `${config.apiUrl}/get-analysis/?${queryParams}`;
  

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
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAnalysisData(data);
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
    localStorage.removeItem("selectedExamDuration");
    localStorage.removeItem("selectedTestDetails");
    navigate("/");
  };

  const sectionData =
  analysisData?.data_2?.subject_summary &&
  Object.keys(analysisData.data_2.subject_summary).map((subject) => {
    const summary = analysisData.data_2.subject_summary[subject];
    return {
      name: subject,
      correct: summary.correct,
      wrong: summary.incorrect,
      unattempted: analysisData.data_2.unattempted_questions_count || 0,
      marks: summary.marks,
    };
  });


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

        const sanitizeText = (text) =>
            typeof text === "string" ? text.replace(/\\/g, "") : text;

        const data = {
            examName:`${sanitizeText(apiData[0]?.exam_name)}`,
            section: `${sanitizeText(apiData[0]?.subject_name)}`,
            questions: apiData.map((q, index) => ({
              questionNumber: index + 1, // Generate question number on the frontend
                question: sanitizeText(q.question),
                questionImage: q.question_1 || null,
                options: [1, 2, 3, 4].map((idx) => ({
                    text: sanitizeText(q.options[`Option ${idx}`] || ''),
                    image: q.options[`Option_${idx}`] || null,
                })),
                correctAnswer: sanitizeText(q.correct_answer),
                markedAnswer: sanitizeText(q.selected_answer),
            })),
        };

        const doc = new jsPDF();
        const titleColor = [50, 50, 50];
        const questionColor = [0, 102, 204];
        const correctAnswerColor = [34, 139, 34];
        const markedAnswerColor = [255, 51, 51];
        const optionTextColor = [0, 0, 0];


        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...titleColor);
        doc.text("Score Report", 20, 15);

        let y = 25;
        if (data.examName) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(`Exam Name: ${data.examName}`, 20, y);
          y += 10;
      }

        if (data.section) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Section: ${data.section}`, 20, y);
            y += 10;
        }

        // Loop through questions
        for (const question of data.questions) {
            const cardMargin = 8;
            const cardWidth = 180;
            let cardHeight = 0;
            const borderRadius = 8;

            const wrappedQuestion = doc.splitTextToSize(`QUESTION ${question.questionNumber}: ${question.question}`, cardWidth - 2 * cardMargin);
            cardHeight += wrappedQuestion.length * 7 + 12;

            if (question.questionImage && question.questionImage.startsWith("/media/uploads/")) {
                cardHeight += 40; // Adjust image height
            }

            const optionHeight = 18; // Adjusted for text and image alignment
            const imageHeight = 20;

            let optionsHeight = 0;
            for (let idx = 0; idx < 4; idx++) {
                const option = question.options[idx];
                let optionCurrentHeight = optionHeight;
                if (option.image && option.image.startsWith("/media/uploads/")) {
                    optionCurrentHeight += imageHeight + 5; // Spacing between text and image
                }
                optionsHeight += optionCurrentHeight;
            }

            cardHeight += optionsHeight;

            doc.setFillColor(240, 240, 240);
            doc.setDrawColor(150, 150, 150);
            doc.setLineWidth(0.5);
            doc.roundedRect(15, y, cardWidth, cardHeight, borderRadius, borderRadius, 'FD');

            doc.setTextColor(...questionColor);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            doc.text(wrappedQuestion, 20, y + cardMargin);
            y += wrappedQuestion.length * 7 + 12;

            if (question.questionImage && question.questionImage.startsWith("/media/uploads/")) {
                const imageUrl = `${config.apiUrl}${question.questionImage}`;
                doc.addImage(imageUrl, "JPEG", 20, y, 40, 40);
                y += 40;
            }

            const optionX1 = 20;
            const optionX2 = 110; // Second column start position
            let optionY = y + 5;

            for (let idx = 0; idx < 4; idx++) {
                const option = question.options[idx];
                const columnX = idx % 2 === 0 ? optionX1 : optionX2; // Alternate columns
                const optionText = `${String.fromCharCode(65 + idx)}) ${option.text}`;
                const optionColumnY = optionY + Math.floor(idx / 2) * optionHeight * 2; // Adjust Y for rows

                // Render option text
                doc.setTextColor(...optionTextColor);
                doc.text(optionText, columnX, optionColumnY);

                // If there is an image for the option, place it below the text
                if (option.image && option.image.startsWith("/media/uploads/")) {
                    const imageUrl = `${config.apiUrl}${option.image}`;
                    doc.addImage(imageUrl, "JPEG", columnX, optionColumnY + 5, 20, 20);
                }
            }

            optionY += optionsHeight / 2; // Adjust Y for next card

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");

            const correctAnswerText = `Correct Answer: ${question.correctAnswer}`;
            const markedAnswerText = `Marked Answer: ${question.markedAnswer || "Not Answered"}`;

            doc.setTextColor(...correctAnswerColor);
            doc.text(correctAnswerText, 20, optionY + 10);
            doc.setTextColor(...markedAnswerColor);
            doc.text(markedAnswerText, 110, optionY + 10);

            optionY += 20; // Adjusted space between cards

            if (optionY + 30 > 270) {
                doc.addPage();
                optionY = 20;
            }
        }

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${totalPages}`, 180, 290);
        }

        doc.save(`${testName}-report.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error.message);
        alert("Failed to generate the PDF. Please try again.");
    }
};




  

  const parseDate = (str) => {
    const formattedStr = str
      .replace("_", " ")
      .replace(
        /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
      );
    return new Date(formattedStr);
  };

  const startDate = parseDate(startTime);
  const endDate = parseDate(endTime);
  const diffInSeconds = Math.floor((endDate - startDate) / 1000);

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
                  {user.name}
                </span>
              </h3>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                Start Time:{" "}
                <span className="font-medium text-gray-700">{startTime}</span> |
                Submit Time:{" "}
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
                  {analysisData?.total_marks_for_exam || "0"}
                </p>
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
                    {analysisData?.total_obtained_marks || "0"}
                  </p>
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
              Gain insights into your performance with a subject-wise breakdown
              and detailed analysis.
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
                      <th className="p-2 md:p-4 text-left border-b border-gray-300">
                        Section
                      </th>
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
                    {sectionData.map((section) => (
                      <tr key={section.name} className="border-b">
                        <td className="p-2 md:p-4 text-left">{section.name}</td>
                        <td className="p-2 md:p-4 text-center">
                          {section.correct}
                        </td>
                        <td className="p-2 md:p-4 text-center">
                          {section.wrong}
                        </td>
                        <td className="p-2 md:p-4 text-center">
                          {section.unattempted}
                        </td>
                      </tr>
                    ))}
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
                  {sectionData.map((section, index) => {
                    const averageMarks = averageMarksData.find(
                      (avgData) => avgData.subject_name === section.name
                    );
                    const avgScore = averageMarks
                      ? averageMarks.average_marks
                      : 0;

                    return (
                      <div
                        key={index}
                        className="w-full sm:w-1/2 lg:w-1/3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h5 className="text-sm md:text-lg font-semibold text-indigo-600 mb-2">
                          {section.name}
                        </h5>
                        <div className="text-xs md:text-sm">
                          <p className="text-gray-700 mb-1">
                            <strong>Your Score:</strong> {section.marks}
                          </p>
                          <p className="text-gray-700">
                            <strong>Avg Score:</strong> {avgScore}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
              See how you rank among other participants. Top performers are
              highlighted.
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
                    const trophyColor =
                      participant.rank === 1
                        ? "gold"
                        : participant.rank === 2
                        ? "silver"
                        : participant.rank === 3
                        ? "bronze"
                        : "gray";

                    return (
                      <tr
                        key={participant.rank}
                        className={`border-b hover:bg-indigo-50 transition-all duration-300 ${
                          participant.student_id === user.id
                            ? "bg-yellow-100 font-bold"
                            : ""
                        }`}
                      >
                        <td className="p-3 font-semibold text-indigo-600 text-left">
                          {participant.rank === 1 ? (
                            <AiOutlineTrophy className="text-red-500" />
                          ) : participant.rank === 2 ? (
                            <AiOutlineTrophy className="text-gray-300" />
                          ) : participant.rank === 3 ? (
                            <AiOutlineTrophy className="text-brown-400" />
                          ) : (
                            participant.rank
                          )}
                        </td>
                        <td className="p-3 text-left ">
                          {participant.student_name}
                        </td>
                        <td className="p-3 text-center">
                          {participant.total_marks}
                        </td>
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
        );
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

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Score;
