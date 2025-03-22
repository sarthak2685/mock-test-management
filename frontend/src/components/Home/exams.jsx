import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext"; // Import user context
import ClipLoader from "react-spinners/ClipLoader";

// Import logos
import sscLogo from "../../assets/ssc-logo.png";
import sbiLogo from "../../assets/sbi-logo.png";
import railwayLogo from "../../assets/railway-logo.png";
import ibpsLogo from "../../assets/ibps-logo.png";
import defenceLogo from "../../assets/Defence.jpg";
import rbiLogo from "../../assets/RBI.jpg";
import config from "../../config";

// Map exam categories to logos
const logoMap = {
    SSC: sscLogo,
    SBI: sbiLogo,
    IBPS: ibpsLogo,
    Railway: railwayLogo,
    Defence: defenceLogo,
    RBI: rbiLogo,
};

// Map prefixes to category labels
const categoryMap = {
    SSC: "SSC Exam",
    DEFENCE: "Defence Exam",
    RRB: "Railway Exam",
    IBPS: "Bank Exam",
    SBI: "Bank Exam",
    RBI: "Bank Exam",
    NABARD: "Bank Exam",
    UP: "Police exam",
    Bihar: "Police exam",
    BSSC: "BSSC exam",
};

// Function to get category based on exam serial number
const getCategory = (examSlno) => {
    const prefix = examSlno.split("_")[0]; // Extract prefix
    return categoryMap[prefix] || "General Exam"; // Default fallback
};

const Exams = () => {
    const [examData, setExamData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef(null);
    const { user } = useUser();
    const navigate = useNavigate();
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(1);

    // Fetch exam data on component mount
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/exams/`);
                const data = await response.json();
                setExamData(data);
                setCount(data.length - 1);
            } catch (error) {
                console.error("Error fetching exam data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, []);

    // Get the appropriate logo for an exam
    const getLogo = (exam) => {
        if (exam.image) return exam.image; // Use image from the exam data if available

        // Match a logo based on exam name
        for (const key in logoMap) {
            if (exam.name.includes(key)) {
                return logoMap[key];
            }
        }
        return null; // Default fallback if no match found
    };

    // Handle card click navigation
    const handleCardClick = (exam) => {
        localStorage.setItem("selectedSubjectId", exam.id);

        if (user?.type === "student") {
            navigate("/mock-test", { state: { exam } });
        } else {
            navigate("/login");
        }
    };

    // Handle pagination
    const handleNext = () => {
        if (currentIndex + itemsPerPage < examData.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    useEffect(() => {
        const handleScroll = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setCount(1);
                    const interval = setInterval(() => {
                        setCount((prevCount) => {
                            if (prevCount < examData.length) {
                                return prevCount + 1;
                            } else {
                                clearInterval(interval);
                                return prevCount;
                            }
                        });
                    }, 200);
                    return () => clearInterval(interval);
                }
            });
        };

        const observer = new IntersectionObserver(handleScroll);
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, examData]);

    return (
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
                <>
                    {" "}
                    <h1 className="text-5xl font-extrabold text-black mb-4 text-center">
                        Our Extensive List Of{" "}
                        <span className="text-[#007bff]">Exams</span>
                    </h1>
                    <div className="flex justify-center items-center h-96">
                        <ClipLoader size={80} color="#007bff" />
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-5xl font-extrabold text-black mb-4 text-center">
                        Our Extensive List Of{" "}
                        <span className="text-[#007bff]">Exams</span>
                    </h1>
                    <h6 className="text-[20px] text-gray-600 mb-8 text-center">
                        <span className="text-blue-500 font-bold">
                            {count}+
                        </span>
                        exams for your preparation
                    </h6>

                    <div className="relative">
                        {/* Pagination controls for desktop */}
                        <button
                            onClick={handlePrev}
                            className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300 z-10 hidden md:block"
                            disabled={currentIndex === 0}
                        >
                            &lt;
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {examData
                                .slice(
                                    currentIndex,
                                    currentIndex + itemsPerPage
                                )
                                .map((exam, index) => (
                                    <div
                                        key={index}
                                        className="relative bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out cursor-pointer"
                                        onClick={() => handleCardClick(exam)}
                                    >
                                        {(!user || user.type !== "student") && (
                                            <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-red-400 text-xs font-bold text-white py-1 px-3 rounded-full shadow-md">
                                                Locked
                                            </div>
                                        )}
                                        <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center">
                                            <img
                                                src={getLogo(exam)} // Dynamically determine logo
                                                alt={`${exam.name} logo`}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {exam.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {getCategory(exam.exam_slno)}
                                        </p>
                                    </div>
                                ))}
                        </div>

                        {/* Pagination controls for mobile */}
                        <div className="flex justify-between items-center mt-4 md:hidden">
                            <button
                                onClick={handlePrev}
                                className="bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300"
                                disabled={currentIndex === 0}
                            >
                                Prev
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300"
                                disabled={
                                    currentIndex + itemsPerPage >=
                                    examData.length
                                }
                            >
                                Next
                            </button>
                        </div>

                        {/* Pagination arrows for desktop */}
                        <button
                            onClick={handleNext}
                            className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300 z-10 hidden md:block"
                            disabled={
                                currentIndex + itemsPerPage >= examData.length
                            }
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Exams;
