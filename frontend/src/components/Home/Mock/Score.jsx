import React, { useState, useRef, useEffect } from "react";
import { FaTrophy, FaUserAlt, FaCloudDownloadAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";
import { RiCloseLine } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import { TbFileDownload } from "react-icons/tb";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Score = () => {
    const [activeTab, setActiveTab] = useState("testResult");
    const S = JSON.parse(localStorage.getItem("user"));
    const token = S.token;
    const user = JSON.parse(localStorage.getItem("user"));
    const studentId = user.id;
    const testId = localStorage.getItem("selectedTestId");
    const [scoreData, setScoreData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [showQuestionDetails, setShowQuestionDetails] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState("correct");
    const navigate = useNavigate();

    // Fetch score data
    useEffect(() => {
        const fetchScoreData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${config.apiUrl}/test-results/student/${studentId}/test/${testId}`,
                    {
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch score data");
                }

                const data = await response.json();
                console.log("Score Data:", data);
                setScoreData(data);
            } catch (err) {
                console.error("Error fetching score data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch(
                    `${config.apiUrl}/rankings/test/${testId}/top`,
                    {
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("Leaderboard Data:", data);
                    setLeaderboardData(data);
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            }
        };

        if (testId && studentId) {
            fetchScoreData();
            fetchLeaderboardData();
        }
    }, [testId, studentId, token]);

    const handleChange = () => {
        // Clean up localStorage
        localStorage.removeItem("submittedData");
        localStorage.removeItem("selectedExamDuration");
        localStorage.removeItem("timerDuration");
        localStorage.removeItem("start_time");
        localStorage.removeItem("submissionResult");
        localStorage.removeItem("testDuration");
        localStorage.removeItem("end_time");
        localStorage.removeItem("selectedTestName");
        localStorage.removeItem("exam_id");
        localStorage.removeItem("selectedTestDetails");
        localStorage.removeItem("selectedLanguage");
        localStorage.removeItem("uniqueSubjects");
        localStorage.removeItem("submissionInProgress");
        localStorage.removeItem("selectedSubjectId");
        localStorage.removeItem("testId");
        localStorage.removeItem("testStartTime");
        localStorage.removeItem("questionTimeSpent");
        
        navigate("/");
    };

    useEffect(() => {
        const handlePopState = () => {
            navigate('/', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    // Generate PDF with all questions
    const handlePDFDownload = () => {
        setDownloading(true);
        
        try {
            const doc = new jsPDF();
            const margin = 15;
            let yPos = margin;
            
            // Add Title
            doc.setFontSize(20);
            doc.setTextColor(40, 53, 147); // Indigo color
            doc.text(`Test Report: ${scoreData?.testName || "Test"}`, margin, yPos);
            yPos += 10;
            
            // Add Student Info
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            yPos += 5;
            doc.text(`Student: ${user.name}`, margin, yPos);
            yPos += 6;
            doc.text(`Test Date: ${scoreData?.testAttemptedDate || "N/A"}`, margin, yPos);
            yPos += 6;
            doc.text(`Total Marks: ${scoreData?.totalMarks || 0}`, margin, yPos);
            yPos += 6;
            doc.text(`Obtained Marks: ${scoreData?.totalObtainedMarks || 0}`, margin, yPos);
            yPos += 6;
            doc.text(`Correct Answers: ${scoreData?.noOfCorrectAns || 0}`, margin, yPos);
            yPos += 6;
            doc.text(`Incorrect Answers: ${scoreData?.noOfInCorrectAns || 0}`, margin, yPos);
            yPos += 6;
            doc.text(`Time Spent: ${scoreData?.timeSpent || "N/A"}`, margin, yPos);
            yPos += 10;
            
            // Add Performance Summary
            doc.setFontSize(14);
            doc.setTextColor(40, 53, 147);
            doc.text("Performance Summary", margin, yPos);
            yPos += 10;
            
            // Add correct questions section
            if (scoreData?.correctQuestions?.length > 0) {
                doc.setFontSize(12);
                doc.setTextColor(0, 128, 0); // Green for correct
                doc.text("Correctly Answered Questions:", margin, yPos);
                yPos += 8;
                
                scoreData.correctQuestions.forEach((question, index) => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin;
                    }
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${index + 1}. ${question.questionText}`, margin, yPos);
                    yPos += 6;
                    
                    // Add options
                    question.options.forEach((option, optIndex) => {
                        const prefix = option.isCorrect ? "✓ " : "  ";
                        doc.text(`   ${prefix}${option.optionText}`, margin + 5, yPos);
                        yPos += 5;
                    });
                    yPos += 3;
                });
                yPos += 5;
            }
            
            // Add incorrect questions section
            if (scoreData?.incorrectQuestions?.length > 0) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = margin;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(255, 0, 0); // Red for incorrect
                doc.text("Incorrectly Answered Questions:", margin, yPos);
                yPos += 8;
                
                scoreData.incorrectQuestions.forEach((question, index) => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin;
                    }
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${index + 1}. ${question.questionText}`, margin, yPos);
                    yPos += 6;
                    
                    // Add options
                    question.options.forEach((option, optIndex) => {
                        const prefix = option.isCorrect ? "✓ " : "✗ ";
                        doc.text(`   ${prefix}${option.optionText}`, margin + 5, yPos);
                        yPos += 5;
                    });
                    yPos += 3;
                });
                yPos += 5;
            }
            
            // Add unanswered questions section
            if (scoreData?.unansweredQuestions?.length > 0) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = margin;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(128, 128, 128); // Gray for unanswered
                doc.text("Unanswered Questions:", margin, yPos);
                yPos += 8;
                
                scoreData.unansweredQuestions.forEach((question, index) => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin;
                    }
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${index + 1}. ${question.questionText}`, margin, yPos);
                    yPos += 6;
                    
                    // Add options
                    question.options.forEach((option, optIndex) => {
                        const prefix = option.isCorrect ? "✓ " : "  ";
                        doc.text(`   ${prefix}${option.optionText}`, margin + 5, yPos);
                        yPos += 5;
                    });
                    yPos += 3;
                });
            }
            
            // Add footer
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - margin - 20, doc.internal.pageSize.height - margin);
                doc.text("Generated by MockTest Platform", margin, doc.internal.pageSize.height - margin);
            }
            
            // Save the PDF
            doc.save(`${scoreData?.testName || 'Test'}_Report_${user.name}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    // Render questions based on type
    const renderQuestions = (questions, type) => {
        if (!questions || questions.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No {type} questions
                </div>
            );
        }

        return questions.map((question, index) => (
            <div key={index} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                            Q{index + 1}. {question.questionText}
                        </h4>
                        {question.questionImageUrl && (
                            <div className="mt-2">
                                <img 
                                    src={question.questionImageUrl} 
                                    alt="Question" 
                                    className="max-w-full h-auto max-h-48 rounded-md"
                                />
                            </div>
                        )}
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                Subject: {question.subjectName}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Language: {question.language}
                            </span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        type === "correct" ? "bg-green-100 text-green-800" :
                        type === "incorrect" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                        {type === "correct" ? "Correct" : 
                         type === "incorrect" ? "Incorrect" : 
                         "Unanswered"}
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, optIndex) => (
                        <div 
                            key={optIndex}
                            className={`p-3 rounded-lg border ${
                                option.isCorrect 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-white border-gray-200'
                            } ${type === "incorrect" && option.isCorrect ? 'border-2 border-green-500' : ''}`}
                        >
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                    option.isCorrect 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                </div>
                                <div className="flex-1">
                                    {option.optionImageUrl ? (
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 mb-2">{option.optionText}</span>
                                            <img 
                                                src={option.optionImageUrl} 
                                                alt={`Option ${optIndex + 1}`}
                                                className="max-w-full h-auto max-h-32 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-700">{option.optionText}</span>
                                    )}
                                </div>
                                {option.isCorrect && (
                                    <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                    Marks: {question.marks}
                </div>
            </div>
        ));
    };

    const renderContent = () => {
        switch (activeTab) {
            case "testResult":
                return (
                    <div className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500">
                        <div className="text-center mb-6 md:mb-8 lg:mb-10">
                            <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-800 flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                                <FaUserAlt className="text-indigo-600 text-2xl md:text-3xl lg:text-4xl mr-2" />
                                Candidate:{" "}
                                <span className="text-indigo-600 ml-2 font-bold">
                                    {user.name}
                                </span>
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                                Test Date:{" "}
                                <span className="font-medium text-gray-700">
                                    {scoreData?.testAttemptedDate || "N/A"}
                                </span>
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-4 sm:space-x-8 lg:space-x-12">
                            {/* Total Marks */}
                            <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg">
                                <FaTrophy className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                                    Total Marks
                                </p>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                                    {scoreData?.totalMarks || "0"}
                                </p>
                            </div>
                            
                            {/* Score Circle */}
                            <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64">
                                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                                <div className="absolute w-full h-full rounded-full border-8 border-indigo-500 animate-pulse"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-2xl">
                                    <FaTrophy className="text-white text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3" />
                                    <p className="text-3xl md:text-4xl lg:text-6xl font-extrabold">
                                        {scoreData?.totalObtainedMarks || "0"}
                                    </p>
                                    <p className="text-xs md:text-sm lg:text-lg mt-1 md:mt-2 font-medium">
                                        Obtained Marks
                                    </p>
                                </div>
                            </div>
                            
                            {/* Time Taken */}
                            <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg">
                                <MdTimer className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                                    Time Taken
                                </p>
                                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-indigo-600">
                                    {scoreData?.timeSpent || "N/A"}
                                </p>
                            </div>
                        </div>
                        
                        {/* Performance Stats */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg">
                                <p className="text-sm md:text-lg text-gray-600 mb-2 font-medium">
                                    Correct Answers
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-green-600">
                                    {scoreData?.noOfCorrectAns || "0"}
                                </p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg">
                                <p className="text-sm md:text-lg text-gray-600 mb-2 font-medium">
                                    Incorrect Answers
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-red-600">
                                    {scoreData?.noOfInCorrectAns || "0"}
                                </p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg">
                                <p className="text-sm md:text-lg text-gray-600 mb-2 font-medium">
                                    Rank
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-blue-600">
                                    #{scoreData?.currentRank || "N/A"}
                                </p>
                            </div>
                        </div>
                        
                        {/* Question Details Button */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowQuestionDetails(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
                            >
                                View Question Details
                            </button>
                        </div>
                    </div>
                );

            case "scoreReport":
                return (
                    <div className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500">
                        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                                Detailed Score Report
                            </h3>
                            <div className="relative group flex items-center">
                                <button
                                    onClick={handlePDFDownload}
                                    className="text-indigo-600 hover:text-indigo-800 text-3xl transition duration-300"
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <ImSpinner2 className="animate-spin" />
                                    ) : (
                                        <TbFileDownload />
                                    )}
                                </button>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center space-x-2">
                                        <span>Download detailed report as PDF</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6 text-sm md:text-base">
                            Detailed analysis of your test performance including all questions with correct answers.
                        </p>
                        
                        {/* Question Type Tabs */}
                        <div className="flex space-x-4 mb-8">
                            <button
                                onClick={() => setSelectedQuestionType("correct")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "correct"
                                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Correct ({scoreData?.correctQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setSelectedQuestionType("incorrect")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "incorrect"
                                        ? "bg-red-100 text-red-800 border-2 border-red-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Incorrect ({scoreData?.incorrectQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setSelectedQuestionType("unanswered")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "unanswered"
                                        ? "bg-gray-200 text-gray-800 border-2 border-gray-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Unanswered ({scoreData?.unansweredQuestions?.length || 0})
                            </button>
                        </div>
                        
                        {/* Questions Display */}
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            {selectedQuestionType === "correct" && 
                                renderQuestions(scoreData?.correctQuestions, "correct")}
                            {selectedQuestionType === "incorrect" && 
                                renderQuestions(scoreData?.incorrectQuestions, "incorrect")}
                            {selectedQuestionType === "unanswered" && 
                                renderQuestions(scoreData?.unansweredQuestions, "unanswered")}
                        </div>
                    </div>
                );

            case "leaderboard":
                return (
                    <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-500">
                        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
                            Leaderboard - {scoreData?.testName || "Test"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            See how you rank among other participants. Top performers are highlighted.
                        </p>
                        
                        {/* Leaderboard Table */}
                        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full text-sm sm:text-base text-gray-700">
                                <thead>
                                    <tr className="bg-indigo-100 text-indigo-700">
                                        <th className="p-4 text-left font-semibold">Rank</th>
                                        <th className="p-4 text-left font-semibold">Student Name</th>
                                        <th className="p-4 text-left font-semibold">Score</th>
                                        <th className="p-4 text-left font-semibold">Time Taken</th>
                                        <th className="p-4 text-left font-semibold">Correct Answers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData?.rankings?.map((participant, index) => (
                                        <tr
                                            key={participant.id}
                                            className={`border-b hover:bg-indigo-50 transition-all duration-300 ${
                                                participant.studentId == studentId
                                                    ? "bg-yellow-100 font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    {participant.rank === 1 && (
                                                        <AiOutlineTrophy className="text-yellow-500 text-xl mr-2" />
                                                    )}
                                                    {participant.rank === 2 && (
                                                        <AiOutlineTrophy className="text-gray-400 text-xl mr-2" />
                                                    )}
                                                    {participant.rank === 3 && (
                                                        <AiOutlineTrophy className="text-yellow-800 text-xl mr-2" />
                                                    )}
                                                    <span className={`font-bold ${
                                                        participant.rank === 1 ? "text-yellow-600" :
                                                        participant.rank === 2 ? "text-gray-500" :
                                                        participant.rank === 3 ? "text-yellow-800" :
                                                        "text-indigo-600"
                                                    }`}>
                                                        #{participant.rank}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {participant.studentName}
                                                {participant.studentId == studentId && (
                                                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                        You
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {participant.totalMarksObtained}
                                            </td>
                                            <td className="p-4">
                                                {participant.timeSpent}
                                            </td>
                                            <td className="p-4">
                                                {participant.noOfCorrectAnswers}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Summary Stats */}
                        {leaderboardData && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex flex-wrap justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <p className="text-sm text-gray-600">Total Participants</p>
                                        <p className="text-lg font-bold text-indigo-600">
                                            {leaderboardData.total || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Your Rank</p>
                                        <p className="text-lg font-bold text-indigo-600">
                                            #{scoreData?.currentRank || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8 flex justify-center items-center">
                            <AiOutlineTrophy className="text-5xl text-indigo-600 mr-3" />
                            <p className="text-lg sm:text-xl text-indigo-600 font-semibold">
                                Congratulations to the top performers!
                            </p>
                        </div>
                    </div>
                );
        }
    };

    // Question Details Modal
    const QuestionDetailsModal = () => {
        if (!showQuestionDetails) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Question Details
                        </h3>
                        <button
                            onClick={() => setShowQuestionDetails(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto max-h-[70vh]">
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setSelectedQuestionType("correct")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "correct"
                                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Correct ({scoreData?.correctQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setSelectedQuestionType("incorrect")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "incorrect"
                                        ? "bg-red-100 text-red-800 border-2 border-red-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Incorrect ({scoreData?.incorrectQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setSelectedQuestionType("unanswered")}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    selectedQuestionType === "unanswered"
                                        ? "bg-gray-200 text-gray-800 border-2 border-gray-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Unanswered ({scoreData?.unansweredQuestions?.length || 0})
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto pr-2">
                            {selectedQuestionType === "correct" && 
                                renderQuestions(scoreData?.correctQuestions, "correct")}
                            {selectedQuestionType === "incorrect" && 
                                renderQuestions(scoreData?.incorrectQuestions, "incorrect")}
                            {selectedQuestionType === "unanswered" && 
                                renderQuestions(scoreData?.unansweredQuestions, "unanswered")}
                        </div>
                    </div>
                    
                    <div className="p-6 border-t flex justify-end">
                        <button
                            onClick={() => setShowQuestionDetails(false)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-tl from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <ImSpinner2 className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-tl from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                    <p className="text-red-600 text-lg mb-4">Error: {error}</p>
                    <button
                        onClick={handleChange}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-tl from-blue-50 to-indigo-100 p-4 relative">
            <RiCloseLine
                className="absolute top-4 right-4 text-2xl sm:text-3xl text-gray-600 cursor-pointer hover:text-indigo-600 transition-all duration-300 z-10"
                onClick={handleChange}
            />

            <div className="w-full max-w-7xl mx-auto text-center font-sans text-gray-800 p-8 sm:p-12">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-8 sm:mb-12 tracking-wider">
                    Test Results: {scoreData?.testName || "Test"}
                </h2>
                
                {/* Remarks Banner */}
                {scoreData?.remark && (
                    <div className={`mb-8 p-4 rounded-lg ${
                        scoreData.remark.includes("Excellent") ? "bg-green-100 text-green-800" :
                        scoreData.remark.includes("Good") ? "bg-blue-100 text-blue-800" :
                        scoreData.remark.includes("Average") ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                    }`}>
                        <p className="text-lg font-medium">{scoreData.remark}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex justify-center space-x-6 sm:space-x-12 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab("testResult")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 rounded-lg ${
                            activeTab === "testResult"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                    >
                        <AiOutlineFileDone className="mr-2 text-xl sm:text-2xl" />
                        Test Result
                    </button>

                    <button
                        onClick={() => setActiveTab("scoreReport")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 rounded-lg ${
                            activeTab === "scoreReport"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                    >
                        <HiOutlineDocumentText className="mr-2 text-xl sm:text-2xl" />
                        Score Report
                    </button>

                    <button
                        onClick={() => setActiveTab("leaderboard")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 rounded-lg ${
                            activeTab === "leaderboard"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                    >
                        <AiOutlineTrophy className="mr-2 text-xl sm:text-2xl" />
                        Leaderboard
                    </button>
                </div>

                {/* Render Content Based on Active Tab */}
                {renderContent()}
                
                {/* Question Details Modal */}
                <QuestionDetailsModal />
            </div>
        </div>
    );
};

export default Score;