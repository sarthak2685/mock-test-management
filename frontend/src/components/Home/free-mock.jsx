import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuestionCircle } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai"
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

  // Slider settings for responsiveness
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 slides by default (large screen)
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For medium screens
        settings: {
          slidesToShow: 2, // Show 2 slides for medium screens
        },
      },
      {
        breakpoint: 600, // For small screens
        settings: {
          slidesToShow: 1, // Show 1 slide for small screens
        },
      },
    ],
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-5xl font-extrabold text-black mb-4 text-center">
        Free Mock<span className="text-[#007bff]">Test</span>
      </h1>

      <Slider {...settings}>
        {examData.map((exam, index) => (
          <div key={index} className="p-4">
            <div
              className="bg-white border rounded-md shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
            >
              <div className="w-24 h-24 rounded-full mb-4 flex text-center items-center justify-center">
                <img
                  src={logoMap[exam.exam]}
                  alt={`${exam.exam} logo`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold">{exam.name}</h3>
              <p className="font-semibold">{exam.exam}</p>
              <div className="flex items-start flex-col">
              <div className="flex items-start mt-2">
                <FaQuestionCircle className="text-blue-500 text-2xl mr-2 w-8" />
                <p className="font-bold">Questions: <span className="font-semibold">{exam.questions}</span></p>
              </div>

              <div className="flex items-start mt-2">
                <AiOutlineClockCircle className="text-blue-500 text-2xl mr-2 w-8" />
                <p className="font-bold">Test Duration: <span className="font-semibold">{exam.timing}</span></p>
              </div>
              </div>

              <Link to="/mock-demo">
                <button className="mt-4 px-4 py-2 items-center bg-[#007bff] text-white rounded-md hover:bg-blue-600 transition-colors">
                  Start Test
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FreeMock;
