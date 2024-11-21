import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import { AiFillLock } from "react-icons/ai";
import config from "../../config";

import Maths from "../../assets/mathh.png";
import Reasoning from "../../assets/reasoning.png";
import Science from "../../assets/science.png";
import Gk from "../../assets/gk.png";
import English from "../../assets/english.png";

const logoMap = {
  Maths: Maths,
  Reasoning: Reasoning,
  English: English,
  Science: Science,
  "GK/GS": Gk,
};

const Subject = () => {
  const [subjectData, setSubjectData] = useState([]); // State for subjects
  const [count, setCount] = useState(1);
  const ref = useRef(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/exam-subjects/`);
        const data = await response.json();
        const filteredData = data.filter((subject) => subject.for_exam === null);
        const enrichedData = filteredData.map((subject) => ({
          ...subject,
          exam: "Chapter 1-10", 
        }));
        console.log("subject",filteredData)
        setSubjectData(enrichedData); 
        setCount(enrichedData.length-1);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjects();
  }, []);

  // Scroll animation for the count
  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCount(1);
          const interval = setInterval(() => {
            setCount((prevCount) => {
              if (prevCount < subjectData.length) {
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
  }, [ref, subjectData]);

  const handleCardClick = (subjectName, subjectId) => {
    localStorage.setItem("selectedSubjectId", subjectId);
    if (user && user.type === "student") {
      navigate(`/chapters/${subjectName}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6">
        Explore Our <span className="text-blue-600">Subjects</span>
      </h1>
      <h6 className="text-lg text-gray-500 text-center mb-12">
        Over <span className="text-blue-500 font-bold">{count}+</span> subjects for comprehensive preparation
      </h6>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {subjectData.map((subject, index) => (
          <div
            key={index}
            className={`relative bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg rounded-lg p-6 flex flex-col items-center 
              transition-transform transform hover:scale-105 hover:rotate-1 hover:shadow-2xl duration-300 ease-in-out ${
                !user ? "cursor-pointer" : "cursor-default"
              }`}
            onClick={() => handleCardClick(subject.name,subject.id)}
          >
             {(!user || user.type !== "student") && (
                <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-red-400 text-xs font-bold text-white py-1 px-3 rounded-full shadow-md">
                Locked
              </div>
            )}

            <div className="relative w-24 h-24 rounded-full mb-6 flex items-center justify-center bg-white shadow-md">
              <img
                src={logoMap[subject.name] || Maths} // Dynamically determine logo, fallback to Maths
                alt={`${subject.name} logo`}
                className="w-20 h-20 object-contain rounded-full transform transition duration-300 ease-in-out hover:scale-110 hover:brightness-110"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{subject.name}</h3>
            <p className="text-gray-600 mb-4">{subject.exam}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subject;
