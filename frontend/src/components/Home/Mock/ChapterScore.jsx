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
import "jspdf-autotable";
import { ImSpinner2 } from "react-icons/im";


const ChapterScore = () => {
    const [activeTab, setActiveTab] = useState("testResult");

    const S = JSON.parse(localStorage.getItem("user"));
    const institute_name = S.institute_name;
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

    const language = localStorage.getItem("selectedLanguage") || "english";
    const queryParams = `student_id=${studentId}&test_name=${testName}&start_time=${startTime}&end_time=${endTime}&language=${language}`;
    const apiUrl = `${config.apiUrl}/get-chapter-analysis/?${queryParams}`;
    const [downloading, setDownloading] = useState(false);


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
                setExamMarks(data);
                setAnalysisData(data.data);
                console.log("gautam", data.data)
                setSectionsData(data.average_marks);
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
        localStorage.removeItem("selectedChapter");
        localStorage.removeItem("testDuration");
        localStorage.removeItem("noOfQuestions");
        localStorage.removeItem("positiveMarks");
        localStorage.removeItem("negativeMarks");
        localStorage.removeItem("submissionInProgress");
        localStorage.removeItem("selectedSubjectId");

        navigate("/");
    };

    useEffect(() => {
        const handlePopState = () => {
            // Redirect to home if back button is pressed
            navigate('/', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const reportRef = useRef();
    const handlePDFDownload = async () => {
        setDownloading(true);
        const apiUrl = `${config.apiUrl}/generate-report/?student_id=${studentId}&exam_id=${examId}&test_name=${testName}&institute_name=${institute_name}&language=${language}`;

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }

            // Check the Content-Type header
            const contentType = response.headers.get("content-type");
            if (contentType === "application/pdf") {
                // If the response is a PDF, download it directly
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `${testName}-report.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } else {
                // Handle other response types (e.g., hexadecimal or JSON)
                const responseData = await response.text();
                console.log(responseData); // Inspect the response

                // If the response is hexadecimal, convert it to binary
                const binaryData = hexToBinary(responseData);
                const blob = new Blob([binaryData], {
                    type: "application/pdf",
                });

                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `${testName}-report.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }
        } catch (error) {
            console.error("Error downloading PDF:", error.message);
            alert("Failed to download the PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    // Helper function to convert hexadecimal to binary
    const hexToBinary = (hexString) => {
        const cleanedHexString = hexString.replace(/\s+/g, "");
        if (!/^[0-9A-Fa-f]+$/.test(cleanedHexString)) {
            throw new Error("Invalid hexadecimal string");
        }
        const bytes = new Uint8Array(cleanedHexString.length / 2);
        for (let i = 0; i < cleanedHexString.length; i += 2) {
            bytes[i / 2] = parseInt(cleanedHexString.substr(i, 2), 16);
        }
        return bytes;
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
                                <span className="text-indigo-600 ml-2 font-bold">
                                    {user.name}
                                </span>
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                                Start Time:{" "}
                                <span className="font-medium text-gray-700">
                                    {startTime}
                                </span>{" "}
                                | Submit Time:{" "}
                                <span className="font-medium text-gray-700">
                                    {endTime}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-4 sm:space-x-8 lg:space-x-12">
                            <div className="text-center p-4 md:p-6 lg:p-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500">
                                <FaTrophy className="text-indigo-600 text-3xl md:text-4xl lg:text-5xl mx-auto mb-2 md:mb-3 lg:mb-4" />
                                <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-2 md:mb-3 font-medium">
                                    Total Mark
                                </p>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                                    {(() => {
                                        const subject = Object.keys(
                                            analysisData || {}
                                        )[0];
                                        const chapter = Object.keys(
                                            analysisData?.[subject] || {}
                                        ).find((key) =>
                                            key.startsWith("Chapter")
                                        );
                                        return examMarks.marks || "N/A";
                                    })()}{" "}
                                </p>
                            </div>
                            <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64">
                                <div className="absolute w-full h-full rounded-full border-8 border-indigo-200"></div>
                                <div
                                    className="absolute w-full h-full rounded-full border-8 border-indigo-500 animate-pulse"
                                    style={{
                                        clipPath:
                                            "polygon(50% 0%, 100% 0, 100% 50%, 0% 50%, 0 0%)",
                                    }}
                                ></div>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all">
                                    <FaTrophy className="text-white text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3" />
                                    <p className="text-3xl md:text-4xl lg:text-6xl font-extrabold">
                                        {(() => {
                                            const subject = Object.keys(
                                                analysisData || {}
                                            )[0];
                                            const chapter = Object.keys(analysisData?.[subject] || {}).find(
                                                (key) => analysisData?.[subject]?.[key]?.hasOwnProperty("obtained_marks")
                                            );
                                            return (
                                                analysisData?.[subject]?.[chapter]?.obtained_marks?.toString() || "0"
                                            );
                                        })()}{" "}
                                    </p>
                                    <p className="text-xs md:text-sm lg:text-lg mt-1 md:mt-2 font-medium">
                                        Candidate's Mark
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
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <ImSpinner2 className="animate-spin" />
                                    ) : (
                                        <FaCloudDownloadAlt />
                                    )}
                                </button>

                                {/* Tooltip Popup */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            Click to download your result!
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4 md:mb-8 text-sm md:text-base">
                            Gain insights into your performance with a
                            subject-wise breakdown and detailed analysis.
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
                                        {(() => {
                                            const subject = Object.keys(
                                                analysisData || {}
                                            )[0];
                                            const chapter = Object.keys(analysisData?.[subject] || {}).find(
                                                (key) => analysisData?.[subject]?.[key]?.hasOwnProperty("question_stats")
                                            );

                                            // Retrieve chapter data and question statistics
                                            const chapterData = analysisData?.[subject]?.[chapter] || {};
                                            const questionStats = chapterData?.question_stats || {};

                                            const {
                                                correct_answers,
                                                wrong_answers,
                                                unattempted,
                                            } = questionStats;


                                            // Render the table row if data is available
                                            return (
                                                <tr className="border-b">
                                                    <td className="p-2 md:p-4 text-left">
                                                        {chapter || testName}
                                                    </td>
                                                    <td className="p-2 md:p-4 text-center">
                                                        {correct_answers || 0}
                                                    </td>
                                                    <td className="p-2 md:p-4 text-center">
                                                        {wrong_answers || 0}
                                                    </td>
                                                    <td className="p-2 md:p-4 text-center">
                                                        {unattempted || 0}
                                                    </td>
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
                                    Compare your performance with peers across
                                    sections.
                                </p>
                                <div className="flex flex-wrap justify-between gap-4">
                                    {(() => {
                                        // Get the first subject from sectionData and analysisData
                                        const subject = Object.keys(sectionData || {})[0];
                                        const subj = Object.keys(analysisData || {})[0];

                                        // Dynamically find the first valid chapter/section under subject in sectionData
                                        const chapter = Object.keys(sectionData?.[subject] || {}).find(
                                            (key) =>
                                                typeof sectionData?.[subject]?.[key] === "object" &&
                                                sectionData?.[subject]?.[key] !== null
                                        );

                                        // Dynamically find the first valid chapter/section under subject in analysisData
                                        const chap = Object.keys(analysisData?.[subj] || {}).find(
                                            (key) =>
                                                typeof analysisData?.[subj]?.[key] === "object" &&
                                                analysisData?.[subj]?.[key] !== null &&
                                                (analysisData?.[subj]?.[key]?.hasOwnProperty("obtained_marks") ||
                                                    analysisData?.[subj]?.[key]?.hasOwnProperty("question_stats"))
                                        );

                                        return (
                                            <div className="w-full sm:w-1/2 lg:w-1/3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300">
                                                <h5 className="text-sm md:text-lg font-semibold text-indigo-600 mb-2">
                                                    {chapter}
                                                </h5>
                                                <div className="text-xs md:text-sm">
                                                    <p className="text-gray-700 mb-1">
                                                        <strong>
                                                            Your Score:
                                                        </strong>{" "}
                                                        {analysisData?.[subj]?.[
                                                            chap
                                                        ]?.obtained_marks ||
                                                            "0"}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Avg Score:
                                                        </strong>{" "}
                                                        {
                                                            sectionData?.[
                                                                subject
                                                            ]?.[chapter]
                                                                ?.average_marks
                                                        }
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
                            See how you rank among other participants. Top
                            performers are highlighted.
                        </p>
                        <div className="flex justify-center  mt-4">
                            <p className="text-base sm:text-base font-medium  text-gray-600">
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
                                        <th className="p-3 text-center">
                                            Score
                                        </th>
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
                                                className={`border-b hover:bg-indigo-50 transition-all duration-300 ${participant.student_id ===
                                                        user.id
                                                        ? "bg-yellow-100 font-bold"
                                                        : ""
                                                    }`}
                                            >
                                                <td className="p-3 font-semibold text-indigo-600 text-left">
                                                    {participant.rank === 1 ? (
                                                        <AiOutlineTrophy className="text-red-500" />
                                                    ) : participant.rank ===
                                                        2 ? (
                                                        <AiOutlineTrophy className="text-gray-300" />
                                                    ) : participant.rank ===
                                                        3 ? (
                                                        <AiOutlineTrophy className="text-brown-400" />
                                                    ) : (
                                                        participant.rank
                                                    )}
                                                </td>
                                                <td className="p-3 text-left ">
                                                    {participant.student_name}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {participant.total_obtained}
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
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "testResult"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <AiOutlineFileDone className="mr-2 text-xl sm:text-2xl" />{" "}
                        Test Result
                    </span>

                    <span
                        onClick={() => setActiveTab("scoreReport")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "scoreReport"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <HiOutlineDocumentText className="mr-2 text-xl sm:text-2xl" />{" "}
                        Score Report
                    </span>

                    <span
                        onClick={() => setActiveTab("leaderboard")}
                        className={`px-6 sm:px-8 py-4 cursor-pointer text-lg sm:text-xl font-medium flex items-center transition-all duration-500 transform hover:scale-105 rounded-lg hover:bg-indigo-50 ${activeTab === "leaderboard"
                                ? "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-xl"
                                : "text-gray-600 hover:text-indigo-600"
                            }`}
                    >
                        <AiOutlineTrophy className="mr-2 text-xl sm:text-2xl" />{" "}
                        Leaderboard
                    </span>
                </div>

                {/* Render Content Based on Active Tab */}
                {renderContent()}
            </div>
        </div>
    );
};

export default ChapterScore;
