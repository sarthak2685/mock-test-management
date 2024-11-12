import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import Maths from "../../assets/mathh.png";
import Reasoning from "../../assets/reasoning.png";
import Science from "../../assets/science.png";
import Gk from "../../assets/gk.png";
import English from "../../assets/english.png"; 


const examData = [
  { name: "Maths", exam: "Chapter 1-10" },
  { name: "Reasoning", exam: "Chapter 1-10" },
  { name: "English", exam: "Chapter 1-10" },
  { name: "Science", exam: "Chapter 1-10" },
  { name: "GK/GS", exam: "Chapter 1-10" },
];

const logoMap = {
  Maths: Maths,
  Reasoning: Reasoning,
  English: English,
  Science: Science,
  "GK/GS": Gk,
};

const Subject = () => {
  const [count, setCount] = useState(1);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCount(1);
          const interval = setInterval(() => {
            setCount((prevCount) => {
              if (prevCount < 5) {
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
  const navigate = useNavigate();

  const handleCardClick = (subjectName) => {
    navigate(`/chapters/${subjectName}`);
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6">
        Explore Our <span className="text-blue-600">Subjects</span>
      </h1>
      <h6 className="text-lg text-gray-500 text-center mb-12">
        Over <span className="text-blue-500 font-bold">{count}+</span> exams for comprehensive preparation
      </h6>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {examData.map((exam, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:rotate-1 hover:shadow-2xl duration-300 ease-in-out"
            onClick={() => handleCardClick(exam.name)}
          >
            <div className="w-24 h-24 rounded-full mb-6 flex items-center justify-center bg-white shadow-md">
              <img
                src={logoMap[exam.name]}
                alt={`${exam.name} logo`}
                className="w-20 h-20 object-contain rounded-full transform transition duration-300 ease-in-out hover:scale-110 hover:brightness-110"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{exam.name}</h3>
            <p className="text-gray-600 mb-4">{exam.exam}</p>
          </div>
        ))}
        
        
      </div>
    </div>
  );
};

export default Subject;
