import React, { useState, useRef, useEffect } from "react";
import { FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineTrophy } from "react-icons/ai";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

const ChapterScore = () => {
    const [activeTab, setActiveTab] = useState("testResult");
    const S = JSON.parse(localStorage.getItem("user"));
    const institute_name = S.institute_name;
    const token = S.token;
    const [testResultData, setTestResultData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const testName = localStorage.getItem("selectedTestName") || "N/A";
      const testId = localStorage.getItem("testId");
    const user = JSON.parse(localStorage.getItem("user"));
    const studentId = user.id;
    const [leaderboardData, setLeaderboardData] = useState([]);
    const navigate = useNavigate();
    const [downloading, setDownloading] = useState(false);

    // Fetch test result data
    useEffect(() => {
        const fetchTestResult = async () => {
            if (!studentId || !testId) {
                setError("Missing student ID or test ID");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(
                    `${config.apiUrl}/test-results/student/${studentId}/test/${testId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch test result: ${response.status}`);
                }
                
                const data = await response.json();
                setTestResultData(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching test result:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestResult();
    }, [studentId, testId, token]);

    // Fetch leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!testId) return;

            try {
                const response = await fetch(
                    `${config.apiUrl}/rankings/test/${testId}/top`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
                }
                
                const data = await response.json();
                setLeaderboardData(data.rankings || []);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            }
        };

        fetchLeaderboard();
    }, [testId, token]);

    // Calculate time spent
    const calculateTimeSpent = () => {
        if (!testResultData?.timeSpent || testResultData.timeSpent === "Not Available") {
            return "Not Available";
        }
        return testResultData.timeSpent;
    };

    // Calculate total questions
    const calculateTotalQuestions = () => {
        if (!testResultData) return 0;
        const correct = testResultData.noOfCorrectAns || 0;
        const incorrect = testResultData.noOfInCorrectAns || 0;
        const unanswered = testResultData.unansweredQuestions?.length || 0;
        return correct + incorrect + unanswered;
    };

    const handleChange = () => {
        // Clear all test-related localStorage items
        const itemsToRemove = [
            "submittedData",
            "selectedExamDuration",
            "timerDuration",
            "start_time",
            "submissionResult",
            "testDuration",
            "end_time",
            "selectedTestName",
            "exam_id",
            "selectedChapter",
            "noOfQuestions",
            "positiveMarks",
            "negativeMarks",
            "submissionInProgress",
            "selectedSubjectId"
        ];
        
        itemsToRemove.forEach(item => localStorage.removeItem(item));
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

    // Generate PDF from frontend
    const generatePDF = () => {
        setDownloading(true);
        
        try {
            // Dynamically import jsPDF only when needed
            import("jspdf").then(({ jsPDF }) => {
                import("jspdf-autotable").then(() => {
                    const doc = new jsPDF();
                    
                    // Title
                    doc.setFontSize(20);
                    doc.text("Test Performance Report", 105, 20, { align: "center" });
                    
                    // Student Information
                    doc.setFontSize(12);
                    doc.text(`Student Name: ${user.name}`, 20, 40);
                    doc.text(`Test Name: ${testResultData?.testName || testName}`, 20, 50);
                    doc.text(`Institute: ${institute_name}`, 20, 60);
                    doc.text(`Test Date: ${testResultData?.testAttemptedDate || "N/A"}`, 20, 70);
                    
                    // Performance Summary
                    doc.setFontSize(14);
                    doc.text("Performance Summary", 20, 90);
                    doc.setFontSize(12);
                    
                    const summaryData = [
                        ["Total Marks", testResultData?.totalMarks || "N/A"],
                        ["Obtained Marks", testResultData?.totalObtainedMarks || "N/A"],
                        ["Correct Answers", testResultData?.noOfCorrectAns || 0],
                        ["Incorrect Answers", testResultData?.noOfInCorrectAns || 0],
                        ["Unanswered Questions", testResultData?.unansweredQuestions?.length || 0],
                        ["Negative Marks", testResultData?.negativeMarks || 0],
                        ["Rank", testResultData?.currentRank || "N/A"],
                        ["Time Spent", calculateTimeSpent()]
                    ];
                    
                    // Add summary table
                    doc.autoTable({
                        startY: 100,
                        head: [["Metric", "Value"]],
                        body: summaryData,
                        theme: "striped",
                        headStyles: { fillColor: [66, 84, 245] }
                    });
                    
                    // Questions Breakdown
                    doc.setFontSize(14);
                    doc.text("Questions Breakdown", 20, doc.lastAutoTable.finalY + 20);
                    
                    // Correct Questions
                    if (testResultData?.correctQuestions?.length > 0) {
                        doc.setFontSize(12);
                        doc.text("Correct Questions:", 20, doc.lastAutoTable.finalY + 40);
                        
                        testResultData.correctQuestions.forEach((question, index) => {
                            const yPos = doc.lastAutoTable.finalY + 50 + (index * 30);
                            if (yPos > 280) {
                                doc.addPage();
                            }
                            doc.text(`${index + 1}. ${question.questionText}`, 25, yPos > 280 ? 20 : yPos);
                        });
                    }
                    
                    // Incorrect Questions
                    if (testResultData?.incorrectQuestions?.length > 0) {
                        doc.addPage();
                        doc.setFontSize(14);
                        doc.text("Incorrect Questions:", 20, 20);
                        
                        testResultData.incorrectQuestions.forEach((question, index) => {
                            const yPos = 30 + (index * 30);
                            if (yPos > 280) {
                                doc.addPage();
                            }
                            doc.setFontSize(12);
                            doc.text(`${index + 1}. ${question.questionText}`, 25, yPos > 280 ? 20 : yPos);
                        });
                    }
                    
                    // Save PDF
                    doc.save(`${testName}-report.pdf`);
                    setDownloading(false);
                });
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            setDownloading(false);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <ImSpinner2 className="animate-spin text-4xl text-indigo-600" />
                    <span className="ml-4 text-lg text-gray-600">Loading test results...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                    <h3 className="text-2xl font-semibold text-red-600 mb-4">Error</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }

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
                                Test Date:{" "}
                                <span className="font-medium text-gray-700">
                                    {testResultData?.testAttemptedDate || "N/A"}
                                </span>
                            </p>
                            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                                Remark:{" "}
                                <span className={`font-medium ${testResultData?.remark === "Needs Improvement" ? "text-red-600" : "text-green-600"}`}>
                                    {testResultData?.remark || "N/A"}
                                </span>
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-4 sm:space-x-8 lg:space-x-12">
                            <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                                <FaTrophy className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                                    Total Marks
                                </p>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                                    {testResultData?.totalMarks || "N/A"}
                                </p>
                            </div>
                            
                            <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64">
                                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all">
                                    <FaTrophy className="text-white text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3" />
                                    <p className="text-3xl md:text-4xl lg:text-6xl font-extrabold">
                                        {testResultData?.totalObtainedMarks || "0"}
                                    </p>
                                    <p className="text-xs md:text-sm lg:text-lg mt-1 md:mt-2 font-medium">
                                        Obtained Marks
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                                <MdTimer className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                                    Time Taken
                                </p>
                                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-indigo-600">
                                    {calculateTimeSpent()}
                                </p>
                            </div>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-600">Correct</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {testResultData?.noOfCorrectAns || 0}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-600">Incorrect</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {testResultData?.noOfInCorrectAns || 0}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-600">Unanswered</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {testResultData?.unansweredQuestions?.length || 0}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-600">Rank</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    #{testResultData?.currentRank || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "scoreReport":
                return (
                    <div className="bg-white p-4 md:p-8 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                                Score Report
                            </h3>
                            <div className="relative group flex items-center">
                                <button
                                    onClick={generatePDF}
                                    className="text-indigo-600 hover:text-indigo-400 text-4xl transition duration-300"
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <ImSpinner2 className="animate-spin" />
                                    ) : (
                                        <FaCloudDownloadAlt />
                                    )}
                                </button>

                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center space-x-2">
                                        <span>Click to download your result!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 md:mb-8 text-sm md:text-base">
                            Detailed breakdown of your performance with question-wise analysis.
                        </p>

                        {/* Performance Table */}
                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg mb-8">
                            <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-indigo-600 mb-4">
                                Performance Overview
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-gray-700 text-xs sm:text-sm md:text-base border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-indigo-200 text-indigo-700">
                                            <th className="p-2 md:p-4 text-left border-b border-gray-300">
                                                Metric
                                            </th>
                                            <th className="p-2 md:p-4 text-center border-b border-gray-300">
                                                Count
                                            </th>
                                            <th className="p-2 md:p-4 text-center border-b border-gray-300">
                                                Marks
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 md:p-4 text-left">Correct Answers</td>
                                            <td className="p-2 md:p-4 text-center">{testResultData?.noOfCorrectAns || 0}</td>
                                            <td className="p-2 md:p-4 text-center text-green-600 font-semibold">
                                                +{testResultData?.noOfCorrectAns || 0}
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 md:p-4 text-left">Incorrect Answers</td>
                                            <td className="p-2 md:p-4 text-center">{testResultData?.noOfInCorrectAns || 0}</td>
                                            <td className="p-2 md:p-4 text-center text-red-600 font-semibold">
                                                -{testResultData?.negativeMarks || 0}
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 md:p-4 text-left">Unanswered</td>
                                            <td className="p-2 md:p-4 text-center">{testResultData?.unansweredQuestions?.length || 0}</td>
                                            <td className="p-2 md:p-4 text-center">0</td>
                                        </tr>
                                        <tr className="bg-indigo-50 font-bold">
                                            <td className="p-2 md:p-4 text-left">Total</td>
                                            <td className="p-2 md:p-4 text-center">{calculateTotalQuestions()}</td>
                                            <td className="p-2 md:p-4 text-center text-indigo-600">
                                                {testResultData?.totalObtainedMarks || 0}/{testResultData?.totalMarks || 0}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Questions Review */}
                        <div className="space-y-8">
                            {/* Correct Questions */}
                            {testResultData?.correctQuestions?.length > 0 && (
                                <div className="bg-green-50 p-4 md:p-6 rounded-xl shadow-lg">
                                    <h4 className="text-lg md:text-xl font-semibold text-green-600 mb-4">
                                        Correct Questions ({testResultData.correctQuestions.length})
                                    </h4>
                                    {testResultData.correctQuestions.slice(0, 3).map((question, index) => (
                                        <div key={index} className="mb-4 p-3 bg-white rounded-lg">
                                            <p className="font-medium mb-2">{index + 1}. {question.questionText}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {question.options.map((option, optIndex) => (
                                                    <div 
                                                        key={optIndex}
                                                        className={`p-2 rounded ${option.isCorrect ? 'bg-green-100 border border-green-500' : 'bg-gray-50'}`}
                                                    >
                                                        {option.optionText}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Incorrect Questions */}
                            {testResultData?.incorrectQuestions?.length > 0 && (
                                <div className="bg-red-50 p-4 md:p-6 rounded-xl shadow-lg">
                                    <h4 className="text-lg md:text-xl font-semibold text-red-600 mb-4">
                                        Incorrect Questions ({testResultData.incorrectQuestions.length})
                                    </h4>
                                    {testResultData.incorrectQuestions.slice(0, 3).map((question, index) => (
                                        <div key={index} className="mb-4 p-3 bg-white rounded-lg">
                                            <p className="font-medium mb-2">{index + 1}. {question.questionText}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {question.options.map((option, optIndex) => (
                                                    <div 
                                                        key={optIndex}
                                                        className={`p-2 rounded ${option.isCorrect ? 'bg-green-100 border border-green-500' : 'bg-red-100'}`}
                                                    >
                                                        {option.optionText}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                        <div className="flex justify-center mt-4">
                            <p className="text-base sm:text-base font-medium text-gray-600">
                                Institute Name: {institute_name}
                            </p>
                        </div>

                        {/* Leaderboard Table */}
                        <div className="mt-8 overflow-x-auto">
                            <table className="min-w-full table-auto text-sm sm:text-base text-gray-700">
                                <thead>
                                    <tr className="bg-indigo-100 text-indigo-700">
                                        <th className="p-3 text-left">Rank</th>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-center">Score</th>
                                        <th className="p-3 text-center">Time</th>
                                        <th className="p-3 text-center">Correct</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((participant) => {
                                        const isCurrentUser = participant.studentId === user.id;
                                        
                                        return (
                                            <tr
                                                key={participant.id}
                                                className={`border-b hover:bg-indigo-50 transition-all duration-300 ${isCurrentUser ? "bg-yellow-100 font-bold" : ""}`}
                                            >
                                                <td className="p-3 font-semibold text-indigo-600 text-left">
                                                    {participant.rank === 1 ? (
                                                        <AiOutlineTrophy className="text-yellow-500 text-xl" />
                                                    ) : participant.rank === 2 ? (
                                                        <AiOutlineTrophy className="text-gray-400 text-xl" />
                                                    ) : participant.rank === 3 ? (
                                                        <AiOutlineTrophy className="text-amber-700 text-xl" />
                                                    ) : (
                                                        participant.rank
                                                    )}
                                                </td>
                                                <td className="p-3 text-left">
                                                    {participant.studentName}
                                                    {isCurrentUser && " (You)"}
                                                </td>
                                                <td className="p-3 text-center font-semibold">
                                                    {participant.totalMarksObtained}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {participant.timeSpent || "N/A"}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {participant.noOfCorrectAnswers}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {leaderboardData.length === 0 && (
                            <div className="text-center mt-8 py-12">
                                <AiOutlineTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No leaderboard data available yet.</p>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <AiOutlineTrophy className="text-6xl text-indigo-600 mx-auto" />
                            <p className="text-xl mt-4 text-indigo-600 font-semibold">
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
                onClick={handleChange}
            />

            <div className="w-full max-w-7xl mx-auto text-center font-sans text-gray-800 p-8 sm:p-12">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-8 sm:mb-12 -mt-12 tracking-wider">
                    Test Performance
                </h2>
                
                {testResultData && (
                    <div className="mb-8 text-left bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{testResultData.testName}</h3>
                        <div className="flex flex-wrap gap-4 text-gray-600">
                            <span className="bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                Exam Type: {testResultData.examType || "N/A"}
                            </span>
                            <span className="bg-green-50 px-3 py-1 rounded-full text-sm">
                                Score: {testResultData.totalObtainedMarks}/{testResultData.totalMarks}
                            </span>
                            <span className="bg-purple-50 px-3 py-1 rounded-full text-sm">
                                Rank: #{testResultData.currentRank || "N/A"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex justify-center space-x-6 sm:space-x-12 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab("testResult")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "testResult"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <AiOutlineFileDone className="mr-2 text-xl sm:text-2xl" />
                        Test Result
                    </button>

                    <button
                        onClick={() => setActiveTab("scoreReport")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "scoreReport"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <HiOutlineDocumentText className="mr-2 text-xl sm:text-2xl" />
                        Score Report
                    </button>

                    <button
                        onClick={() => setActiveTab("leaderboard")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "leaderboard"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <AiOutlineTrophy className="mr-2 text-xl sm:text-2xl" />
                        Leaderboard
                    </button>
                </div>

                {/* Render Content Based on Active Tab */}
                {renderContent()}
            </div>
        </div>
    );
};

export default ChapterScore;