import React from "react";

// Import logos (ensure correct paths)
import sscLogo from "../../assets/ssc-logo.png";
import sbiLogo from "../../assets/sbi-logo.png";
import railwayLogo from "../../assets/railway-logo.png";
import ibpsLogo from "../../assets/ibps-logo.png";

// Sample data mimicking the structure from the image
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <h2 className="text-4xl font-extrabold text-black mb-2">
        Our Extensive List Of <span className="text-[#007bff]">Exams</span>
      </h2>
      <p className="text-[20px] text-gray-600 mb-8">
        <span className="text-[#007bff] font-bold">5+</span> exams for your
        preparation
      </p>

      {/* Grid Layout for Exam Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {examData.map((exam, index) => (
          <div
            key={index}
            className="bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out" // Added hover effect
          >
            <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center">
              {/* Dynamic rendering of logo based on exam category */}
              <img
                src={logoMap[exam.exam]} // Dynamically show the logo based on the exam type
                alt={`${exam.exam} logo`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
            <p className="text-gray-600">{exam.exam}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
