import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Import logos (ensure correct paths)
import sscLogo from "../../assets/ssc-logo.png";
import sbiLogo from "../../assets/sbi-logo.png";
import railwayLogo from "../../assets/railway-logo.png";
import ibpsLogo from "../../assets/ibps-logo.png";

const examData = [
  { name: "SSC CGL", exam: "SSC Exam" },
  { name: "SSC CHSL", exam: "SSC Exam" },
  { name: "SSC MTS", exam: "SSC Exam" },
  { name: "SBI PO", exam: "SBI Exam" },
  { name: "IBPS PO", exam: "IBPS Exam" },
  { name: "RRB NTPC", exam: "Railway Exam" },
  { name: "RRB JE", exam: "Railway Exam" },
  { name: "RRB Group D", exam: "Railway Exam" },
];

// Map exam categories to logo variables
const logoMap = {
  "SSC Exam": sscLogo,
  "SBI Exam": sbiLogo,
  "IBPS Exam": ibpsLogo,
  "Railway Exam": railwayLogo,
};

const Exams = () => {
  const [count, setCount] = useState(1);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCount(1);
          const interval = setInterval(() => {
            setCount((prevCount) => {
              if (prevCount < 10) {
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

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-5xl font-extrabold text-black mb-4 text-center">
        Our Extensive List Of <span className="text-[#007bff]">Exams</span>
      </h1>
      <h6 className="text-[20px] text-gray-600 mb-8 text-center">
        <span className="text-[#007bff] font-bold">{count}+</span> exams for your preparation
      </h6>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {examData.map((exam, index) => (
          <div
            key={index}
            className="bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
          >
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

        {/* Add a card that navigates to the MockDemo page
        <Link to="/mock-demo">
          <div className="bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
            <h3 className="text-xl font-bold text-gray-800">Take a Mock Test</h3>
            <p className="text-gray-600">Test your knowledge with our mock test.</p>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default Exams;
