import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Import logos (ensure correct paths)
import sscLogo from "../../assets/SSC.webp";
import sbiLogo from "../../assets/banking.webp";
import railwayLogo from "../../assets/railway.webp";
import defenceLogo from "../../assets/defence.webp"; // Add a logo for defence

const examData = [
  { 
    name: "SSC CGL", 
    exam: "SSC Exam", 
    totalTests: 15, 
    timing: "1.5 hrs",
    questions: 200
  },
  { 
    name: "BANK PO", 
    exam: "Banking Exam", 
    totalTests: 10, 
    timing: "1 hr",
    questions: 100 
  },
  { 
    name: "RRB NTPC", 
    exam: "Railway Exam", 
    totalTests: 12, 
    timing: "1.5 hrs",
    questions: 150 
  },
  { 
    name: "Defence", 
    exam: "Defence Exam", 
    totalTests: 8, 
    timing: "2 hrs",
    questions: 250 
  },
];

// Map exam categories to logo variables
const logoMap = {
  "SSC Exam": sscLogo,
  "Banking Exam": sbiLogo,
  "Railway Exam": railwayLogo,
  "Defence Exam": defenceLogo,
};

const FreeMock = () => {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            // No need to update count here
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
        Free Mock<span className="text-[#007bff]">Test</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {examData.map((exam, index) => (
          <Link to="/mock-demo" key={index}>
            <div
              className="bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
            >
              <div className="w-24 h-24 rounded-full mb-4 flex text-center items-center justify-center">
                <img
                  src={logoMap[exam.exam]}
                  alt={`${exam.exam} logo`}
                  className="w-full h-full object-cover rounded-full  "
                />
              </div>
              <h3 className="text-xl font-bold">{exam.name}</h3>
              <p className="font-semibold">{exam.exam}</p>
              <p className="font-semibold mt-2 ">Questions: {exam.questions}</p>
              <p className="font-semibold">Test Duration: {exam.timing}</p>
              <p className="font-semibold">Total Tests: {exam.totalTests}</p>
              <Link to="/mock-demo">
                <button className="mt-4 px-4 py-2 items-center bg-[#007bff] text-white rounded-md hover:bg-blue-600 transition-colors">
                  Start Test
                </button>
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FreeMock;
