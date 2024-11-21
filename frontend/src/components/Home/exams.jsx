import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext"; // Import user context

// Import logos (ensure correct paths)
import sscLogo from "../../assets/ssc-logo.png";
import sbiLogo from "../../assets/sbi-logo.png";
import railwayLogo from "../../assets/railway-logo.png";
import ibpsLogo from "../../assets/ibps-logo.png";
import defenceLogo from "../../assets/Defence.jpg";
import rbiLogo from "../../assets/RBI.jpg";
import config from "../../config";

// Map exam categories to logo variables
// const logoMap = {
//   "SSC Exam": sscLogo,
//   "SBI Exam": sbiLogo,
//   "IBPS Exam": ibpsLogo,
//   "Railway Exam": railwayLogo,
//   "Defence Exam": defenceLogo,
//   "RBI Exam": rbiLogo,
// };
const logoMap = {
  SSC: sscLogo,
  SBI: sbiLogo,
  IBPS: ibpsLogo,
  Railway: railwayLogo,
  Defence: defenceLogo,
  RBI: rbiLogo,
};
const categoryMap = {
  SSC: "SSC Exam",
  DEFENCE: "Defence Exam",
  RAILWAY: "Railway Exam",
  BANK: "Bank Exam",
};

const getCategory = (examSlno) => {
  const prefix = examSlno.split("_")[0]; // Extract prefix from the serial number
  return categoryMap[prefix] || "General Exam"; // Default fallback
};

const Exams = () => {
  const [examData, setExamData] = useState([]);
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/exams/`);
        const data = await response.json();
        setExamData(data);
        setCount(data.length-1);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchExamData();
  }, []);
  

  const getLogo = (name) => {
    // Find a logo based on keywords in the name
    for (const key in logoMap) {
      if (name.includes(key)) {
        return logoMap[key];
      }
    }
    return null; // Fallback if no keyword matches
  };

  const handleCardClick = (exam) => {
    localStorage.setItem("selectedSubjectId", exam.id);

    if (user?.type === "student") {
      navigate("/mock-test", { state: { exam } });
    } else {
      navigate("/login");
    }
  };
  

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
  

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-5xl font-extrabold text-black mb-4 text-center">
        Our Extensive List Of <span className="text-[#007bff]">Exams</span>
      </h1>
      <h6 className="text-[20px] text-gray-600 mb-8 text-center">
        <span className="text-[#007bff] font-bold">{count}+</span> exams for your preparation
      </h6>

      <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300 z-10"
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examData
            .slice(currentIndex, currentIndex + itemsPerPage)
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
                    src={getLogo(exam.name)} // Dynamically determine logo
                    alt={`${exam.name} logo`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                <p className="text-gray-600">{getCategory(exam.exam_slno)}</p> {/* Show user-friendly label */}
              </div>
            ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-3 py-2 rounded-full shadow hover:bg-gray-300 z-10"
          disabled={currentIndex + itemsPerPage >= examData.length}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Exams;