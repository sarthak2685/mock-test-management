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
    autoplay: true, // Enable auto-scrolling
    autoplaySpeed: 3000, // Duration before sliding to the next item (in milliseconds)
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative">
  {/* Ribbon */}
  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
    Free
  </div>

  {/* Logo and Title */}
  <div className="flex items-center space-x-3">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <img
        src={logoMap[exam.exam]}
        alt={`${exam.exam} logo`}
        className="w-10 h-10 object-contain"
      />
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-800">{exam.name}</h3>
      <p className="text-sm text-gray-500">{exam.exam}</p>
    </div>
  </div>

  {/* Info Section */}
  <div className="mt-4 space-y-2 text-sm text-gray-700">
    <div className="flex items-center justify-between">
      <span className="flex items-center">
        <FaQuestionCircle className="text-blue-500 text-lg mr-2" />
        Questions
      </span>
      <span className="font-medium">{exam.questions}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="flex items-center">
        <AiOutlineClockCircle className="text-blue-500 text-lg mr-2" />
        Duration
      </span>
      <span className="font-medium">{exam.timing}</span>
    </div>
  </div>

  {/* Action Button */}
  <Link to="/guestinstruction">
    <button className="mt-6 w-full py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-all">
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
