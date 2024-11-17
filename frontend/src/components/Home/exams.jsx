import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext"; // Import user context

// Import logos (ensure correct paths)
import sscLogo from "../../assets/ssc-logo.png";
import sbiLogo from "../../assets/sbi-logo.png";
import railwayLogo from "../../assets/railway-logo.png";
import ibpsLogo from "../../assets/ibps-logo.png";
import defenceLogo from "../../assets/Defence.jpg"
import rbiLogo from "../../assets/RBI.jpg"


const examData = [
  { name: "SSC CGL", exam: "SSC Exam" },
  { name: "SSC GD", exam: "SSC Exam" },
  { name: "SSC CHSL", exam: "SSC Exam" },
  { name: "SSC MTS", exam: "SSC Exam" },
  { name: "SSC STENO", exam: "SSC Exam" },
  { name: "SSC CPO", exam: "SSC Exam" },
  { name: "Agniveer Army", exam: "Defence Exam" },
  { name: "Agniveer AirForce", exam: "Defence Exam" },
  { name: "Assam Rifles", exam: "Defence Exam" },
  { name: "CRPF", exam: "Defence Exam" },
  { name: "BSF", exam: "Defence Exam" },
  { name: "RRB NTPC", exam: "Railway Exam" },
  { name: "RRB SI", exam: "Railway Exam" },
  { name: "RRB ALP", exam: "Railway Exam" },
  { name: "RRB Group D", exam: "Railway Exam" },
  { name: "IBPS Clerk", exam: "IBPS Exam" },
  { name: "IBPS PO", exam: "IBPS Exam" },
  { name: "SBI Clerk", exam: "SBI Exam" },
  { name: "SBI PO", exam: "SBI Exam" },
  { name: "RBI PO", exam: "RBI Exam" },
  { name: "RBI Clerk", exam: "RBI Exam" },
];

// Map exam categories to logo variables
const logoMap = {
  "SSC Exam": sscLogo,
  "SBI Exam": sbiLogo,
  "IBPS Exam": ibpsLogo,
  "Railway Exam": railwayLogo,
  "Defence Exam": defenceLogo,
  "RBI Exam": rbiLogo,
};

const Exams = () => {
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0); // Track visible cards
  const ref = useRef(null);
  const { user } = useUser(); // Get user from context
  const navigate = useNavigate();
  const itemsPerPage = 8; // Define how many cards to show per page

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCount(1);
          const interval = setInterval(() => {
            setCount((prevCount) => {
              if (prevCount < 20) {
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
  }, [ref]);

  const handleCardClick = (exam) => {
    if (user && user.type === "student") {
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
                    src={logoMap[exam.exam]}
                    alt={`${exam.exam} logo`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                <p className="text-gray-600">{exam.exam}</p>
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
